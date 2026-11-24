#!/usr/bin/env python3
"""Seed the onboarding sample source into the dev database (run once per DB).

Idempotent: re-running upserts the same sample row. Requires the tables from
migrations/001_onboarding.sql to exist first.

Usage (from the repo root):
    apps/api/.venv/Scripts/python.exe scripts/seed_dev.py
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API_ROOT = ROOT / "apps/api"
if str(API_ROOT) not in sys.path:
    sys.path.insert(0, str(API_ROOT))

from app.config import get_settings
from app.db.repositories import DEFAULT_SAMPLE, PostgresOnboardingRepository


async def main() -> int:
    settings = get_settings()
    if not settings.database_url:
        print("error: DATABASE_URL is not set", file=sys.stderr)
        return 1

    repo = PostgresOnboardingRepository(settings.database_url.get_secret_value())
    await repo.upsert_sample(DEFAULT_SAMPLE)
    print(
        f"seeded sample '{DEFAULT_SAMPLE.id}' "
        f"({DEFAULT_SAMPLE.page_count} pages) into onboarding_samples"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
