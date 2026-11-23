# STATUS - Oristoria (updated 2026-11-23, session 1, model z-ai/glm-5.3-flash)

## Now
- Current task: none - todo
- Next step (one sentence): Create docs/TASKS.md and pick the first task.
- Blocked on me: venv path and lint command for AGENTS.md (no fact in docs/TECH_DESIGN.md)

## Task board
| ID | Task | State | Fast tests | Live check | Commit |
| --- | --- | --- | --- | --- | --- |

## Environment health (last doctor run: never)
| Service | First needed by | Status |
| --- | --- | --- |
| Supabase (Auth + Postgres + pgvector) | First migration / RLS tests | not needed yet |
| Cloudflare R2 | A1 source upload | not needed yet |
| Cloudflare Pages | First web deploy | not needed yet |
| Google Cloud Run | API deploy | not needed yet |
| Google Cloud Tasks | A1 async ingestion | not needed yet |
| OpenRouter | A2 grounded answers (primary LLM) | not needed yet |
| Groq | A2 answers (fallback LLM) | not needed yet |
| NVIDIA NIM | A2 answers (fallback LLM) | not needed yet |
| Resend | Non-auth email | not needed yet |
| Google Cloud Logging | Deployed API/worker logs | not needed yet |
| LangSmith | OQ-06 decision (unused by default) | not needed yet |
| Upstash Redis | Deferred (TECH_DESIGN assumption 8) | not needed yet |

## Decisions (newest first)
- None yet.

## Known bugs and debts
- None recorded.

## Resume
1. `git status` and `git branch`
2. `<venv python> scripts/doctor.py`
3. Open docs/TASKS.md at <task>.
