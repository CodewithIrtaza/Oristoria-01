"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import auth

app = FastAPI(title="Oristoria API")

# CORS middleware
settings = get_settings()
if settings.frontend_origin:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
app.include_router(auth.router)


@app.get("/")
async def hello_world() -> dict[str, str]:
    return {"message": "Hello, Oristoria!"}


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}