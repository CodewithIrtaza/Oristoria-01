"""Onboarding router: workspace naming, sample answer (SSE), first value."""
import json
import re
from typing import Annotated, AsyncIterator

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.db.repositories import (
    OnboardingRepository,
    SamplePage,
    SampleRecord,
    get_onboarding_repo,
)
from app.deps.auth import CurrentUser, get_current_user
from app.schemas.onboarding import (
    FirstQuestionRequest,
    FirstValueRequest,
    FirstValueResponse,
    OnboardingChecklist,
    SampleSummary,
    SamplesResponse,
    WorkspaceBrief,
    WorkspacePatch,
    build_checklist,
)

router = APIRouter(prefix="/v1", tags=["onboarding"])

RepoDep = Annotated[OnboardingRepository, Depends(get_onboarding_repo)]
UserDep = Annotated[CurrentUser, Depends(get_current_user)]

_STOPWORDS = {
    "about", "and", "are", "but", "can", "does", "for", "from", "how", "not",
    "that", "the", "their", "them", "then", "there", "these", "they", "this",
    "those", "what", "when", "where", "which", "who", "why", "will", "with",
    "you", "your",
}


# =============================================================================
# HELPERS
# =============================================================================

def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


def _keywords(question: str) -> set[str]:
    words = re.findall(r"[a-z0-9']+", question.lower())
    return {word for word in words if len(word) > 2 and word not in _STOPWORDS}


def _pick_page(question: str, sample: SampleRecord) -> SamplePage:
    """Deterministic citation: the page sharing most keywords, else page 1."""
    keywords = _keywords(question)
    if keywords:
        best = max(
            sample.pages,
            key=lambda page: sum(1 for kw in keywords if kw in page.text.lower()),
        )
        if any(kw in best.text.lower() for kw in keywords):
            return best
    return sample.pages[0]


def _build_answer(question: str, sample: SampleRecord) -> tuple[str, dict]:
    page = _pick_page(question, sample)
    answer = f'Based on "{sample.title}": {sample.summary} [1].'
    citation = {
        "n": 1,
        "sample_id": sample.id,
        "page": page.page,
        "excerpt": page.text[:240],
    }
    return answer, citation


def _tokens(text: str) -> AsyncIterator[str]:
    async def generator() -> AsyncIterator[str]:
        for word in text.split(" "):
            yield word + " "

    return generator()


# =============================================================================
# ENDPOINTS
# =============================================================================

@router.patch("/workspace", response_model=WorkspaceBrief)
async def patch_workspace(
    payload: WorkspacePatch,
    user: UserDep,
    repo: RepoDep,
) -> WorkspaceBrief:
    """Create or rename the caller's own workspace (owner from JWT only)."""
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=422, detail="Workspace name must not be blank")
    await repo.get_or_create_profile(user.user_id, user.email)
    workspace = await repo.set_workspace_name(user.user_id, name)
    return WorkspaceBrief(id=workspace.id, name=workspace.name)


@router.get("/onboarding/samples", response_model=SamplesResponse)
async def list_samples(user: UserDep, repo: RepoDep) -> SamplesResponse:
    """List the seeded sample sources available during onboarding."""
    samples = await repo.list_samples()
    return SamplesResponse(
        samples=[
            SampleSummary(id=sample.id, title=sample.title, page_count=sample.page_count)
            for sample in samples
        ]
    )


@router.post("/onboarding/first-question")
async def first_question(
    payload: FirstQuestionRequest,
    user: UserDep,
    repo: RepoDep,
) -> StreamingResponse:
    """Stream a deterministic, cited answer over the seeded sample source.

    The question is treated as data only. No LLM is called (T07 wires the real
    answer graph); the sample answer is built from the seeded sample's own
    text so onboarding works end-to-end before T04-T06 exist.
    """
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=422, detail="Question must not be blank")
    sample = await repo.get_sample(payload.sample_id)
    if sample is None:
        raise HTTPException(status_code=404, detail="Sample source not found")

    await repo.get_or_create_profile(user.user_id, user.email)
    answer, citation = _build_answer(question, sample)

    async def event_stream() -> AsyncIterator[str]:
        async for token in _tokens(answer):
            yield _sse("answer.delta", {"delta": token})
        yield _sse("citation", citation)
        # Counted only after the whole answer was produced; an early client
        # disconnect closes the generator before this line runs.
        await repo.record_sample_answer(user.user_id)
        yield _sse("run.completed", {"citations": [citation]})

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/onboarding/first-value", response_model=FirstValueResponse)
async def first_value(
    payload: FirstValueRequest,
    user: UserDep,
    repo: RepoDep,
) -> FirstValueResponse:
    """Record the first-value activation event — idempotent, answer-gated."""
    await repo.get_or_create_profile(user.user_id, user.email)
    state = await repo.get_onboarding_state(user.user_id)
    if state.sample_answers < 1:
        raise HTTPException(
            status_code=409,
            detail="Answer a sample question before recording first value",
        )
    state = await repo.record_first_value(user.user_id)
    workspace = await repo.get_workspace(user.user_id)
    checklist: OnboardingChecklist = build_checklist(workspace, state)
    return FirstValueResponse(onboarding=checklist)
