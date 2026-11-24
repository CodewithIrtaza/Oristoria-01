"""Request/response schemas for onboarding endpoints (T02)."""
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.db.repositories import OnboardingState, WorkspaceRecord


class WorkspacePatch(BaseModel):
    """PATCH /v1/workspace body — unknown fields are rejected."""

    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=1, max_length=80)


class WorkspaceBrief(BaseModel):
    id: str
    name: str


class FirstQuestionRequest(BaseModel):
    """POST /v1/onboarding/first-question body."""

    model_config = ConfigDict(extra="forbid")

    question: str = Field(min_length=1, max_length=2000)
    sample_id: str = Field(min_length=1, max_length=120)


class FirstValueRequest(BaseModel):
    """POST /v1/onboarding/first-value body (intentionally empty)."""

    model_config = ConfigDict(extra="forbid")


class OnboardingChecklist(BaseModel):
    """B6 checklist returned by GET /v1/me (PRD US-14 AC-002)."""

    workspace_named: bool
    first_value: bool
    first_value_at: str | None = None
    completed: bool
    next_step: Literal["workspace", "first-question", "done"]


class FirstValueResponse(BaseModel):
    onboarding: OnboardingChecklist


class SampleSummary(BaseModel):
    id: str
    title: str
    page_count: int


class SamplesResponse(BaseModel):
    samples: list[SampleSummary]


def build_checklist(
    workspace: WorkspaceRecord | None,
    state: OnboardingState,
) -> OnboardingChecklist:
    """Derive the onboarding checklist from workspace + activation state."""
    workspace_named = workspace is not None and bool(workspace.name.strip())
    first_value = state.first_value
    completed = workspace_named and first_value
    if not workspace_named:
        next_step: Literal["workspace", "first-question", "done"] = "workspace"
    elif not first_value:
        next_step = "first-question"
    else:
        next_step = "done"
    return OnboardingChecklist(
        workspace_named=workspace_named,
        first_value=first_value,
        first_value_at=state.first_value_at,
        completed=completed,
        next_step=next_step,
    )
