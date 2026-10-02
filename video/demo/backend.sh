#!/usr/bin/env bash
# Reklam çekiminin backend'i: ayrı veritabanı (santiye_video), kaydırılmış saat, hazır firma yok.
#   ./backend.sh reset   veritabanını sıfırlar ve başlatır
#   ./backend.sh         var olan veriyle başlatır
# Saat: çekimin "bugün"ü DEMO_NOW'dur (İstanbul). Fark out/clock-offset.txt'e yazılır; tarayıcı da aynı farkı kullanır.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
OUT="$ROOT/video/out"
JAVA_HOME="${JAVA_HOME_25:-/usr/lib/jvm/java-25-openjdk-amd64}"
DEMO_NOW="${DEMO_NOW:-2026-10-22T14:26:00}"
DB=santiye_video
PG="docker compose -f $ROOT/docker-compose.yml exec -T postgres psql -U santiye -d santiye -v ON_ERROR_STOP=1"

mkdir -p "$OUT" "$OUT/media"
pkill -f 'santiye-api-0.0.1-SNAPSHOT.jar' 2>/dev/null && sleep 2 || true

if [[ "${1:-}" == "reset" ]]; then
  $PG -c "drop database if exists $DB with (force)" -c "create database $DB owner santiye"
  rm -rf "$OUT/media" && mkdir -p "$OUT/media"
fi

target=$(TZ=Europe/Istanbul date -d "$DEMO_NOW" +%s)
offset=$(( target - $(date +%s) ))
echo "$offset" > "$OUT/clock-offset.txt"

cd "$ROOT/backend"
nohup "$JAVA_HOME/bin/java" \
  -Dloader.path="$HERE/clock/build/demo-clock.jar" \
  -cp target/santiye-api-0.0.1-SNAPSHOT.jar org.springframework.boot.loader.launch.PropertiesLauncher \
  --spring.profiles.active=local \
  --spring.datasource.url="jdbc:postgresql://localhost:5432/$DB" \
  --demo.offset-seconds="$offset" \
  --app.media.root="$OUT/media" \
  --app.bootstrap.company-name= \
  --app.platform.admin-name="İskele ERP Destek" \
  --app.platform.admin-email=destek@iskele-demo.test \
  --app.platform.admin-password=demo-destek-2026 \
  --app.invite.base-url=http://localhost:5173 \
  > "$OUT/backend.log" 2>&1 &

for _ in $(seq 1 90); do
  if curl -fsS http://127.0.0.1:8080/actuator/health 2>/dev/null | grep -q UP; then
    echo "backend hazır · bugün: $DEMO_NOW (fark ${offset}s)"; exit 0
  fi
  sleep 2
done
echo "backend açılmadı, bkz. $OUT/backend.log" >&2
exit 1
