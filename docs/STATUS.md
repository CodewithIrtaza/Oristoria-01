# STATUS - Oristoria (updated 2026-11-23, session 2, model minimax-m3.1-flash)

## Now
- Current task: environment setup complete (venv, pinned deps, `.env.example`, `docs/ENV_GUIDE.md`, `scripts/doctor.py`, live-test harness).
- Next step (one sentence): Founder creates the accounts/keys listed in `docs/ENV_GUIDE.md` and pastes them into `.env`, then run `scripts/doctor.py` again.
- Blocked on me: every external credential is still unset - all live checks are skipped, not passed.

## Task board
| ID | Task | State | Fast tests | Live check | Commit |
| --- | --- | --- | --- | --- | --- |
| H1 | Repo hygiene (gitignore, hooks, dependabot, PR template) | done | n/a | n/a | `7a1abf0`, `104e085` |
| E1 | Environment setup (venv, pinned deps, env guide, doctor, live harness) | done | pass (3 passed) | pending - no keys set | `chore: environment setup` |

## Environment health (last doctor run: 2026-11-23, session 2 - all vars MISSING, every live check skipped)
| Service | First needed by | Status |
| --- | --- | --- |
| Supabase (Auth + Postgres + pgvector) | First migration / RLS tests | not needed yet - dev project `Taleem.AI` is PAUSED, unpause before first DB task |
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
- Python project lives in `apps/api/`: venv `apps/api/.venv` (Python 3.12.13), pins in `apps/api/requirements.txt` (115 lines, matches `uv pip freeze`).
- `psycopg[binary]` pinned to `3.2.9` (TECH_DESIGN family); PyPI's current `3.3.9` also satisfies LangGraph's `>=3.2` - revisit when the checkpointer is wired.
- pytest config lives in root `pytest.ini` (`addopts = -m "not live"`), so `pytest -m live` is the only way live tests run; fast tests are in `tests/`, live tests in `tests/live/` (fast tests never import from live).
- Context7 MCP was unavailable in this session; package docs were verified against the official sites listed in the install log instead.
- Repo is currently PUBLIC (`gh` was unauthenticated; anonymous HTTP 200). Private it if you want a closed beta.

## Known bugs and debts
- No linter is configured yet (`AGENTS.md` still says `<command>`); no linter is in the TECH_DESIGN package list.
- `docs/TASKS.md` still does not exist - the task board above is the only tracker until it is created.
- `scripts/doctor.py` can only prove credentials work; it does not verify free-tier quotas (RPM/TPM/email-per-hour) - those stay manual LIVE CHECKs.

## Resume
1. `git status` and `git branch`
2. `apps/api/.venv/Scripts/python.exe scripts/doctor.py`
3. Fill `.env` from `docs/ENV_GUIDE.md`, re-run the doctor, then record the real live-check results here.
4. Create `docs/TASKS.md` and pick the first task from it.
