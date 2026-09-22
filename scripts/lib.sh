#!/usr/bin/env bash
# Betiklerin ortak parçaları. Tek başına çalıştırılmaz, diğer betikler source eder.

# Docker açık mı? Değilse ne yapılacağını söyler; "connection refused" yığını gösterilmez.
require_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    echo "Docker kurulu değil. https://docs.docker.com/get-docker/ adresinden kur." >&2
    exit 1
  fi
  if ! docker info >/dev/null 2>&1; then
    echo "Docker çalışmıyor. Docker Desktop'ı (ya da docker servisini) başlatıp tekrar dene." >&2
    exit 1
  fi
}

# Bir ayarın değeri: önce ortam değişkeni, sonra .env dosyası, sonra varsayılan. Yalnızca ekrana yazmak için
# (Compose aynı sırayı kendisi uygular).
setting() {
  local key="$1" fallback="$2" value="${!key:-}"
  if [ -z "$value" ] && [ -f .env ]; then
    value="$(grep -E "^${key}=" .env | tail -1 | cut -d= -f2- || true)"
  fi
  echo "${value:-$fallback}"
}
