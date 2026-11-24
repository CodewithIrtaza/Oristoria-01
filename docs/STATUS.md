# STATUS - Oristoria (updated 2026-11-24, session 8, model nemotron-3-ultra)

## Now
- Current task: **T02 Onboarding complete** — workspace naming + sample SSE answer + first-value event.
- Next step: **Begin T03 Workspace CRUD + tenant isolation test (User A ≠ User B)**.
- Blocked on me: nothing.

## Task board
| ID | Task | State | Fast tests | Live check | Commit |
|---|---|---|---|---|---|
| H1 | Repo hygiene | done | n/a | n/a | `7a1abf0`, `104e085` |
| E1 | Environment setup | done | pass (3) | pending - no keys | `chore: environment setup` |
| S1 | App scaffold | done | pass (5) | waiting for key | `chore: scaffold` |
| S2 | DB connection hardening | done | pass (15) | waiting for key | multiple |
| T00 | Design system | **done** | **pass (67)** | n/a | `feat: design system` |
| T01 | Auth magic-link | **done** | **pass (12+14)** | Supabase **pass** | `feat: auth magic-link + JWT` |
| T02 | Onboarding | **done** | **pass (21+97)** | n/a | `a5e3c26` |

## Environment health
| Service | Status |
|---|---|
| Supabase (Auth+Postgres+pgvector) | **All live checks OK** — project `gbfvxbdqgpkcjyvqzqvh` (ap-south-1) |
| OpenRouter / Groq | **OK** |
| R2 / NIM / Resend / GCP | not needed yet (T04+) |

## Decisions
- T02: Non-tenant `onboarding_samples` table; first-value in `profiles.onboarding_state.jsonb`; real LLM deferred to T07.
- Remote DB: one host, `sslmode=verify-full` or `require` only; loopback exempt.
- Python floor 3.12 (numpy 2.5.5).
- Lint: stdlib `scripts/lint.py`; pytest marks `live` for external services.
- `.env` uses project `gbfvxbdqgpkcjyvqzqvh` — ENV_GUIDE.md updated to match.

## Known bugs
- Frontend build/lockfile pending npm install approval.
- Local Compose Postgres trust-auth loopback only.
- `docs/TASKS.md` not created; board above is tracker.
- Service adapters empty scaffolds; only hello/health + DB connectivity implemented.

## Resume
1. `git status` / `git branch`
2. `apps/api/.venv/Scripts/python.exe -m pytest -m "not live"`
3. `apps/api/.venv/Scripts/python.exe scripts/lint.py`
4. `cd apps/web && npm test && npm run lint`
5. Fill `.env` from `ENV_GUIDE.md`, run live checks
6. Create `docs/TASKS.md`, pick first task