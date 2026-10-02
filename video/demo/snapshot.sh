#!/usr/bin/env bash
# Demo verisinin anlık görüntüsü: her çekim aynı başlangıç durumundan tekrar alınabilsin.
#   ./snapshot.sh save <ad>      santiye_video + medya → santiye_snap_<ad>
#   ./snapshot.sh restore <ad>   anlık görüntüyü geri yükler ve backend'i yeniden başlatır (DEMO_NOW geçerli)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/video/out"
PG="docker compose -f $ROOT/docker-compose.yml exec -T postgres psql -U santiye -d santiye -v ON_ERROR_STOP=1 -q"
action="$1"
name="santiye_snap_$2"

pkill -f 'santiye-api-0.0.1-SNAPSHOT.jar' 2>/dev/null && sleep 2 || true
if [[ "$action" == "save" ]]; then
  $PG -c "drop database if exists $name with (force)" -c "create database $name template santiye_video"
  rm -rf "$OUT/snapshots/$2" && mkdir -p "$OUT/snapshots/$2" && cp -a "$OUT/media" "$OUT/snapshots/$2/media"
  cp "$OUT/sessions.json" "$OUT/snapshots/$2/sessions.json"
  "$HERE/backend.sh" >/dev/null
  echo "kaydedildi: $2"
else
  $PG -c "drop database if exists santiye_video with (force)" -c "create database santiye_video template $name"
  rm -rf "$OUT/media" && cp -a "$OUT/snapshots/$2/media" "$OUT/media"
  cp "$OUT/snapshots/$2/sessions.json" "$OUT/sessions.json"
  "$HERE/backend.sh"
fi
