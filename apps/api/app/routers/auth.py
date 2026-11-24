"""Authentication router: magic-link, logout, me."""
from fastapi import APIRouter, Depends, HTTPException, Response, Request
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
from supabase import AuthApiError

from app.config import get_settings, Settings
from app.db.repositories import OnboardingRepository, get_onboarding_repo
from app.deps.auth import get_current_user, CurrentUser
from app.schemas.onboarding import OnboardingChecklist, WorkspaceBrief, build_checklist

router = APIRouter(prefix="/v1/auth", tags=["auth"])
router_root = APIRouter(tags=["auth"])


# =============================================================================
# SCHEMAS
# =============================================================================

class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkResponse(BaseModel):
    message: str


class MeResponse(BaseModel):
    user_id: str
    email: str
    role: str
    workspace: WorkspaceBrief | None = None
    onboarding: OnboardingChecklist


class VerifyRequest(BaseModel):
    token: str
    type: str = "magiclink"


class VerifyResponse(BaseModel):
    user: dict
    session: dict
    isNewUser: bool


# =============================================================================
# HELPERS
# =============================================================================

def _get_supabase_client(settings: Settings = Depends(get_settings)) -> Client:
    """Create Supabase client with service role key for admin operations."""
    if not settings.supabase_url or not settings.supabase_service_role_key:
        raise HTTPException(
            status_code=500,
            detail="Supabase not configured",
        )
    return create_client(
        settings.supabase_url.get_secret_value(),
        settings.supabase_service_role_key.get_secret_value(),
    )


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.post("/magic-link", response_model=MagicLinkResponse, status_code=202)
async def request_magic_link(
    request: MagicLinkRequest,
    settings: Settings = Depends(get_settings),
    supabase: Client = Depends(_get_supabase_client),
) -> MagicLinkResponse:
    """
    Request a magic link for passwordless sign-in.
    Sends an email with a one-time login link via Supabase Auth.
    """
    try:
        redirect_url = settings.auth_redirect_url or f"{settings.frontend_origin}/auth/callback"
        supabase.auth.sign_in_with_otp(
            {
                "email": request.email,
                "options": {
                    "email_redirect_to": redirect_url,
                },
            }
        )
    except AuthApiError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return MagicLinkResponse(message="Magic link sent")


@router.post("/logout", response_model=MagicLinkResponse)
async def logout(
    response: Response,
    current_user: CurrentUser = Depends(get_current_user),
    settings: Settings = Depends(get_settings),
    supabase: Client = Depends(_get_supabase_client),
) -> MagicLinkResponse:
    """
    Logout the current user by revoking their session.
    Clears the session cookie.
    """
    # Clear the auth cookie
    response.delete_cookie(
        key="sb-access-token",
        path="/",
        httponly=True,
        secure=True,
        samesite="lax",
    )
    response.delete_cookie(
        key="sb-refresh-token",
        path="/",
        httponly=True,
        secure=True,
        samesite="lax",
    )

    # Optionally revoke the session server-side
    # (requires access_token which we don't have in this simple flow)
    # Supabase client can revoke if we had the token

    return MagicLinkResponse(message="Logged out")


@router.post("/verify", response_model=VerifyResponse)
async def verify_magic_link(
    request: VerifyRequest,
    settings: Settings = Depends(get_settings),
    supabase: Client = Depends(_get_supabase_client),
) -> VerifyResponse:
    """
    Verify a magic link token and return session.
    Used by the frontend callback page.
    """
    try:
        # Verify the OTP token
        result = supabase.auth.verify_otp(
            {
                "token": request.token,
                "type": request.type,
            }
        )

        if not result.session or not result.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

        # Check if user is new (no previous sessions)
        # In a real app, you'd check your users table
        is_new_user = True  # Placeholder - would check DB

        return VerifyResponse(
            user={"id": result.user.id, "email": result.user.email},
            session={
                "access_token": result.session.access_token,
                "refresh_token": result.session.refresh_token,
            },
            isNewUser=is_new_user,
        )
    except AuthApiError as e:
        raise HTTPException(status_code=401, detail=str(e))


async def _me_payload(
    current_user: CurrentUser,
    repo: OnboardingRepository,
) -> MeResponse:
    """Build the /v1/me body: profile + workspace + onboarding checklist."""
    profile = await repo.get_or_create_profile(current_user.user_id, current_user.email)
    workspace = await repo.get_workspace(current_user.user_id)
    checklist = build_checklist(workspace, profile.onboarding_state)
    return MeResponse(
        user_id=current_user.user_id,
        email=current_user.email,
        role=current_user.role,
        workspace=WorkspaceBrief(id=workspace.id, name=workspace.name) if workspace else None,
        onboarding=checklist,
    )


@router.get("/me", response_model=MeResponse)
async def get_me(
    current_user: CurrentUser = Depends(get_current_user),
    repo: OnboardingRepository = Depends(get_onboarding_repo),
) -> MeResponse:
    """
    Get current user profile from validated JWT.
    Requires valid Authorization: Bearer <token> header.
    Includes workspace and onboarding checklist (B6).
    """
    return await _me_payload(current_user, repo)


@router_root.get("/v1/me", response_model=MeResponse)
async def get_me_root(
    current_user: CurrentUser = Depends(get_current_user),
    repo: OnboardingRepository = Depends(get_onboarding_repo),
) -> MeResponse:
    """TECH_DESIGN §4.3 GET /v1/me — same payload as /v1/auth/me."""
    return await _me_payload(current_user, repo)
