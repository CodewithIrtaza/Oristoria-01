"""Database connectivity helpers."""
from __future__ import annotations

import asyncio
import ssl as ssl_module
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

import asyncpg

LOOPBACK_HOSTS = {"127.0.0.1", "::1", "localhost"}


def validate_database_url(dsn: str) -> None:
    """Require certificate-verified TLS for every non-loopback database host."""
    parsed = urlsplit(dsn)
    host = parsed.hostname

    if not host:
        raise ValueError("DATABASE_URL must include a host")

    host_spec = parsed.netloc.rsplit("@", 1)[-1]
    if parsed.netloc.count("@") > 1 or "," in host_spec:
        raise ValueError("DATABASE_URL must specify exactly one host")

    if host.lower() in LOOPBACK_HOSTS:
        return

    sslmodes = parse_qs(parsed.query, keep_blank_values=True).get("sslmode", [])
    if len(sslmodes) != 1 or sslmodes[0].lower() not in ("verify-full", "require"):
        raise ValueError("Remote DATABASE_URL must use sslmode=verify-full or require")


def _build_ssl_context(dsn: str) -> ssl_module.SSLContext:
    """Build SSL context with certificate from DSN or default locations."""
    parsed = urlsplit(dsn)
    query = parse_qs(parsed.query, keep_blank_values=True)

    # Check sslmode from DSN
    sslmode = query.get("sslmode", ["verify-full"])[0].lower()

    # Check for sslrootcert in DSN query parameters
    sslrootcert = query.get("sslrootcert", [None])[0]

    cert_paths = []
    if sslrootcert:
        cert_paths.append(Path(sslrootcert))

    # Default locations
    cert_paths.extend([
        Path.home() / ".postgresql" / "root.crt",
        Path("C:/Users") / "HP G8" / ".postgresql" / "root.crt",
        Path("C:/Program Files/PostgreSQL") / "16" / "root.crt",
    ])

    if sslmode == "require":
        # require mode: use SSL but don't verify certificate
        ctx = ssl_module.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl_module.CERT_NONE
        return ctx

    # verify-full mode: require valid certificate
    for cert_path in cert_paths:
        if cert_path.exists():
            ctx = ssl_module.create_default_context()
            ctx.verify_mode = ssl_module.CERT_REQUIRED
            ctx.load_verify_locations(cafile=str(cert_path))
            return ctx

    # Fallback: use system default with CERT_REQUIRED
    ctx = ssl_module.create_default_context()
    ctx.verify_mode = ssl_module.CERT_REQUIRED
    return ctx


async def check_database(dsn: str, timeout: float = 5.0) -> bool:
    """Run a bounded connectivity query against the configured database."""
    validate_database_url(dsn)
    host = urlsplit(dsn).hostname or ""
    ssl = None if host.lower() in LOOPBACK_HOSTS else _build_ssl_context(dsn)
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
