#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$ROOT_DIR/.pids"

stop_pid() {
  local name="$1"
  local file="$PID_DIR/$name.pid"
  if [ -f "$file" ]; then
    local pid
    pid=$(cat "$file")
    if kill "$pid" 2>/dev/null; then
      echo "Stopped $name (PID $pid)"
    else
      echo "$name already stopped"
    fi
    rm -f "$file"
  else
    echo "No PID file for $name — already stopped?"
  fi
}

stop_pid "backend"
stop_pid "frontend"
