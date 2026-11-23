"""Database connectivity helpers."""
from __future__ import annotations

import asyncio
from urllib.parse import parse_qs, urlsplit

import asyncpg

LOOPBACK_HOSTS = {"127.0.0.1", "::1", "localhost"}


def validate_database_url(dsn: str) -> None:
    """Require certificate-verified TLS for every non-loopback database host."""
    parsed = urlsplit(dsn)
    host = parsed.hostname

    if not host:
        raise ValueError("DATABASE_URL must include a host")

    if host.lower() in LOOPBACK_HOSTS:
        return

    sslmode = parse_qs(parsed.query).get("sslmode", [""])[0].lower()
    if sslmode != "verify-full":
        raise ValueError("Remote DATABASE_URL must use sslmode=verify-full")


async def check_database(dsn: str, timeout: float = 5.0) -> bool:
    """Run a bounded connectivity query against the configured database."""
    validate_database_url(dsn)

    async with asyncio.timeout(timeout):
        connection = await asyncpg.connect(dsn, timeout=timeout)
        try:
            return await connection.fetchval("SELECT 1") == 1
        finally:
            await connection.close()
