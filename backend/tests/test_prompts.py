"""Tests for the dynamic system prompt builder."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from prompts import build_system_prompt, _catalog_names


def test_selection_prompt_contains_all_document_types():
    prompt = build_system_prompt(None)
    for name in _catalog_names:
        assert name in prompt, f"Selection prompt missing document type: {name}"


def test_selection_prompt_has_json_format_instruction():
    prompt = build_system_prompt(None)
    assert '"document_type"' in prompt
    assert '"reply"' in prompt
    assert '"fields"' in prompt


def test_document_prompt_includes_template_content():
    prompt = build_system_prompt("Mutual Non-Disclosure Agreement (NDA)")
    assert "Mutual Non-Disclosure Agreement" in prompt
    assert "Confidential Information" in prompt  # from template content


def test_document_prompt_includes_doc_description():
    prompt = build_system_prompt("Cloud Service Agreement (CSA)")
    assert "Cloud Service Agreement" in prompt
    assert "cloud software" in prompt.lower() or "SaaS" in prompt


def test_unknown_document_type_falls_back_to_selection():
    prompt = build_system_prompt("Nonexistent Document Type")
    # Should fall back to selection prompt with all available types
    for name in _catalog_names:
        assert name in prompt


def test_document_prompt_has_follow_up_instruction():
    prompt = build_system_prompt("Mutual Non-Disclosure Agreement (NDA)")
    assert "follow-up question" in prompt.lower() or "follow up question" in prompt.lower()


def test_all_catalog_entries_produce_valid_prompts():
    for name in _catalog_names:
        prompt = build_system_prompt(name)
        assert name in prompt
        assert '"reply"' in prompt
        assert '"fields"' in prompt
