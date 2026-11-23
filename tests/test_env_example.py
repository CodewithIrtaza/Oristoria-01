"""Fast tests: .env.example completeness and emptiness. No keys, no network."""
from __future__ import annotations

import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
EXAMPLE = ROOT / ".env.example"

# Every variable from docs/TECH_DESIGN.md section 8 (source of truth).
REQUIRED = [
    "ENVIRONMENT",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL",
    "MIGRATIONS_DATABASE_URL",
    "R2_ACCOUNT_ID",
    "R2_BUCKET",
    "R2_ACCESS_KEY_ID",
    "R2_SECRET_ACCESS_KEY",
    "LLM_PRIMARY_PROVIDER",
    "OPENROUTER_API_KEY",
    "OPENROUTER_MODEL",
    "GROQ_API_KEY",
    "GROQ_MODEL",
    "NIM_API_KEY",
    "NIM_MODEL",
    "RESEND_API_KEY",
    "EMAIL_FROM",
    "GOOGLE_CLOUD_PROJECT",
    "CLOUD_TASKS_QUEUE",
    "GOOGLE_APPLICATION_CREDENTIALS",
    "CLOUD_RUN_REGION",
    "FRONTEND_ORIGIN",
    "AUTH_REDIRECT_URL",
    "AUTH_COOKIE_SECRET",
    "ADMIN_API_KEY",
    "PLAN_LIMITS_JSON",
    "LANGSMITH_API_KEY",
    "LOG_LEVEL",
    "LIVE_CHECKS_ENABLED",
]


def _assignments() -> list[tuple[str, str]]:
    pairs = []
    for line in EXAMPLE.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, _, value = line.partition("=")
        pairs.append((name.strip(), value.strip()))
    return pairs


def test_every_techn_design_variable_is_in_env_example() -> None:
    listed = {name for name, _ in _assignments()}
    missing = [name for name in REQUIRED if name not in listed]
    assert not missing, f".env.example is missing: {missing}"


def test_every_env_example_value_is_empty() -> None:
    filled = [name for name, value in _assignments() if value]
    assert not filled, f".env.example must contain no values, found: {filled}"


def test_env_file_is_not_tracked_by_git() -> None:
    try:
        result = subprocess.run(
            ["git", "ls-files", "--", ".env"],
            capture_output=True,
            text=True,
            cwd=ROOT,
            check=False,
        )
    except FileNotFoundError:
        pytest.skip("git not available")
    assert result.stdout.strip() == "", ".env must never be tracked by git"
