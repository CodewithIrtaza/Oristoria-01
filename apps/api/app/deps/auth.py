"""Authentication dependencies for JWT verification."""
from typing import Annotated
from datetime import datetime, timezone
import jwt
from fastapi import Depends, HTTPException, Header, Request
from pydantic import BaseModel

from app.config import get_settings, Settings


class CurrentUser(BaseModel):
    """Current authenticated user."""
    user_id: str
    email: str
    role: str = "authenticated"


class JWTPayload(BaseModel):
    """Decoded JWT payload."""
    sub: str
    email: str
    role: str
    aud: str
    iss: str
    exp: int
    iat: int


async def get_current_user_id(
    authorization: Annotated[str | None, Header()] = None,
    settings: Settings = Depends(get_settings),
) -> str:
    """
    Extract and validate JWT from Authorization header.
    Returns the user_id (sub claim) if valid.
    Raises HTTPException 401 if invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization[7:]  # Remove "Bearer "
    payload = await _verify_jwt(token, settings)

    # Only allow authenticated role
    if payload.role != "authenticated":
        raise HTTPException(
            status_code=401,
            detail="Invalid token role",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload.sub


async def get_current_user(
    authorization: Annotated[str | None, Header()] = None,
    settings: Settings = Depends(get_settings),
) -> CurrentUser:
    """
    Extract and validate JWT from Authorization header.
    Returns CurrentUser if valid.
    Raises HTTPException 401 if invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization[7:]  # Remove "Bearer "
    payload = await _verify_jwt(token, settings)

    # Only allow authenticated role
    if payload.role != "authenticated":
        raise HTTPException(
            status_code=401,
            detail="Invalid token role",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return CurrentUser(
        user_id=payload.sub,
        email=payload.email,
        role=payload.role,
    )


async def _verify_jwt(token: str, settings: Settings) -> JWTPayload:
    """Verify JWT token using Supabase JWT secret or JWKS."""
    if not settings.supabase_jwt_secret:
        raise HTTPException(
            status_code=500,
            detail="JWT secret not configured",
        )

    try:
        # Decode and verify the token
        decoded = jwt.decode(
            token,
            settings.supabase_jwt_secret.get_secret_value(),
            algorithms=["HS256"],
            audience="authenticated",
            issuer=f"{settings.supabase_url.get_secret_value()}/auth/v1" if settings.supabase_url else None,
            options={
                "verify_exp": True,
                "verify_aud": True,
                "verify_iss": True,
            },
        )

        return JWTPayload(**decoded)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidAudienceError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token audience",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidIssuerError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token issuer",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Invalid token signature",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Optional: dependency for routes that need the raw user_id
CurrentUserId = Annotated[str, Depends(get_current_user_id)]
CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]