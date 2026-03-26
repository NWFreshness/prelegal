#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$ROOT_DIR/.pids"
mkdir -p "$PID_DIR"

# ── Backend ──────────────────────────────────────────────────────────────────
echo "Starting backend..."
cd "$ROOT_DIR/backend"

# Create venv if it doesn't exist
if [ ! -d ".venv" ]; then
  python -m venv .venv
fi

# Activate (works on both Unix and Windows/Git Bash)
source .venv/Scripts/activate 2>/dev/null || source .venv/bin/activate

pip install -r requirements.txt --quiet

uvicorn main:app --reload --port 8000 &
echo $! > "$PID_DIR/backend.pid"
echo "  Backend running at http://localhost:8000  (PID $(cat "$PID_DIR/backend.pid"))"

# ── Frontend ─────────────────────────────────────────────────────────────────
echo "Starting frontend..."
cd "$ROOT_DIR/frontend"

npm install --silent

npm run dev &
echo $! > "$PID_DIR/frontend.pid"
echo "  Frontend running at http://localhost:3000  (PID $(cat "$PID_DIR/frontend.pid"))"

echo ""
echo "Both services started. Run ./stop.sh to stop them."
