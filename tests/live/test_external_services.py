"""One live test per external service (TECH_DESIGN section 5).

Each test SKIPS with a clear message when its key is missing, and performs one
tiny real call when the key is present. Run with:  pytest -m live
Fast tests must never import from this package.
"""
from __future__ import annotations

import asyncio
import os

import pytest

pytestmark = pytest.mark.live

TIMEOUT = 15.0


def _require(*vars_: str) -> None:
    missing = [name for name in vars_ if not os.environ.get(name)]
    if missing:
        pytest.skip(f"{', '.join(missing)} not set - create per docs/ENV_GUIDE.md")


def test_supabase() -> None:
    """Database SELECT 1, falling back to auth JWKS reachability."""
    dsn = os.environ.get("DATABASE_URL")
    if dsn:
        import asyncpg

        async def run() -> int:
            conn = await asyncpg.connect(dsn, timeout=TIMEOUT)
            try:
                return await conn.fetchval("SELECT 1")
            finally:
                await conn.close()

        assert asyncio.run(run()) == 1
        return

    url = os.environ.get("SUPABASE_URL")
    if not url:
        pytest.skip("DATABASE_URL and SUPABASE_URL not set - create per docs/ENV_GUIDE.md")
    import httpx

    resp = httpx.get(f"{url.rstrip('/')}/auth/v1/.well-known/jwks.json", timeout=TIMEOUT)
    assert resp.status_code == 200, f"JWKS endpoint returned HTTP {resp.status_code}"


def test_cloudflare_r2() -> None:
    _require("R2_ACCOUNT_ID", "R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY")
    import boto3
    from botocore.config import Config

    client = boto3.client(
        "s3",
        endpoint_url=f"https://{os.environ['R2_ACCOUNT_ID']}.r2.cloudflarestorage.com",
        aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )
    client.head_bucket(Bucket=os.environ["R2_BUCKET"])


def _llm_ping(key_var: str, model_var: str, base_url: str) -> None:
    _require(key_var)
    import httpx

    headers = {"Authorization": f"Bearer {os.environ[key_var]}"}
    model = os.environ.get(model_var)
    if model:
        resp = httpx.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json={
                "model": model,
                "messages": [{"role": "user", "content": "ping"}],
                "max_tokens": 5,
            },
            timeout=TIMEOUT,
        )
    else:
        resp = httpx.get(f"{base_url}/models", headers=headers, timeout=TIMEOUT)
    assert resp.status_code < 300, f"HTTP {resp.status_code}"


def test_openrouter() -> None:
    _llm_ping("OPENROUTER_API_KEY", "OPENROUTER_MODEL", "https://openrouter.ai/api/v1")


def test_groq() -> None:
    _llm_ping("GROQ_API_KEY", "GROQ_MODEL", "https://api.groq.com/openai/v1")


def test_nim() -> None:
    _llm_ping("NIM_API_KEY", "NIM_MODEL", "https://integrate.api.nvidia.com/v1")


def test_resend() -> None:
    _require("RESEND_API_KEY")
    import httpx

    resp = httpx.get(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {os.environ['RESEND_API_KEY']}"},
        params={"limit": "1"},
        timeout=TIMEOUT,
    )
    # 401/403 = key rejected; any other status means the key was accepted.
    assert resp.status_code not in (401, 403), f"HTTP {resp.status_code}"


def test_google_cloud_tasks() -> None:
    _require("GOOGLE_CLOUD_PROJECT", "GOOGLE_APPLICATION_CREDENTIALS")
    import urllib.request

    from google.auth.transport.requests import Request
    from google.oauth2 import service_account

    creds = service_account.Credentials.from_service_account_file(
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"],
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    creds.refresh(Request())
    request = urllib.request.Request(
        f"https://cloudtasks.googleapis.com/v1/projects/"
        f"{os.environ['GOOGLE_CLOUD_PROJECT']}/locations",
        headers={"Authorization": f"Bearer {creds.token}"},
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
        assert response.status < 300, f"HTTP {response.status}"
