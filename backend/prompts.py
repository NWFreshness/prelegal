"""Dynamic system prompt builder for all document types."""

import datetime
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
_catalog: list[dict] = json.loads((ROOT / "catalog.json").read_text(encoding="utf-8"))
_catalog_by_name: dict[str, dict] = {entry["name"]: entry for entry in _catalog}
_catalog_names: list[str] = [entry["name"] for entry in _catalog]

SELECTION_PROMPT_TEMPLATE = """\
You are a legal document assistant for Prelegal. Help the user choose a document type.

Available document types:
{catalog_list}

Rules:
1. Ask the user what kind of legal document they need.
2. When they indicate a document type, identify the best match from the list above.
3. If they request a document type not in the list, explain that it is not currently \
supported and suggest the closest available option.
4. Always respond with valid JSON in this exact format:
   {{"reply": "<your message>", "document_type": <exact name from list or null>, "fields": {{}}}}
5. Set "document_type" to the exact name string once you identify what they need. \
Keep it null while still discussing options.
6. Always end your reply with a question to guide the user. \
If you have identified their document type, confirm it and ask if they are ready to proceed.
7. Today's date is {today}."""


DOCUMENT_PROMPT_TEMPLATE = """\
You are a legal assistant helping a user fill out a {doc_name}.

Document description: {doc_description}

Here is the document template for reference:
---
{template_content}
---

Have a short, friendly conversation to collect all fields needed for this document.
Today's date is {today}. Use this as a default for any effective date field.

Always respond with valid JSON in this exact format:
{{"reply": "<your message to the user>", "document_type": "{doc_name}", "fields": {{<all fields collected so far>}}}}

Rules:
1. Ask about a few related fields at a time, not all at once.
2. Suggest reasonable defaults where appropriate.
3. Include every field you have collected so far in "fields", not just new ones.
4. Omit fields you do not know yet. Do not include null values.
5. Extract information proactively from what the user says.
6. Be concise. Do not repeat legal boilerplate.
7. ALWAYS end your reply with a follow-up question if there are still fields to collect. \
Guide the user step by step through the document.
8. Use clear field names in camelCase (e.g., "effectiveDate", "partyOneName", "governingLaw")."""


def _load_template(filename: str) -> str:
    """Load a template file, capped at 150 lines to manage token budget."""
    path = ROOT / filename
    if not path.exists():
        return "(Template file not found)"
    lines = path.read_text(encoding="utf-8").splitlines()
    return "\n".join(lines[:150])


def build_system_prompt(document_type: str | None) -> str:
    """Build a system prompt for the given document type, or the selection prompt if None."""
    today = datetime.date.today().isoformat()

    if document_type is None:
        catalog_list = "\n".join(
            f"- {entry['name']}: {entry['description']}" for entry in _catalog
        )
        return SELECTION_PROMPT_TEMPLATE.format(catalog_list=catalog_list, today=today)

    entry = _catalog_by_name.get(document_type)
    if entry is None:
        catalog_list = "\n".join(
            f"- {entry['name']}: {entry['description']}" for entry in _catalog
        )
        return SELECTION_PROMPT_TEMPLATE.format(catalog_list=catalog_list, today=today)

    template_content = _load_template(entry["filename"])
    return DOCUMENT_PROMPT_TEMPLATE.format(
        doc_name=entry["name"],
        doc_description=entry["description"],
        template_content=template_content,
        today=today,
    )
