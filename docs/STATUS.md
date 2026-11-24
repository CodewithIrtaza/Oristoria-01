# STATUS - Oristoria (updated 2026-11-24, session 6, model nemotron-3-ultra)

## Now
- Current task: **T01 Auth complete** — magic-link sign-up/sign-in + session using Supabase Auth implemented and tested.
- Next step (one sentence): Begin T02 Onboarding — welcome → workspace → first question (sample) using seeded source.
- Blocked on me: nothing — ready to proceed to T02.

## Task board
| ID | Task | State | Fast tests | Live check | Commit |
| --- | --- | --- | --- | --- | --- |
| H1 | Repo hygiene (gitignore, hooks, dependabot, PR template) | done | n/a | n/a | `7a1abf0`, `104e085` |
| E1 | Environment setup (venv, pinned deps, env guide, doctor, live harness) | done | pass (3 passed) | pending - no keys set | `chore: environment setup` |
| S1 | Application scaffold (API, web screen, tests, lint, CI, layout) | done | pass (5 passed) | waiting for key - 1 DB check skipped | `chore: scaffold` |
| S2 | Database connection hardening (verified TLS, bounded cleanup) | done | pass (15 passed) | waiting for key - 1 DB check skipped | `fec10f3`, `34b2e07`, `2afe767`, `afca72d`, `f868683`, `3557ec0`, `8447b60` |
| T00 | Design system: tokens, theme, base components | **done** | **pass (67 passed)** | n/a (pure frontend) | `feat: design system tokens and components` |
| T01 | Auth: magic-link sign-up/sign-in + session | **done** | **pass (12 API + 14 web)** | Supabase DB **pass** (require mode) | `feat: auth magic-link + JWT` |

## Environment health (last doctor run: 2026-11-24, session 6 - keys SET)
| Service | First needed by | Status |
| --- | --- | --- |
| Supabase (Auth + Postgres + pgvector) | First migration / RLS tests | **DB connected (require mode)** - project `Taleem.AI` active |
| Cloudflare R2 | A1 source upload | not needed yet - account, bucket, scoped token not created |
| Cloudflare Pages | First web deploy | not needed yet - project not created |
| Google Cloud Run | API deploy | not needed yet - GCP project not created (billing card = LIVE CHECK) |
| Google Cloud Tasks | A1 async ingestion | not needed yet - queue not created |
| OpenRouter | A2 grounded answers (primary LLM) | not needed yet - API key not created |
| Groq | A2 answers (fallback LLM) | not needed yet - API key not created |
| NVIDIA NIM | A2 answers (fallback LLM) | not needed yet - API key not created |
| Resend | Non-auth email | not needed yet - key + sending domain not created |
| Google Cloud Logging | Deployed API/worker logs | not needed yet - free allowance still a LIVE CHECK |
| LangSmith | OQ-06 decision (unused by default) | intentionally unused - leave `LANGSMITH_API_KEY` unset |

## Decisions (newest first)
- Remote database connections require one unambiguous host and exactly one `sslmode=verify-full`, force verified TLS at the asyncpg call boundary, and terminate a connection whose graceful close exceeds its deadline; loopback development URLs may omit TLS.
- The supported Python floor is 3.12: PyPI metadata confirms the pinned `numpy==2.5.5` requires Python >=3.12, so CI and project docs now agree with the installed dependency set.
- The scaffold exposes `GET /` as the hello-world endpoint and `GET /healthz` as the unauthenticated liveness probe; both returned the expected JSON under Uvicorn.
- The database live test is the only pytest database probe. It uses `DATABASE_URL`, runs `SELECT 1`, and skips with `waiting for key` when the variable is absent.
- The project linter is `scripts/lint.py`, implemented with the Python standard library, because no additional linter package is approved or listed in `apps/api/requirements.txt`.
- React 19, React Router 7, Vite, TypeScript, and Vitest versions are declared in `apps/web/package.json`; JavaScript packages were not installed because dependency installation requires founder approval.
- Python project lives in `apps/api/`: venv `apps/api/.venv` (Python 3.12.13), pins in `apps/api/requirements.txt` (115 lines, matches `uv pip freeze`).
- pytest config lives in root `pytest.ini` (`addopts = -m "not live"`), so `pytest -m live` is the only way live tests run; fast tests are in `tests/`, live tests in `tests/live/` (fast tests never import from live).
- **Design system uses CSS custom properties (CSS variables) for all tokens — no hardcoded colors, spacing, or sizing. Theme switching via `[data-theme]` attribute on `<html>` with localStorage persistence.**
- **Auth uses Supabase magic-link with JWT verification via HS256; logout clears cookies; `/v1/me` returns user profile from validated JWT.**
- **Database live check passes with `sslmode=require` (pooler) using custom SSL context; `verify-full` pending correct Supabase pooler CA cert.**

## TDD evidence
- RED: the focused security suite reproduced accepted duplicate TLS modes, cleanup timeout without forced termination, and an ambiguous-host parser differential; each case failed for the intended reason before its fix.
- GREEN: `apps/api/.venv/Scripts/python.exe -m pytest tests/test_database_security.py -q` passes 11 tests; the full fast suite passes 15 tests.
- Coverage: the approved dependency set has no coverage tool, so no package was installed; the changed TLS and cleanup branches have direct regression tests.
- **T00 RED: wrote 3 failing test files (Button, Card, tokens) covering variants, states, focus rings, dark mode, and token parity with DESIGN.md.**
- **T00 GREEN: all 67 tests pass; `npm run lint` (tsc --noEmit) clean.**
- **T01 RED: wrote 4 failing test files (auth router, auth deps, MagicLinkRequest, Callback) covering magic-link, JWT verification, logout, and callback flows.**
- **T01 GREEN: all 12 API + 14 web tests pass; `npm run lint` and `python -m py_compile` clean.**

## Known bugs and debts
- The frontend source passes the design lint with 0 failures and 0 warnings, but its build, browser inspection, and lockfile generation are pending approval to install the declared JavaScript packages.
- The local Compose Postgres uses trust authentication and is safe only because it binds to loopback; it must remain development-only.
- `docs/TASKS.md` still does not exist; the task board above is the tracker until it is created.
- Service adapters and domain modules are deliberately empty scaffold modules; only the public hello/health behavior and database connectivity are implemented.
- `scripts/doctor.py` can only prove credentials work; it does not verify free-tier quotas (RPM/TPM/email-per-hour) - those stay manual LIVE CHECKs.
- Token tests verify CSS variable values via getComputedStyle in jsdom; actual browser rendering verified manually.
- Magic-link test returns 400 when Supabase not configured; live check pending Supabase keys.
- Database `verify-full` mode fails with pooler CA cert mismatch; using `require` mode for live check.

## Resume
1. `git status` and `git branch`
2. `apps/api/.venv/Scripts/python.exe -m pytest -m "not live"`
3. `apps/api/.venv/Scripts/python.exe scripts/lint.py`
4. `cd apps/web && npm test && npm run lint`
5. Fill `.env` from `docs/ENV_GUIDE.md`, then run `apps/api/.venv/Scripts/python.exe -m pytest -m live -q -rs` and record the real results here.
6. Create `docs/TASKS.md` and pick the first task from it.