"""Fast API contract test for the public scaffold endpoints."""
from fastapi.testclient import TestClient

from app.main import app


def test_hello_and_health_endpoints() -> None:
    with TestClient(app) as client:
        hello = client.get("/")
        health = client.get("/healthz")

    assert hello.status_code == 200
    assert hello.json() == {"message": "Hello, Oristoria!"}
    assert health.status_code == 200
    assert health.json() == {"status": "ok"}
