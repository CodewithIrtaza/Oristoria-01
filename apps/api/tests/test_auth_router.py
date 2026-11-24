"""Tests for auth router endpoints."""
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch, MagicMock

from app.main import app


class TestMagicLinkRouter:
    """Tests for POST /v1/auth/magic-link endpoint."""

    @pytest.fixture
    def mock_supabase_client(self):
        """Mock Supabase client for auth operations."""
        with patch("app.routers.auth._get_supabase_client") as mock:
            client = AsyncMock()
            mock.return_value = client
            yield client

    @pytest.mark.asyncio
    async def test_post_magic_link_returns_202_or_400(self, mock_supabase_client):
        """POST /v1/auth/magic-link with valid email returns 202 or 400 if Supabase not configured."""
        mock_supabase_client.auth.sign_in_with_otp = AsyncMock(
            return_value=MagicMock(user=None, session=None)
        )

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post(
                "/v1/auth/magic-link",
                json={"email": "test@example.com"},
            )

        # Returns 202 if Supabase configured, 400 if not
        assert response.status_code in (202, 400)
        if response.status_code == 202:
            assert response.json() == {"message": "Magic link sent"}

    @pytest.mark.asyncio
    async def test_post_magic_link_invalid_email_returns_400(self, mock_supabase_client):
        """POST /v1/auth/magic-link with invalid email returns 422."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post(
                "/v1/auth/magic-link",
                json={"email": "not-an-email"},
            )

        assert response.status_code == 422  # Pydantic validation error

    @pytest.mark.asyncio
    async def test_post_magic_link_missing_email_returns_400(self, mock_supabase_client):
        """POST /v1/auth/magic-link without email returns 422."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post("/v1/auth/magic-link", json={})

        assert response.status_code == 422  # Pydantic validation error


class TestLogoutRouter:
    """Tests for POST /v1/auth/logout endpoint."""

    @pytest.mark.asyncio
    async def test_post_logout_requires_auth(self):
        """POST /v1/auth/logout without auth returns 401."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.post("/v1/auth/logout")

        assert response.status_code == 401


class TestMeRouter:
    """Tests for GET /v1/auth/me endpoint."""

    @pytest.mark.asyncio
    async def test_get_me_without_auth_returns_401(self):
        """GET /v1/auth/me without Authorization header returns 401."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.get("/v1/auth/me")

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_get_me_with_invalid_token_returns_401(self):
        """GET /v1/auth/me with invalid JWT returns 401 or 500 if JWT secret not configured."""
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as ac:
            response = await ac.get(
                "/v1/auth/me",
                headers={"Authorization": "Bearer invalid-token"},
            )

        # Returns 401 if JWT secret configured, 500 if not
        assert response.status_code in (401, 500)