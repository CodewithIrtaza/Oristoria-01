"""Tests for onboarding router: workspace naming, sample answer, first value."""
import json
from types import SimpleNamespace

import pytest
from httpx import AsyncClient, ASGITransport

from app.db.repositories import InMemoryOnboardingRepository, get_onboarding_repo
from app.deps.auth import CurrentUser, get_current_user
from app.main import app


def _as_user(user_id: str, email: str):
    """Dependency override that returns a fixed authenticated user."""

    def override() -> CurrentUser:
        return CurrentUser(user_id=user_id, email=email, role="authenticated")

    return override


@pytest.fixture
def env():
    """Shared in-memory repository plus an active-user switcher."""
    repo = InMemoryOnboardingRepository()
    app.dependency_overrides[get_onboarding_repo] = lambda: repo
    app.dependency_overrides[get_current_user] = _as_user("user-a", "a@example.com")

    def set_user(user_id: str, email: str) -> None:
        app.dependency_overrides[get_current_user] = _as_user(user_id, email)

    yield SimpleNamespace(repo=repo, set_user=set_user)
    app.dependency_overrides.clear()


def _client() -> AsyncClient:
    return AsyncClient(transport=ASGITransport(app=app), base_url="http://test")


async def _collect_sse(response) -> list[tuple[str, dict]]:
    """Parse an SSE response body into (event_name, data) tuples."""
    events: list[tuple[str, dict]] = []
    event_name: str | None = None
    data_lines: list[str] = []
    async for line in response.aiter_lines():
        if line.startswith("event:"):
            event_name = line[len("event:"):].strip()
        elif line.startswith("data:"):
            data_lines.append(line[len("data:"):].strip())
        elif line == "" and event_name is not None:
            raw = "".join(data_lines)
            events.append((event_name, json.loads(raw) if raw else {}))
            event_name, data_lines = None, []
    if event_name is not None:
        raw = "".join(data_lines)
        events.append((event_name, json.loads(raw) if raw else {}))
    return events


class TestWorkspaceEndpoint:
    """PATCH /v1/workspace — naming the workspace."""

    @pytest.mark.asyncio
    async def test_patch_workspace_persists_name_for_current_user(self, env):
        async with _client() as ac:
            response = await ac.patch("/v1/workspace", json={"name": "  Alpha Docs  "})

            assert response.status_code == 200
            body = response.json()
            assert body["name"] == "Alpha Docs"
            assert body["id"]

            me = await ac.get("/v1/me")

        assert me.status_code == 200
        data = me.json()
        assert data["workspace"]["name"] == "Alpha Docs"
        assert data["onboarding"]["workspace_named"] is True
        assert data["onboarding"]["first_value"] is False
        assert data["onboarding"]["completed"] is False
        assert data["onboarding"]["next_step"] == "first-question"

    @pytest.mark.asyncio
    async def test_patch_workspace_requires_auth(self, env):
        app.dependency_overrides.pop(get_current_user, None)
        async with _client() as ac:
            response = await ac.patch("/v1/workspace", json={"name": "Alpha"})

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_patch_workspace_rejects_blank_name(self, env):
        async with _client() as ac:
            for blank in ("", "   "):
                response = await ac.patch("/v1/workspace", json={"name": blank})
                assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_patch_workspace_rejects_name_over_80_chars(self, env):
        async with _client() as ac:
            response = await ac.patch("/v1/workspace", json={"name": "x" * 81})

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_patch_workspace_rejects_unknown_fields(self, env):
        """A client-supplied owner_user_id must be rejected, never trusted."""
        async with _client() as ac:
            response = await ac.patch(
                "/v1/workspace",
                json={"name": "Alpha", "owner_user_id": "user-b"},
            )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_workspace_isolation_between_users(self, env):
        """User A's workspace stays A's; User B sees only their own."""
        async with _client() as ac:
            patch_a = await ac.patch("/v1/workspace", json={"name": "Workspace A"})
            env.set_user("user-b", "b@example.com")
            patch_b = await ac.patch("/v1/workspace", json={"name": "Workspace B"})

            env.set_user("user-a", "a@example.com")
            me_a = await ac.get("/v1/me")
            env.set_user("user-b", "b@example.com")
            me_b = await ac.get("/v1/me")

        assert patch_a.status_code == 200
        assert patch_b.status_code == 200
        assert patch_a.json()["id"] != patch_b.json()["id"]
        assert me_a.json()["workspace"]["name"] == "Workspace A"
        assert me_b.json()["workspace"]["name"] == "Workspace B"
        assert me_a.json()["workspace"]["id"] != me_b.json()["workspace"]["id"]


class TestSamplesEndpoint:
    """GET /v1/onboarding/samples — the seeded sample source list."""

    @pytest.mark.asyncio
    async def test_get_samples_lists_seeded_sample(self, env):
        async with _client() as ac:
            response = await ac.get("/v1/onboarding/samples")

        assert response.status_code == 200
        samples = response.json()["samples"]
        assert len(samples) >= 1
        sample = samples[0]
        assert "sample" in sample["title"].lower()
        assert sample["id"]
        assert sample["page_count"] >= 1

    @pytest.mark.asyncio
    async def test_get_samples_requires_auth(self, env):
        app.dependency_overrides.pop(get_current_user, None)
        async with _client() as ac:
            response = await ac.get("/v1/onboarding/samples")

        assert response.status_code == 401


class TestSampleAnswer:
    """POST /v1/onboarding/first-question — deterministic sample answer."""

    @pytest.mark.asyncio
    async def test_first_question_streams_answer_with_citations(self, env):
        async with _client() as ac:
            samples = (await ac.get("/v1/onboarding/samples")).json()["samples"]
            sample_id = samples[0]["id"]

            async with ac.stream(
                "POST",
                "/v1/onboarding/first-question",
                json={"question": "What is this document about?", "sample_id": sample_id},
            ) as response:
                assert response.status_code == 200
                assert "text/event-stream" in response.headers["content-type"]
                events = await _collect_sse(response)

        names = [name for name, _ in events]
        assert names.count("answer.delta") >= 1
        assert "citation" in names
        assert "run.completed" in names
        assert names.index("run.completed") == len(names) - 1

        answer = "".join(data["delta"] for name, data in events if name == "answer.delta")
        assert "[1]" in answer

        citations = next(data for name, data in events if name == "run.completed")
        assert len(citations["citations"]) >= 1
        first = citations["citations"][0]
        assert first["n"] == 1
        assert first["sample_id"] == sample_id
        assert first["page"] >= 1
        assert first["excerpt"]

    @pytest.mark.asyncio
    async def test_first_question_requires_auth(self, env):
        app.dependency_overrides.pop(get_current_user, None)
        async with _client() as ac:
            response = await ac.post(
                "/v1/onboarding/first-question",
                json={"question": "hi", "sample_id": "x"},
            )

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_first_question_rejects_blank_question(self, env):
        async with _client() as ac:
            samples = (await ac.get("/v1/onboarding/samples")).json()["samples"]
            response = await ac.post(
                "/v1/onboarding/first-question",
                json={"question": "   ", "sample_id": samples[0]["id"]},
            )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_first_question_rejects_question_over_2000_chars(self, env):
        async with _client() as ac:
            samples = (await ac.get("/v1/onboarding/samples")).json()["samples"]
            response = await ac.post(
                "/v1/onboarding/first-question",
                json={"question": "q" * 2001, "sample_id": samples[0]["id"]},
            )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_first_question_rejects_unknown_fields(self, env):
        async with _client() as ac:
            samples = (await ac.get("/v1/onboarding/samples")).json()["samples"]
            response = await ac.post(
                "/v1/onboarding/first-question",
                json={"question": "hi", "sample_id": samples[0]["id"], "owner": "user-b"},
            )

        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_first_question_unknown_sample_returns_404(self, env):
        async with _client() as ac:
            response = await ac.post(
                "/v1/onboarding/first-question",
                json={"question": "hi", "sample_id": "no-such-sample"},
            )

        assert response.status_code == 404


class TestFirstValueEndpoint:
    """POST /v1/onboarding/first-value — activation event, idempotent."""

    @pytest.mark.asyncio
    async def test_rejected_before_any_successful_answer(self, env):
        async with _client() as ac:
            response = await ac.post("/v1/onboarding/first-value", json={})
            me = await ac.get("/v1/me")

        assert response.status_code == 409
        assert me.json()["onboarding"]["first_value"] is False

    @pytest.mark.asyncio
    async def test_recorded_after_successful_answer_and_idempotent(self, env):
        async with _client() as ac:
            await ac.patch("/v1/workspace", json={"name": "Alpha Docs"})
            samples = (await ac.get("/v1/onboarding/samples")).json()["samples"]
            sample_id = samples[0]["id"]

            async with ac.stream(
                "POST",
                "/v1/onboarding/first-question",
                json={"question": "What is this document about?", "sample_id": sample_id},
            ) as response:
                await _collect_sse(response)

            first = await ac.post("/v1/onboarding/first-value", json={})
            second = await ac.post("/v1/onboarding/first-value", json={})
            me = await ac.get("/v1/me")

        assert first.status_code == 200
        assert second.status_code == 200
        onboarding = first.json()["onboarding"]
        assert onboarding["first_value"] is True
        assert onboarding["completed"] is True
        assert onboarding["next_step"] == "done"
        assert onboarding["first_value_at"]
        # Idempotent: the timestamp never moves on repeat calls.
        assert second.json()["onboarding"]["first_value_at"] == onboarding["first_value_at"]
        assert me.json()["onboarding"]["completed"] is True

    @pytest.mark.asyncio
    async def test_first_value_isolation_between_users(self, env):
        """User A's activation must not complete User B's onboarding."""
        async with _client() as ac:
            samples = (await ac.get("/v1/onboarding/samples")).json()["samples"]
            sample_id = samples[0]["id"]

            async with ac.stream(
                "POST",
                "/v1/onboarding/first-question",
                json={"question": "What is this document about?", "sample_id": sample_id},
            ) as response:
                await _collect_sse(response)
            done_a = await ac.post("/v1/onboarding/first-value", json={})

            env.set_user("user-b", "b@example.com")
            me_b = await ac.get("/v1/me")
            denied_b = await ac.post("/v1/onboarding/first-value", json={})

        assert done_a.status_code == 200
        assert me_b.json()["onboarding"]["first_value"] is False
        assert me_b.json()["onboarding"]["completed"] is False
        assert denied_b.status_code == 409

    @pytest.mark.asyncio
    async def test_first_value_requires_auth(self, env):
        app.dependency_overrides.pop(get_current_user, None)
        async with _client() as ac:
            response = await ac.post("/v1/onboarding/first-value", json={})

        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_first_value_rejects_unknown_fields(self, env):
        async with _client() as ac:
            response = await ac.post(
                "/v1/onboarding/first-value",
                json={"owner_user_id": "user-a"},
            )

        assert response.status_code == 422


class TestMeOnboardingChecklist:
    """GET /v1/me — onboarding checklist for a brand-new user."""

    @pytest.mark.asyncio
    async def test_new_user_checklist_starts_at_workspace_step(self, env):
        async with _client() as ac:
            response = await ac.get("/v1/me")

        assert response.status_code == 200
        data = response.json()
        assert data["workspace"] is None
        assert data["onboarding"] == {
            "workspace_named": False,
            "first_value": False,
            "first_value_at": None,
            "completed": False,
            "next_step": "workspace",
        }

    @pytest.mark.asyncio
    async def test_me_requires_auth(self, env):
        app.dependency_overrides.pop(get_current_user, None)
        async with _client() as ac:
            response = await ac.get("/v1/me")

        assert response.status_code == 401
