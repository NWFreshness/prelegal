"""Chat endpoint for AI-assisted legal document drafting."""

import json
import os

from fastapi import APIRouter
from openai import OpenAI
from pydantic import BaseModel
from typing import Literal

from prompts import build_system_prompt

router = APIRouter()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]
    document_type: str | None = None


class ChatResponse(BaseModel):
    reply: str
    fields: dict
    document_type: str | None = None


@router.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    system_prompt = build_system_prompt(request.document_type)

    openai_messages = [
        {"role": "system", "content": system_prompt},
    ]
    for msg in request.messages:
        openai_messages.append({"role": msg.role, "content": msg.content})

    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=openai_messages,
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    raw = completion.choices[0].message.content or "{}"
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        return ChatResponse(
            reply="Sorry, I had trouble processing that. Could you try again?",
            fields={},
            document_type=request.document_type,
        )

    reply = parsed.get("reply", "")
    fields = parsed.get("fields", {})
    document_type = parsed.get("document_type", request.document_type)

    return ChatResponse(reply=reply, fields=fields, document_type=document_type)
