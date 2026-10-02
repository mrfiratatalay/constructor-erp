#!/usr/bin/env bash
# Çekim ortamını ayağa kaldırır: Docker (yalnızca PostgreSQL), üretim derlemesi arayüz (vite preview, 5173).
# Backend ayrıca: ./backend.sh [reset]. Ortam yeniden başlarsa bu betik yeniden çalıştırılır.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

if ! docker info >/dev/null 2>&1; then
  (dockerd > /tmp/dockerd.log 2>&1 &)
  for _ in $(seq 1 30); do docker info >/dev/null 2>&1 && break; sleep 1; done
fi
docker compose -f "$ROOT/docker-compose.yml" up -d --wait postgres

if [[ ! -f "$ROOT/frontend/dist/index.html" ]]; then
  (cd "$ROOT/frontend" && npx vite build >/tmp/vite-build.log 2>&1)
fi
if ! curl -fsS -o /dev/null http://localhost:5173/; then
  (cd "$ROOT/frontend" && nohup npx vite preview --port 5173 --strictPort >/tmp/vite-preview.log 2>&1 &)
  for _ in $(seq 1 30); do curl -fsS -o /dev/null http://localhost:5173/ && break; sleep 1; done
fi
echo "ortam hazır: postgres + arayüz (http://localhost:5173)"
