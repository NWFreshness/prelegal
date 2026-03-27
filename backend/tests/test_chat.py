"""Tests for the chat endpoint."""

import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

sys.path.insert(0, str(Path(__file__).parent.parent))

import json
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def _mock_openai_response(content: dict):
    """Create a mock OpenAI completion response."""
    mock_choice = MagicMock()
    mock_choice.message.content = json.dumps(content)
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]
    return mock_completion


@patch("chat.client.chat.completions.create")
def test_chat_without_document_type(mock_create):
    mock_create.return_value = _mock_openai_response({
        "reply": "What kind of document do you need?",
        "document_type": None,
        "fields": {},
    })
    resp = client.post("/api/chat", json={
        "messages": [{"role": "user", "content": "Hi"}],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["reply"] == "What kind of document do you need?"
    assert data["document_type"] is None
    assert data["fields"] == {}


@patch("chat.client.chat.completions.create")
def test_chat_with_document_type(mock_create):
    mock_create.return_value = _mock_openai_response({
        "reply": "Great, let's fill out your CSA.",
        "document_type": "Cloud Service Agreement (CSA)",
        "fields": {"providerName": "Acme Corp"},
    })
    resp = client.post("/api/chat", json={
        "messages": [{"role": "user", "content": "I need a CSA for Acme Corp"}],
        "document_type": "Cloud Service Agreement (CSA)",
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["document_type"] == "Cloud Service Agreement (CSA)"
    assert data["fields"]["providerName"] == "Acme Corp"


@patch("chat.client.chat.completions.create")
def test_chat_handles_invalid_json(mock_create):
    mock_choice = MagicMock()
    mock_choice.message.content = "not valid json {"
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]
    mock_create.return_value = mock_completion

    resp = client.post("/api/chat", json={
        "messages": [{"role": "user", "content": "test"}],
    })
    assert resp.status_code == 200
    data = resp.json()
    assert "trouble" in data["reply"].lower()
    assert data["fields"] == {}


@patch("chat.client.chat.completions.create")
def test_chat_returns_document_type_from_ai(mock_create):
    mock_create.return_value = _mock_openai_response({
        "reply": "I'll help with an NDA.",
        "document_type": "Mutual Non-Disclosure Agreement (NDA)",
        "fields": {},
    })
    resp = client.post("/api/chat", json={
        "messages": [{"role": "user", "content": "I need an NDA"}],
        "document_type": None,
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["document_type"] == "Mutual Non-Disclosure Agreement (NDA)"
