"""Fast tests for database connection safeguards."""
import asyncio
import time

import asyncpg
import pytest

from app.db.session import check_database, validate_database_url


def test_remote_database_url_requires_verified_tls() -> None:
    with pytest.raises(ValueError, match="sslmode=verify-full"):
        validate_database_url("postgresql://user@db.example.com/postgres")

    validate_database_url("postgresql://user@127.0.0.1/postgres")
    validate_database_url(
        "postgresql://user@db.example.com/postgres?sslmode=verify-full&sslrootcert=ca.crt"
    )


@pytest.mark.parametrize(
    "query",
    [
        "sslmode=",
        "sslmode=verify-full&sslmode=disable",
        "sslmode=verify-full&sslmode=require",
        "sslmode=verify-full&sslmode=verify-full",
    ],
)
def test_remote_database_url_rejects_ambiguous_tls_mode(query: str) -> None:
    with pytest.raises(ValueError, match="sslmode=verify-full"):
        validate_database_url(f"postgresql://user@db.example.com/postgres?{query}")


def test_database_cleanup_is_bounded(monkeypatch: pytest.MonkeyPatch) -> None:
    class SlowCloseConnection:
        def __init__(self) -> None:
            self.terminated = False

        async def fetchval(self, _query: str) -> int:
            return 1

        async def close(self, *, timeout: float | None = None) -> None:
            await asyncio.sleep(2)

        def terminate(self) -> None:
            self.terminated = True

    connection = SlowCloseConnection()

    async def fake_connect(_dsn: str, **_kwargs: object) -> SlowCloseConnection:
        return connection

    monkeypatch.setattr(asyncpg, "connect", fake_connect)

    started = time.monotonic()
    result = asyncio.run(
        check_database("postgresql://user@127.0.0.1/postgres", timeout=0.05)
    )
    elapsed = time.monotonic() - started

    assert result is True
    assert connection.terminated is True
    assert elapsed < 1.0
