#!/usr/bin/env bash
# Bütün sistemi Docker'da ayağa kaldırır: veritabanı, backend ve arayüz.
# Depo klonlandıktan sonra tek gereken budur. İlk çalıştırma derleme yüzünden birkaç dakika sürer.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
source scripts/lib.sh

require_docker

echo "İmajlar hazırlanıyor ve servisler başlatılıyor…"
echo "(ilk seferde backend ve arayüz derlenir, birkaç dakika sürebilir)"
if ! docker compose --profile app up -d --build --wait --wait-timeout "${STARTUP_TIMEOUT:-600}"; then
  echo >&2
  echo "Başlatılamadı. Sık sebepler:" >&2
  echo "  · $(setting WEB_PORT 5173) ya da $(setting API_PORT 8080) portu dolu (geliştirme sunucuları açık olabilir)" >&2
  echo "  · bir servis hata verdi: ./scripts/logs.sh ile kayıtlara bak" >&2
  exit 1
fi

echo
echo "Hazır."
echo "  Arayüz     http://localhost:$(setting WEB_PORT 5173)"
echo "  API        http://localhost:$(setting API_PORT 8080)/swagger-ui.html"
echo "  Giriş      $(setting OWNER_EMAIL patron@kizilkan.local) / $(setting OWNER_PASSWORD patron123)"
echo
echo "Kayıtlar: ./scripts/logs.sh   ·   Durdur: ./scripts/stop.sh"
