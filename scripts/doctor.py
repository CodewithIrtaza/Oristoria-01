#!/usr/bin/env python3
"""Oristoria environment doctor (TECH_DESIGN section 10.1, check 7).

Loads .env, prints the status of every variable name in .env.example
(SET / MISSING / not-needed-yet), then runs one tiny live check for each
external service whose variables are all SET.

NEVER prints a value: only variable names, statuses, and exception class
names leave this process. Exits non-zero if any live check FAILs.
"""
from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXAMPLE = ROOT / ".env.example"
ENV_FILE = ROOT / ".env"
TIMEOUT = 15.0

# Variables that are deliberately unset until a PRD decision lands.
NOT_NEEDED_YET = {
    "LANGSMITH_API_KEY": "OQ-06 undecided, leave unset (TECH_DESIGN 8)",
}


def load_env() -> None:
    """Load .env into the process environment without overriding real env vars."""
    try:
        from dotenv import load_dotenv
    except ImportError:
        print("warn: python-dotenv not installed; .env not loaded", file=sys.stderr)
        return
    if ENV_FILE.exists():
        load_dotenv(ENV_FILE, override=False)


def example_names() -> list[str]:
    names: list[str] = []
    for line in EXAMPLE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        names.append(line.split("=", 1)[0].strip())
    return names


# --- tiny live checks (one per service) -------------------------------------

async def check_supabase_auth() -> None:
    import httpx

    url = os.environ["SUPABASE_URL"].rstrip("/")
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.get(f"{url}/auth/v1/.well-known/jwks.json")
        resp.raise_for_status()


async def check_database() -> None:
    import asyncpg

    conn = await asyncpg.connect(os.environ["DATABASE_URL"], timeout=TIMEOUT)
    try:
        value = await conn.fetchval("SELECT 1")
    finally:
        await conn.close()
    if value != 1:
        raise RuntimeError("unexpected SELECT 1 result")


async def check_r2() -> None:
    def _head() -> None:
        import boto3
        from botocore.config import Config

        account = os.environ["R2_ACCOUNT_ID"]
        client = boto3.client(
            "s3",
            endpoint_url=f"https://{account}.r2.cloudflarestorage.com",
            aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )
        client.head_bucket(Bucket=os.environ["R2_BUCKET"])

    await asyncio.to_thread(_head)


async def _llm_ping(key_var: str, base_url: str, model: str | None) -> None:
    import httpx

    headers = {"Authorization": f"Bearer {os.environ[key_var]}"}
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        if model:
            resp = await client.post(
                f"{base_url}/chat/completions",
                headers=headers,
                json={
                    "model": model,
                    "messages": [{"role": "user", "content": "ping"}],
                    "max_tokens": 5,
                },
            )
        else:
            resp = await client.get(f"{base_url}/models", headers=headers)
        resp.raise_for_status()


async def check_openrouter() -> None:
    await _llm_ping(
        "OPENROUTER_API_KEY",
        "https://openrouter.ai/api/v1",
        os.environ.get("OPENROUTER_MODEL"),
    )


async def check_groq() -> None:
    await _llm_ping(
        "GROQ_API_KEY",
        "https://api.groq.com/openai/v1",
        os.environ.get("GROQ_MODEL"),
    )


async def check_nim() -> None:
    await _llm_ping(
        "NIM_API_KEY",
        "https://integrate.api.nvidia.com/v1",
        os.environ.get("NIM_MODEL"),
    )


async def check_resend() -> None:
    import httpx

    headers = {"Authorization": f"Bearer {os.environ['RESEND_API_KEY']}"}
    async with httpx.AsyncClient(timeout=TIMEOUT) as client:
        resp = await client.get(
            "https://api.resend.com/emails", headers=headers, params={"limit": "1"}
        )
        # 200 = key works; other 4xx (e.g. missing query params) still proves the
        # key was accepted; only 401/403 mean the key itself is bad.
        if resp.status_code in (401, 403):
            resp.raise_for_status()


async def check_gcp_tasks() -> None:
    def _list_locations() -> None:
        import urllib.request

        from google.auth.transport.requests import Request
        from google.oauth2 import service_account

        creds = service_account.Credentials.from_service_account_file(
            os.environ["GOOGLE_APPLICATION_CREDENTIALS"],
            scopes=["https://www.googleapis.com/auth/cloud-platform"],
        )
        creds.refresh(Request())
        project = os.environ["GOOGLE_CLOUD_PROJECT"]
        request = urllib.request.Request(
            f"https://cloudtasks.googleapis.com/v1/projects/{project}/locations",
            headers={"Authorization": f"Bearer {creds.token}"},
        )
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            if response.status >= 300:
                raise RuntimeError(f"HTTP {response.status}")

    await asyncio.to_thread(_list_locations)


# Service label -> all variables that must be SET -> check coroutine factory.
SERVICES: list[tuple[str, list[str], object]] = [
    ("supabase-auth", ["SUPABASE_URL"], check_supabase_auth),
    ("database", ["DATABASE_URL"], check_database),
    (
        "r2",
        ["R2_ACCOUNT_ID", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"],
        check_r2,
    ),
    ("openrouter", ["OPENROUTER_API_KEY"], check_openrouter),
    ("groq", ["GROQ_API_KEY"], check_groq),
    ("nim", ["NIM_API_KEY"], check_nim),
    ("resend", ["RESEND_API_KEY"], check_resend),
    (
        "gcp-tasks",
        ["GOOGLE_CLOUD_PROJECT", "GOOGLE_APPLICATION_CREDENTIALS"],
        check_gcp_tasks,
    ),
]


def main() -> int:
    load_env()

    print("== env vars (from .env.example) ==")
    for name in example_names():
        if name in NOT_NEEDED_YET:
            print(f"{name}: not-needed-yet ({NOT_NEEDED_YET[name]})")
        elif os.environ.get(name):
            print(f"{name}: SET")
        else:
            print(f"{name}: MISSING")

    print("\n== live checks ==")
    failures = 0
    for label, required, check in SERVICES:
        unset = [var for var in required if not os.environ.get(var)]
        if unset:
            print(f"{label}: skipped ({', '.join(unset)} not set)")
            continue
        try:
            asyncio.run(check())
        except Exception as exc:  # class name only, never the message/value
            failures += 1
            print(f"{label}: FAIL ({type(exc).__name__})")
        else:
            print(f"{label}: OK")

    print(f"\n{failures} live check(s) FAILED" if failures else "\nall live checks passed")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
