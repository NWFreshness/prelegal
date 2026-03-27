"""Integration tests for auth and document routes."""

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

os.environ.setdefault("JWT_SECRET", "test-secret-key-32-chars-long-ok")
os.environ.setdefault("OPENAI_API_KEY", "test-key")

# Patch database to use in-memory SQLite with StaticPool (single shared connection)
import database

_test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
database.engine = _test_engine
database.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_test_engine)

from main import app  # noqa: E402 — must import after patching


@pytest.fixture(autouse=True)
def setup_db():
    """Create tables fresh for each test."""
    from models import User, Document  # noqa: F401
    database.Base.metadata.create_all(bind=_test_engine)
    yield
    database.Base.metadata.drop_all(bind=_test_engine)


@pytest.fixture
def client():
    return TestClient(app, raise_server_exceptions=True)


def signup(client, email="user@test.com", password="pass1234", name="Test User"):
    return client.post("/api/auth/signup", json={"name": name, "email": email, "password": password})


# --- Auth tests ---

def test_signup_success(client):
    res = signup(client)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "user@test.com"
    assert "prelegal-token" in res.cookies


def test_signup_duplicate_email(client):
    signup(client)
    res = signup(client)
    assert res.status_code == 400


def test_login_success(client):
    signup(client)
    res = client.post("/api/auth/login", json={"email": "user@test.com", "password": "pass1234"})
    assert res.status_code == 200
    assert "prelegal-token" in res.cookies


def test_login_wrong_password(client):
    signup(client)
    res = client.post("/api/auth/login", json={"email": "user@test.com", "password": "wrong"})
    assert res.status_code == 401


def test_me_authenticated(client):
    signup(client)
    token = client.post("/api/auth/login", json={"email": "user@test.com", "password": "pass1234"}).cookies["prelegal-token"]
    res = client.get("/api/auth/me", cookies={"prelegal-token": token})
    assert res.status_code == 200
    assert res.json()["email"] == "user@test.com"


def test_me_unauthenticated(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401


def test_logout(client):
    signup(client)
    res = client.post("/api/auth/logout")
    assert res.status_code == 200


# --- Document tests ---

def _auth_client(client):
    """Return a client with a valid auth cookie."""
    signup(client)
    token = client.post("/api/auth/login", json={"email": "user@test.com", "password": "pass1234"}).cookies["prelegal-token"]
    client.cookies.set("prelegal-token", token)
    return client


def test_save_and_list_documents(client):
    _auth_client(client)
    res = client.post("/api/documents", json={"title": "Test NDA", "form_data": {"party1Company": "Acme"}})
    assert res.status_code == 200
    assert res.json()["title"] == "Test NDA"

    res = client.get("/api/documents")
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_get_document(client):
    _auth_client(client)
    doc_id = client.post("/api/documents", json={"title": "Test NDA", "form_data": {"party1Company": "Acme"}}).json()["id"]
    res = client.get(f"/api/documents/{doc_id}")
    assert res.status_code == 200
    assert res.json()["form_data"]["party1Company"] == "Acme"


def test_update_document(client):
    _auth_client(client)
    doc_id = client.post("/api/documents", json={"title": "Old Title", "form_data": {}}).json()["id"]
    res = client.put(f"/api/documents/{doc_id}", json={"title": "New Title", "form_data": {"party1Company": "Updated"}})
    assert res.status_code == 200
    assert res.json()["title"] == "New Title"
    detail = client.get(f"/api/documents/{doc_id}").json()
    assert detail["form_data"]["party1Company"] == "Updated"


def test_document_isolation(client):
    """User A cannot access User B's documents."""
    signup(client, email="a@test.com", password="pass1234", name="User A")
    token_a = client.post("/api/auth/login", json={"email": "a@test.com", "password": "pass1234"}).cookies["prelegal-token"]
    client.cookies.set("prelegal-token", token_a)
    doc_id = client.post("/api/documents", json={"title": "A's Doc", "form_data": {}}).json()["id"]

    signup(client, email="b@test.com", password="pass1234", name="User B")
    token_b = client.post("/api/auth/login", json={"email": "b@test.com", "password": "pass1234"}).cookies["prelegal-token"]
    client.cookies.set("prelegal-token", token_b)

    res = client.get(f"/api/documents/{doc_id}")
    assert res.status_code == 404
