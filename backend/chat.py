"""Chat endpoint for AI-assisted NDA drafting."""

import json
import os

from fastapi import APIRouter, Depends
from openai import OpenAI
from pydantic import BaseModel

from auth import get_current_user
from models import User

from prompts import build_system_prompt

router = APIRouter()

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

VALID_FIELDS = {
    "purpose", "effectiveDate", "mndaTermType", "mndaTermYears",
    "confidentialityTermType", "confidentialityTermYears",
    "governingLaw", "jurisdiction", "modifications",
    "party1Company", "party1Name", "party1Title", "party1Address",
    "party2Company", "party2Name", "party2Title", "party2Address",
}


from typing import Literal


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]


class ChatResponse(BaseModel):
    reply: str
    fields: dict


@router.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest, _: User = Depends(get_current_user)):
    openai_messages = [
        {"role": "system", "content": build_system_prompt()},
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
        )

    reply = parsed.get("reply", "")
    raw_fields = parsed.get("fields", {})

    # Only allow known NDA fields through
    fields = {k: v for k, v in raw_fields.items() if k in VALID_FIELDS}

    # Coerce integer fields the LLM may return as strings
    INT_FIELDS = {"mndaTermYears", "confidentialityTermYears"}
    for k in INT_FIELDS:
        if k in fields:
            try:
                fields[k] = int(fields[k])
            except (ValueError, TypeError):
                del fields[k]

    return ChatResponse(reply=reply, fields=fields)
