#!/usr/bin/env bash
# Demo veritabanını (santiye_demo) ve medyasını siler. Backend kapalıyken çalıştırılır: açılınca boş
# veritabanında firmayı ve patronu yeniden kurar, sonra seed.mjs dünyayı doldurur.
set -euo pipefail

repo="$(cd "$(dirname "$0")/../../.." && pwd)"
if curl -s http://127.0.0.1:8080/actuator/health > /dev/null 2>&1; then
  echo "Önce demo backend'ini durdur (Ctrl+C)." >&2
  exit 1
fi
docker compose -f "$repo/docker-compose.yml" exec -T postgres psql -U santiye -d santiye \
  -c "drop database if exists santiye_demo" -c "create database santiye_demo owner santiye"
rm -rf "$repo/marketing/video/demo-data/.media" "$repo/marketing/video/demo-data/.ids.json"
echo "Demo veritabanı boş. Sıradaki: ./backend.sh, sonra node seed.mjs"
