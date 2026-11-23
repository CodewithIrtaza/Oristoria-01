# STATUS - Oristoria (updated 2026-11-23, session 3, model minimax-m3.1-flash)

## Now
- Current task: project scaffold complete - FastAPI hello endpoint, `GET /healthz`, React/Vite screen, fast test, database live check, linter, CI, and documented repository layout.
- Next step (one sentence): Founder creates the credentials listed in `docs/ENV_GUIDE.md`, then runs the live checks again.
- Blocked on me: the last doctor run found every credential missing. `.env` has since been initialized with names only and is being filled; live checks stay pending until the founder confirms it is ready.

## Task board
| ID | Task | State | Fast tests | Live check | Commit |
| --- | --- | --- | --- | --- | --- |
| H1 | Repo hygiene (gitignore, hooks, dependabot, PR template) | done | n/a | n/a | `7a1abf0`, `104e085` |
| E1 | Environment setup (venv, pinned deps, env guide, doctor, live harness) | done | pass (3 passed) | pending - no keys set | `chore: environment setup` |
| S1 | Application scaffold (API, web screen, tests, lint, CI, layout) | done | pass (5 passed) | waiting for key - 1 DB check skipped | `chore: scaffold` |

## Environment health (last doctor run: 2026-11-23, session 3 - all vars MISSING, every live check skipped)
| Service | First needed by | Status |
| --- | --- | --- |
| Supabase (Auth + Postgres + pgvector) | First migration / RLS tests | waiting for key - dev project `Taleem.AI` is PAUSED; unpause before the first DB task |
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
- The supported Python floor is 3.12: PyPI metadata confirms the pinned `numpy==2.5.5` requires Python >=3.12, so CI and project docs now agree with the installed dependency set.
- Remote `DATABASE_URL` values must use `sslmode=verify-full`; the live check and doctor share the same bounded connection helper, while loopback development URLs may omit TLS.
- The scaffold exposes `GET /` as the hello-world endpoint and `GET /healthz` as the unauthenticated liveness probe; both returned the expected JSON under Uvicorn.
- The database live test is the only pytest database probe. It uses `DATABASE_URL`, runs `SELECT 1`, and skips with `waiting for key` when the variable is absent.
- The project linter is `scripts/lint.py`, implemented with the Python standard library, because no additional linter package is approved or listed in `apps/api/requirements.txt`.
- React 19, React Router 7, Vite, TypeScript, and Vitest versions are declared in `apps/web/package.json`; JavaScript packages were not installed because dependency installation requires founder approval.
- Python project lives in `apps/api/`: venv `apps/api/.venv` (Python 3.12.13), pins in `apps/api/requirements.txt` (115 lines, matches `uv pip freeze`).
- pytest config lives in root `pytest.ini` (`addopts = -m "not live"`), so `pytest -m live` is the only way live tests run; fast tests are in `tests/`, live tests in `tests/live/` (fast tests never import from live).

## Known bugs and debts
- The frontend source passes the design lint with 0 failures and 0 warnings, but its build, browser inspection, and lockfile generation are pending approval to install the declared JavaScript packages.
- The local Compose Postgres uses trust authentication and is safe only because it binds to loopback; it must remain development-only.
- `docs/TASKS.md` still does not exist; the task board above is the tracker until it is created.
- Service adapters and domain modules are deliberately empty scaffold modules; only the public hello/health behavior and database connectivity are implemented.
- `scripts/doctor.py` can only prove credentials work; it does not verify free-tier quotas (RPM/TPM/email-per-hour) - those stay manual LIVE CHECKs.

## Resume
1. `git status` and `git branch`
2. `apps/api/.venv/Scripts/python.exe -m pytest -m "not live"`
3. `apps/api/.venv/Scripts/python.exe scripts/lint.py`
4. Fill `.env` from `docs/ENV_GUIDE.md`, then run `apps/api/.venv/Scripts/python.exe -m pytest -m live -q -rs` and record the real results here.
5. Create `docs/TASKS.md` and pick the first task from it.
