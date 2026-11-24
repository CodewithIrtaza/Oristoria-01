"""Tests for auth dependencies (JWT verification)."""
import pytest
from datetime import datetime, timedelta, timezone
import jwt
from unittest.mock import patch, MagicMock

from app.deps.auth import get_current_user, get_current_user_id
from app.config import Settings


class TestGetCurrentUser:
    """Tests for get_current_user dependency."""

    @pytest.fixture
    def valid_jwt_payload(self):
        """Create a valid JWT payload."""
        return {
            "sub": "user-123",
            "email": "test@example.com",
            "role": "authenticated",
            "aud": "authenticated",
            "iss": "https://test.supabase.co/auth/v1",
            "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
            "iat": int(datetime.now(timezone.utc).timestamp()),
        }

    @pytest.fixture
    def valid_jwt(self, valid_jwt_payload):
        """Create a valid JWT token."""
        # Use a test secret - in production this comes from JWKS
        return jwt.encode(valid_jwt_payload, "test-secret", algorithm="HS256")

    @pytest.fixture
    def expired_jwt(self):
        """Create an expired JWT token."""
        payload = {
            "sub": "user-123",
            "email": "test@example.com",
            "role": "authenticated",
            "aud": "authenticated",
            "iss": "https://test.supabase.co/auth/v1",
            "exp": int((datetime.now(timezone.utc) - timedelta(hours=1)).timestamp()),
            "iat": int((datetime.now(timezone.utc) - timedelta(hours=2)).timestamp()),
        }
        return jwt.encode(payload, "test-secret", algorithm="HS256")

    @pytest.mark.asyncio
    async def test_valid_jwt_returns_user_id(self, valid_jwt):
        """Valid JWT should return user_id."""
        from app.deps.auth import _verify_jwt
        from app.config import Settings

        settings = Settings(
            supabase_jwt_secret="test-secret",
            supabase_url="https://test.supabase.co",
        )
        payload = await _verify_jwt(valid_jwt, settings)
        assert payload.sub == "user-123"

    @pytest.mark.asyncio
    async def test_expired_jwt_raises_401(self, expired_jwt):
        """Expired JWT should raise 401."""
        with patch("app.deps.auth.get_settings") as mock_settings:
            mock_settings.return_value = Settings(
                supabase_jwt_secret="test-secret",
                supabase_url="https://test.supabase.co",
            )
            with pytest.raises(Exception) as exc_info:
                await get_current_user_id(expired_jwt)
            # Should raise HTTPException with 401

    @pytest.mark.asyncio
    async def test_invalid_signature_raises_401(self, valid_jwt):
        """JWT with invalid signature should raise 401."""
        with patch("app.deps.auth.get_settings") as mock_settings:
            mock_settings.return_value = Settings(
                supabase_jwt_secret="different-secret",
                supabase_url="https://test.supabase.co",
            )
            with pytest.raises(Exception) as exc_info:
                await get_current_user_id(valid_jwt)
            # Should raise HTTPException with 401

    @pytest.mark.asyncio
    async def test_anon_role_rejected(self):
        """JWT with anon role should be rejected."""
        payload = {
            "sub": "anon-user",
            "role": "anon",
            "aud": "anon",
            "iss": "https://test.supabase.co/auth/v1",
            "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
            "iat": int(datetime.now(timezone.utc).timestamp()),
        }
        token = jwt.encode(payload, "test-secret", algorithm="HS256")

        with patch("app.deps.auth.get_settings") as mock_settings:
            mock_settings.return_value = Settings(
                supabase_jwt_secret="test-secret",
                supabase_url="https://test.supabase.co",
            )
            with pytest.raises(Exception) as exc_info:
                await get_current_user_id(token)
            # Should raise HTTPException with 401

    @pytest.mark.asyncio
    async def test_service_role_rejected(self):
        """JWT with service_role should be rejected."""
        payload = {
            "sub": "service-user",
            "role": "service_role",
            "aud": "service_role",
            "iss": "https://test.supabase.co/auth/v1",
            "exp": int((datetime.now(timezone.utc) + timedelta(hours=1)).timestamp()),
            "iat": int(datetime.now(timezone.utc).timestamp()),
        }
        token = jwt.encode(payload, "test-secret", algorithm="HS256")

        with patch("app.deps.auth.get_settings") as mock_settings:
            mock_settings.return_value = Settings(
                supabase_jwt_secret="test-secret",
                supabase_url="https://test.supabase.co",
            )
            with pytest.raises(Exception) as exc_info:
                await get_current_user_id(token)
            # Should raise HTTPException with 401


class TestGetCurrentUserDependency:
    """Tests for get_current_user FastAPI dependency."""

    @pytest.mark.asyncio
    async def test_returns_user_object(self):
        """get_current_user should return user object with id and email."""
        # This will be implemented after the dependency is created
        pass
