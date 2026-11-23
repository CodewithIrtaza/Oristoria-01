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

    sslmodes = parse_qs(parsed.query, keep_blank_values=True).get("sslmode", [])
    if len(sslmodes) != 1 or sslmodes[0].lower() != "verify-full":
        raise ValueError("Remote DATABASE_URL must use sslmode=verify-full")


async def check_database(dsn: str, timeout: float = 5.0) -> bool:
    """Run a bounded connectivity query against the configured database."""
    validate_database_url(dsn)
    host = urlsplit(dsn).hostname or ""
    ssl = None if host.lower() in LOOPBACK_HOSTS else "verify-full"
    connection = None

    try:
        async with asyncio.timeout(timeout):
            connection = await asyncpg.connect(dsn, timeout=timeout, ssl=ssl)
            return await connection.fetchval("SELECT 1") == 1
    finally:
        if connection is not None:
            try:
                async with asyncio.timeout(timeout):
                    await connection.close(timeout=timeout)
            except TimeoutError:
                connection.terminate()
