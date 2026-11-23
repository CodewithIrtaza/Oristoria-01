# Oristoria — Environment Variable Guide

Companion to `.env.example` (names only) and `docs/TECH_DESIGN.md` §8 (source of truth).
Every dashboard/doc link below was confirmed reachable on **2026-11-23**.

**Rules**

- Fill your local `.env` only. It is gitignored and is **never** committed, printed, or logged.
- **Dev and prod use different projects and different keys — never copy a value across environments.**
- Nothing in this file is a secret; every value slot is deliberately empty.
- `scripts/doctor.py` reports `SET` / `MISSING` / `not-needed-yet` and runs tiny live checks; it never prints a value.

**Cost summary:** everything below is **$0/month** for the private beta (TECH_DESIGN "Budget"), within the free-tier limits noted per service.

---

## 1. Repo config (no dashboard, no cost)

| Variable | Dev | Prod | First task | Notes |
|---|---|---|---|---|
| `ENVIRONMENT` | `dev` | `prod` | Add to `.env.example` (done) | Switches logging + guardrail behavior. |
| `LLM_PRIMARY_PROVIDER` | `openrouter` | `openrouter` | Pick after the §5 live checks | One of `openrouter` \| `groq` \| `nim`. |
| `PLAN_LIMITS_JSON` | caps | caps | Define caps with the founder (PRD OQ-03) | Free/pro plan caps per metric (B3). |
| `LOG_LEVEL` | `debug` | `info` | Add default in `config.py` | |
| `LIVE_CHECKS_ENABLED` | `on` (manual runs) | `off` | Wire into `scripts/doctor.py` | Gates real-service smoke tests. |

---

## 2. Supabase (Auth + Postgres + pgvector)

Dashboard: <https://supabase.com/dashboard> — select the dev project **`Taleem.AI`** (ref `zykipnawtoxnkezivaqc`, region `ap-northeast-1`).
**It is currently PAUSED — unpause it first** (risk #1: free projects auto-pause after 1 week idle; max 2 active projects).

Docs used below: [Project settings](https://supabase.com/docs/guides/platform/project-settings) · [Access tokens & API keys](https://supabase.com/docs/guides/platform/access-tokens) · [Connecting to Postgres / database URLs](https://supabase.com/docs/guides/database/connecting-to-postgres) · [Auth rate limits](https://supabase.com/docs/guides/auth/rate-limits) · [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

| Variable | Exact steps (dashboard page) | Dev | Prod | First task | Free tier / cost |
|---|---|---|---|---|---|
| `SUPABASE_URL` | Dashboard → project → **Project Settings → API** → copy **Project URL** | from `Taleem.AI` | new prod project, same page | Copy from dev project settings | 500 MB DB, 5 GB egress, unlimited API requests — $0 |
| `SUPABASE_ANON_KEY` | Same page → **Project API keys** → publishable/`anon` key | from `Taleem.AI` | new prod project | Copy from dev project settings | included above — $0 |
| `SUPABASE_SERVICE_ROLE_KEY` | Same page → **Project API keys** → `service_role` (server-only, BYPASSRLS) | from `Taleem.AI` | new prod project | Copy, then keep out of git and store in a secret store | included above — $0 |
| `DATABASE_URL` | Dashboard → **Connect → Session pooler** → copy the pooled connection string (role `app_api`), then add `sslmode=verify-full` and `sslrootcert` pointing to the downloaded Supabase CA certificate | session-pooler DSN | same, own project | Create `app_api` role via migration first, then copy DSN | free connection limits apply; pooling included — $0 |
| `MIGRATIONS_DATABASE_URL` | Dashboard → **Connect → Direct connection** → copy the owner-role DSN for Alembic only, then add the same `sslmode=verify-full` and `sslrootcert` parameters | direct DSN | same, own project | Copy direct DSN; keep out of the app image | $0 |
| `AUTH_REDIRECT_URL` | Dashboard → **Authentication → URL Configuration** → add allowed redirect URL | `http://localhost:5173/...` | prod domain URL | Add localhost first, then prod URL | Auth: 50k MAU free; links expire 1 h; 30 sign-in req / 5 min / IP |
| `AUTH_COOKIE_SECRET` | No dashboard — generate locally: `python -c "import secrets; print(secrets.token_urlsafe(32))"` and paste **into `.env` yourself** | 32 random bytes | separate 32 random bytes | Generate 32-byte random value | free; rotating it invalidates sessions |

Auth email note: Supabase built-in email allows only **2 emails/hour project-wide** (see [rate limits](https://supabase.com/docs/guides/auth/rate-limits)) - relevant when magic links are first tested.

Database TLS note: download the server root certificate from **Database Settings → SSL Configuration**. For a remote Supabase DSN, append `?sslmode=verify-full&sslrootcert=C:/path/to/prod-ca-2021.crt` (use `&` instead of `?` if the copied URL already has query parameters). The API and live database check reject remote DSNs that do not verify the server certificate and hostname. Loopback development URLs may omit TLS.

---

## 3. Cloudflare R2 (private object storage)

Dashboard: <https://dash.cloudflare.com/> → **R2**. Docs: [Pricing](https://developers.cloudflare.com/r2/pricing/) · [S3 API tokens](https://developers.cloudflare.com/r2/api/s3/tokens/)

| Variable | Exact steps | Dev | Prod | First task | Free tier / cost |
|---|---|---|---|---|---|
| `R2_ACCOUNT_ID` | R2 dashboard → right sidebar / **Manage R2 API Tokens** page shows the **Account ID** | account id | same account, separate bucket | Create Cloudflare account + bucket | 10 GB-month storage, 1M Class A / 10M Class B ops, **$0 egress** |
| `R2_BUCKET` | R2 → **Buckets → Create bucket** → name it `oristoria-dev` | `oristoria-dev` | `oristoria-prod` | Create the bucket | included above — $0 |
| `R2_ACCESS_KEY_ID` | R2 → **Manage R2 API Tokens → Create API token** → scope **Object Read & Write** on that one bucket → token page shows Access Key ID | scoped token | separate scoped token | Create scoped token | 1M Class A / 10M Class B ops free |
| `R2_SECRET_ACCESS_KEY` | Same page — the secret is **shown once**; paste it into `.env` immediately | shown once | shown once | Create with the key above | included above — $0 |

---

## 4. LLM providers

| Variable | Exact steps | Dev | Prod | First task | Free tier / cost |
|---|---|---|---|---|---|
| `OPENROUTER_API_KEY` | <https://openrouter.ai/keys> → **Create Key**; set a **$0 credit limit** so only free models can be used | key | separate key | Create key, set a $0/free-model budget | Per-model free-request caps + per-IP burst limits ([limits](https://openrouter.ai/docs/api_reference/limits)) — $0 with free models |
| `OPENROUTER_MODEL` | Same site → **Models** page → pick a free-tier model id after the rate-limit check | model id | model id | Choose a free-tier model after the rate-limit check | free-model quota as above |
| `GROQ_API_KEY` | <https://console.groq.com/> → **API Keys** → Create | key | separate key | Create key | High-throughput free tier; org RPM/TPM/TPD ([limits](https://console.groq.com/docs/rate-limits)) — $0 |
| `GROQ_MODEL` | console.groq.com → **Models** → note the model id + its RPM/TPM | model id | model id | Pick model, note its RPM/TPM | included above — $0 |
| `NIM_API_KEY` | <https://build.nvidia.com/> → **Settings → API Keys** → Generate Key | key | separate key | Create key | Prototype tier ≈ **40 requests/minute** ([limits](https://build.nvidia.com/settings/limits)) — $0 |
| `NIM_MODEL` | build.nvidia.com → **Models** → pick an `integrate.api.nvidia.com` chat model id | model id | model id | Pick model, note ≈40 RPM limit | included above — $0 |
| `LANGSMITH_API_KEY` | <https://smith.langchain.com/settings> — **do not create yet** | **leave unset** | **leave unset** | None until PRD OQ-06 is decided | tracing disabled when unset — $0 |

---

## 5. Resend (non-auth transactional email)

Docs: [Account quotas & limits](https://resend.com/docs/knowledge-base/account-quotas-and-limits) · [API keys](https://resend.com/docs/dashboard/api-keys)

| Variable | Exact steps | Dev | Prod | First task | Free tier / cost |
|---|---|---|---|---|---|
| `RESEND_API_KEY` | <https://resend.com/> → **Domains** → verify your sending domain (DNS SPF/DKIM) → **API Keys → Create** | key | separate key | Create key + verify sending domain | **100 emails/day, 3,000/month, 3 verified domains** — $0 |
| `EMAIL_FROM` | Resend → **Domains** → use an address on the verified domain (e.g. `hello@yourdomain.com`) | address | address | Verify domain, set address | included above — $0 |

---

## 6. Google Cloud (Cloud Run + Cloud Tasks)

Console: <https://console.cloud.google.com/> · Docs: [Cloud Run pricing](https://cloud.google.com/run/pricing) · [Cloud Tasks pricing](https://cloud.google.com/tasks/pricing)

| Variable | Exact steps | Dev | Prod | First task | Free tier / cost |
|---|---|---|---|---|---|
| `GOOGLE_CLOUD_PROJECT` | console.cloud.google.com → **project selector → New project** (then **Settings**) | new GCP project | separate prod project | Create GCP project; add a billing card **for free-tier use only** (**LIVE CHECK** on free-tier eligibility) | Run: 180,000 vCPU-s + 360,000 GiB-s + 2M requests/mo free |
| `CLOUD_TASKS_QUEUE` | console → **Cloud Tasks → Queues → Create queue** in your chosen region (e.g. `ingest-dev`) | `ingest-dev` | `ingest-prod` | Create queue in the chosen region | First **1M billable ops/month free** |
| `GOOGLE_APPLICATION_CREDENTIALS` | **IAM & Admin → Service Accounts → Create** → role **Cloud Tasks Enqueuer** only → **Keys → Add key → JSON** → store the file path here (local/CI only; never in the app image) | path to JSON | not used (runtime SA instead) | Create SA with Cloud Tasks Enqueuer only | $0 for the key itself |
| `CLOUD_RUN_REGION` | **Cloud Run → Create service → Region** picker (choose near `ap-northeast-1`) | region | region | Pick region near ap-northeast-1 (**LIVE CHECK** eligible free regions) | covered by Run free tier above |

---

## 7. Frontend and founder-only

| Variable | Exact steps | Dev | Prod | First task | Free tier / cost |
|---|---|---|---|---|---|
| `FRONTEND_ORIGIN` | <https://dash.cloudflare.com/> → **Pages → Create project** (repo-connected) → after first deploy, use its URL; dev stays `http://localhost:5173` | `http://localhost:5173` | prod custom domain (Pages → Custom domains) | Create Pages project first | 500 builds/mo, unlimited static requests — $0 ([limits](https://developers.cloudflare.com/pages/platform/limits/)) |
| `ADMIN_API_KEY` | No dashboard — generate locally (`python -c "import secrets; print(secrets.token_urlsafe(32))"`), store the value in your password manager / Secret Manager, paste into `.env` yourself | generated | separate generated value | Generate; never commit | $0 |

---

## 8. How to verify

```bash
# from the repo root — prints status for every name in .env.example, never a value
apps/api/.venv/Scripts/python.exe scripts/doctor.py

# run the real database connectivity check; skips cleanly when DATABASE_URL is missing
apps/api/.venv/Scripts/python.exe -m pytest -m live tests/live/test_database.py -q -rs
```
