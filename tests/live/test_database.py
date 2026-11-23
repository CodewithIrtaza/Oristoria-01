"""Live database connectivity check."""
from __future__ import annotations

import asyncio
import os

import pytest

pytestmark = pytest.mark.live


def test_database() -> None:
    dsn = os.environ.get("DATABASE_URL")
    if not dsn:
        pytest.skip("DATABASE_URL not set - waiting for key")

    from app.db.session import check_database

    assert asyncio.run(check_database(dsn)) is True
