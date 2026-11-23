"""Fast tests for database connection safeguards."""
import pytest

from app.db.session import validate_database_url


def test_remote_database_url_requires_verified_tls() -> None:
    with pytest.raises(ValueError, match="sslmode=verify-full"):
        validate_database_url("postgresql://user@db.example.com/postgres")

    validate_database_url("postgresql://user@127.0.0.1/postgres")
    validate_database_url(
        "postgresql://user@db.example.com/postgres?sslmode=verify-full&sslrootcert=ca.crt"
    )
