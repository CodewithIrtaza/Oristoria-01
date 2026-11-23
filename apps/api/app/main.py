"""FastAPI application entry point."""
from fastapi import FastAPI

app = FastAPI(title="Oristoria API")


@app.get("/")
async def hello_world() -> dict[str, str]:
    return {"message": "Hello, Oristoria!"}


@app.get("/healthz")
async def healthz() -> dict[str, str]:
    return {"status": "ok"}
