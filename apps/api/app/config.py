"""Typed application settings."""
from functools import lru_cache

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Settings loaded from environment variables and the local .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: SecretStr | None = None
    frontend_origin: str | None = None

    # Supabase Auth
    supabase_url: SecretStr | None = None
    supabase_anon_key: SecretStr | None = None
    supabase_service_role_key: SecretStr | None = None
    supabase_jwt_secret: SecretStr | None = None

    # Auth
    auth_cookie_secret: SecretStr | None = None
    auth_redirect_url: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()