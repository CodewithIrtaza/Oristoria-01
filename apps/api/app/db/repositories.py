"""Owner-filtered repositories for onboarding state (profiles, workspace, samples).

Every read and write is keyed by ``owner_user_id`` derived from the verified
JWT — never from a request body. The in-memory implementation backs fast
tests; the Postgres implementation reads the tables created by
``migrations/001_onboarding.sql``.
"""
from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Protocol
from urllib.parse import urlsplit
from uuid import uuid4

import asyncpg
from fastapi import Depends, HTTPException
from pydantic import BaseModel, Field

from app.config import Settings, get_settings
from app.db.session import LOOPBACK_HOSTS, _build_ssl_context, validate_database_url


# =============================================================================
# RECORDS
# =============================================================================

class OnboardingState(BaseModel):
    """Persisted slice of ``profiles.onboarding_state`` for T02."""

    first_value: bool = False
    first_value_at: str | None = None
    sample_answers: int = 0


class ProfileRecord(BaseModel):
    user_id: str
    email: str | None = None
    onboarding_state: OnboardingState = Field(default_factory=OnboardingState)


class WorkspaceRecord(BaseModel):
    id: str
    owner_user_id: str
    name: str


class SamplePage(BaseModel):
    page: int
    text: str


class SampleRecord(BaseModel):
    id: str
    title: str
    summary: str
    pages: list[SamplePage]

    @property
    def page_count(self) -> int:
        return len(self.pages)


class OnboardingRepository(Protocol):
    """Public persistence seam used by the onboarding and auth routers."""

    async def get_or_create_profile(self, owner_user_id: str, email: str) -> ProfileRecord: ...

    async def get_onboarding_state(self, owner_user_id: str) -> OnboardingState: ...

    async def get_workspace(self, owner_user_id: str) -> WorkspaceRecord | None: ...

    async def set_workspace_name(self, owner_user_id: str, name: str) -> WorkspaceRecord: ...

    async def record_sample_answer(self, owner_user_id: str) -> None: ...

    async def record_first_value(self, owner_user_id: str) -> OnboardingState: ...

    async def list_samples(self) -> list[SampleRecord]: ...

    async def get_sample(self, sample_id: str) -> SampleRecord | None: ...


# =============================================================================
# DEFAULT SAMPLE (mirrors scripts/seed_dev.py for the Postgres backend)
# =============================================================================

DEFAULT_SAMPLE = SampleRecord(
    id="sample-onboarding-handbook",
    title="Oristoria Sample Handbook",
    summary=(
        "This sample handbook explains how Oristoria turns your documents into "
        "source-grounded answers with clickable citations"
    ),
    pages=[
        SamplePage(
            page=1,
            text=(
                "Welcome to Oristoria. You upload a document, the system splits it into "
                "passages, and every answer cites the passage it came from. This sample "
                "document exists so you can try your first question before uploading "
                "anything of your own."
            ),
        ),
        SamplePage(
            page=2,
            text=(
                "Citations keep answers honest: each claim links back to a page in a "
                "source you can open and read. If a workspace does not establish a fact, "
                "Oristoria says so instead of guessing."
            ),
        ),
    ],
)


# =============================================================================
# IN-MEMORY IMPLEMENTATION (fast tests)
# =============================================================================

class InMemoryOnboardingRepository:
    """Dict-backed repository shared by every user in one test."""

    def __init__(self) -> None:
        self._profiles: dict[str, ProfileRecord] = {}
        self._workspaces: dict[str, WorkspaceRecord] = {}
        self._samples: dict[str, SampleRecord] = {DEFAULT_SAMPLE.id: DEFAULT_SAMPLE}

    async def get_or_create_profile(self, owner_user_id: str, email: str) -> ProfileRecord:
        profile = self._profiles.get(owner_user_id)
        if profile is None:
            profile = ProfileRecord(user_id=owner_user_id, email=email)
            self._profiles[owner_user_id] = profile
        elif email:
            profile.email = email
        return profile

    async def get_onboarding_state(self, owner_user_id: str) -> OnboardingState:
        profile = self._profiles.get(owner_user_id)
        if profile is None:
            return OnboardingState()
        return profile.onboarding_state.model_copy(deep=True)

    async def get_workspace(self, owner_user_id: str) -> WorkspaceRecord | None:
        return self._workspaces.get(owner_user_id)

    async def set_workspace_name(self, owner_user_id: str, name: str) -> WorkspaceRecord:
        existing = self._workspaces.get(owner_user_id)
        if existing is not None:
            existing.name = name
            return existing
        workspace = WorkspaceRecord(id=str(uuid4()), owner_user_id=owner_user_id, name=name)
        self._workspaces[owner_user_id] = workspace
        return workspace

    async def record_sample_answer(self, owner_user_id: str) -> None:
        profile = await self.get_or_create_profile(owner_user_id, email="")
        profile.onboarding_state.sample_answers += 1

    async def record_first_value(self, owner_user_id: str) -> OnboardingState:
        profile = await self.get_or_create_profile(owner_user_id, email="")
        state = profile.onboarding_state
        state.first_value = True
        if state.first_value_at is None:
            state.first_value_at = datetime.now(timezone.utc).isoformat()
        return state.model_copy(deep=True)

    async def list_samples(self) -> list[SampleRecord]:
        return list(self._samples.values())

    async def get_sample(self, sample_id: str) -> SampleRecord | None:
        return self._samples.get(sample_id)


# =============================================================================
# POSTGRES IMPLEMENTATION (development / production)
# =============================================================================

class PostgresOnboardingRepository:
    """asyncpg-backed repository; one short-lived connection per call."""

    def __init__(self, dsn: str) -> None:
        self._dsn = dsn

    async def _connect(self) -> asyncpg.Connection:
        validate_database_url(self._dsn)
        host = urlsplit(self._dsn).hostname or ""
        ssl = None if host.lower() in LOOPBACK_HOSTS else _build_ssl_context(self._dsn)
        return await asyncpg.connect(self._dsn, ssl=ssl)

    async def get_or_create_profile(self, owner_user_id: str, email: str) -> ProfileRecord:
        connection = await self._connect()
        try:
            row = await connection.fetchrow(
                """
                INSERT INTO profiles (user_id, email)
                VALUES ($1, $2)
                ON CONFLICT (user_id)
                DO UPDATE SET email = EXCLUDED.email, updated_at = now()
                RETURNING user_id, email, onboarding_state
                """,
                owner_user_id,
                email,
            )
        finally:
            await connection.close()
        return _profile_from_row(row)

    async def get_onboarding_state(self, owner_user_id: str) -> OnboardingState:
        connection = await self._connect()
        try:
            raw = await connection.fetchval(
                "SELECT onboarding_state FROM profiles WHERE user_id = $1",
                owner_user_id,
            )
        finally:
            await connection.close()
        if not raw:
            return OnboardingState()
        return OnboardingState.model_validate(dict(raw))

    async def get_workspace(self, owner_user_id: str) -> WorkspaceRecord | None:
        connection = await self._connect()
        try:
            row = await connection.fetchrow(
                """
                SELECT id::text AS id, owner_user_id, name
                FROM workspaces
                WHERE owner_user_id = $1 AND is_active
                """,
                owner_user_id,
            )
        finally:
            await connection.close()
        if row is None:
            return None
        return WorkspaceRecord(**dict(row))

    async def set_workspace_name(self, owner_user_id: str, name: str) -> WorkspaceRecord:
        connection = await self._connect()
        try:
            row = await connection.fetchrow(
                """
                INSERT INTO workspaces (owner_user_id, name)
                VALUES ($1, $2)
                ON CONFLICT (owner_user_id) WHERE is_active
                DO UPDATE SET name = EXCLUDED.name, updated_at = now()
                RETURNING id::text AS id, owner_user_id, name
                """,
                owner_user_id,
                name,
            )
        finally:
            await connection.close()
        return WorkspaceRecord(**dict(row))

    async def record_sample_answer(self, owner_user_id: str) -> None:
        connection = await self._connect()
        try:
            await connection.execute(
                """
                UPDATE profiles SET
                    onboarding_state =
                        coalesce(onboarding_state, '{}'::jsonb)
                        || jsonb_build_object(
                            'sample_answers',
                            coalesce((onboarding_state ->> 'sample_answers')::int, 0) + 1
                        ),
                    updated_at = now()
                WHERE user_id = $1
                """,
                owner_user_id,
            )
        finally:
            await connection.close()

    async def record_first_value(self, owner_user_id: str) -> OnboardingState:
        connection = await self._connect()
        try:
            raw = await connection.fetchval(
                """
                UPDATE profiles SET
                    onboarding_state =
                        coalesce(onboarding_state, '{}'::jsonb)
                        || jsonb_build_object(
                            'first_value', true,
                            'first_value_at',
                            coalesce(
                                onboarding_state ->> 'first_value_at',
                                to_char((now() AT TIME ZONE 'utc'),
                                        'YYYY-MM-DD"T"HH24:MI:SS"Z"')
                            )
                        ),
                    updated_at = now()
                WHERE user_id = $1
                RETURNING onboarding_state
                """,
                owner_user_id,
            )
        finally:
            await connection.close()
        if not raw:
            return OnboardingState()
        return OnboardingState.model_validate(dict(raw))

    async def list_samples(self) -> list[SampleRecord]:
        connection = await self._connect()
        try:
            rows = await connection.fetch(
                """
                SELECT id::text AS id, title, summary, pages
                FROM onboarding_samples
                ORDER BY created_at, id
                """
            )
        finally:
            await connection.close()
        return [_sample_from_row(row) for row in rows]

    async def get_sample(self, sample_id: str) -> SampleRecord | None:
        connection = await self._connect()
        try:
            row = await connection.fetchrow(
                """
                SELECT id::text AS id, title, summary, pages
                FROM onboarding_samples
                WHERE id = $1
                """,
                sample_id,
            )
        finally:
            await connection.close()
        if row is None:
            return None
        return _sample_from_row(row)

    async def upsert_sample(self, sample: SampleRecord) -> None:
        """Idempotent insert used by scripts/seed_dev.py (not part of the
        repository protocol used by routers)."""
        connection = await self._connect()
        try:
            await connection.execute(
                """
                INSERT INTO onboarding_samples (id, title, summary, pages)
                VALUES ($1, $2, $3, $4::jsonb)
                ON CONFLICT (id)
                DO UPDATE SET title = EXCLUDED.title,
                              summary = EXCLUDED.summary,
                              pages = EXCLUDED.pages
                """,
                sample.id,
                sample.title,
                sample.summary,
                json.dumps([page.model_dump() for page in sample.pages]),
            )
        finally:
            await connection.close()


def _profile_from_row(row: asyncpg.Record) -> ProfileRecord:
    data = dict(row)
    state = data.pop("onboarding_state", None) or {}
    return ProfileRecord(onboarding_state=OnboardingState.model_validate(dict(state)), **data)


def _sample_from_row(row: asyncpg.Record) -> SampleRecord:
    data = dict(row)
    data["pages"] = [dict(page) for page in data["pages"]]
    return SampleRecord.model_validate(data)


# =============================================================================
# FASTAPI DEPENDENCY
# =============================================================================

def get_onboarding_repo(
    settings: Settings = Depends(get_settings),
) -> OnboardingRepository:
    """Return the Postgres repository; tests override this dependency."""
    if not settings.database_url:
        raise HTTPException(status_code=503, detail="Database not configured")
    return PostgresOnboardingRepository(settings.database_url.get_secret_value())
