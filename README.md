# Oristoria

Oristoria turns a user's own documents into source-grounded, cited answers and research
deliverables.

The repository follows the structure in `docs/TECH_DESIGN.md`. The current scaffold provides a FastAPI
hello endpoint, `GET /healthz`, a React/Vite hello screen, fast and live tests, and CI.

## Requirements

- Python 3.12+ for the API (the local venv uses Python 3.12.13).
- `uv` when provisioning the pinned Python dependencies.
- Node.js 22.12+ for the Vite 8 frontend.
- Docker only for the optional local pgvector service; it is bound to `127.0.0.1` and must not be exposed.

## Backend

From the repository root on Windows:

```powershell
# Install only the pinned dependencies when dependency installation is approved (requires uv).
uv pip install --python apps/api/.venv/Scripts/python.exe -r apps/api/requirements.txt

# Run the API.
apps/api/.venv/Scripts/python.exe -m uvicorn app.main:app --app-dir apps/api --host 127.0.0.1 --port 8000
```

Call the public endpoints from another terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/
Invoke-RestMethod http://127.0.0.1:8000/healthz
```

Expected responses:

```json
{"message":"Hello, Oristoria!"}
{"status":"ok"}
```

## Verification

Run from the repository root:

```powershell
# Fast tests: no network or credentials required.
apps/api/.venv/Scripts/python.exe -m pytest -m "not live"

# Database live check: skips when DATABASE_URL is missing.
apps/api/.venv/Scripts/python.exe -m pytest -m live tests/live/test_database.py -q -rs

# All live checks.
apps/api/.venv/Scripts/python.exe -m pytest -m live -q -rs

# Dependency-free project linter.
apps/api/.venv/Scripts/python.exe scripts/lint.py

# Environment status; prints variable names and statuses, never values.
apps/api/.venv/Scripts/python.exe scripts/doctor.py
```

## Frontend

The React 19 + Vite screen is in `apps/web/`. Its package versions are declared in
`apps/web/package.json`, but JavaScript packages were not installed during this scaffold because the
project's dependency-approval rule requires approval first.

After approval, run:

```powershell
cd apps/web
npm install
npm run dev
```

The Vite development server proxies `/healthz` to `http://127.0.0.1:8000`.

## CI

`.github/workflows/ci.yml` installs only `apps/api/requirements.txt`, then runs the fast tests and the
project linter. It defines no secrets and does not run live checks.
