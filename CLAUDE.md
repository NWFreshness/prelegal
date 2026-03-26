# Paralegal Project
## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory. The ue
Al chat in order to establish what document they want and how to fill in the fields. The available documents are covere
catalog.json file in the project root, included here:

@catalog.json

## Project Status

- PROJ-7 (V1 Foundation): Complete. FastAPI backend, SQLite, login, dashboard, split-pane NDA creator with form + live preview.
- PROJ-8 (AI Chat): Complete. Replaced static form with AI chat (OpenAI gpt-4o-mini) in left pane. Users can switch between Chat and Edit Form tabs. Backend /api/chat endpoint proxies OpenAI. Chat history persists in localStorage. Backend migrated to uv (pyproject.toml).
- Only the Mutual NDA document is supported so far.
- Auth is still hardcoded (admin@prelegal.com / password123), no real backend auth yet.
- Docker packaging, scripts/, and static frontend serving are not yet implemented.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools


## Technical Design

The entire project should be packaged into a Docker container. 
The backend should be in backend/ and be a uv project, using FastAPI.
The frontend should be in frontend/ 
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in
Consider statically building the frontend and serving it via FastAPI, if that wiltwork. 

Backend available at http://localhost:8001

## Color Scheme
- Accent Yellow: #ecad0a
- Blue Primary: #209dd7
- Purple Secondary: #753991 (submit buttons)
- Dark Navy: #032147 (headings)
- Gray Text: #888888