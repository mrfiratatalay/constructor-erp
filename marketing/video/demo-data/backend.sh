#!/usr/bin/env bash
# Backend'i reklam videolarının ayrı veritabanıyla (santiye_demo) başlatır: geliştirme verine dokunmaz.
# Önce: docker compose up -d (yalnızca PostgreSQL). Veritabanı yoksa oluşturulur.
set -euo pipefail

repo="$(cd "$(dirname "$0")/../../.." && pwd)"
# Java ortam değişkenlerini sistemin diliyle okur: dil ayarı UTF-8 değilse "Toprak Yapı" "Toprak Yap??" olarak kaydolur.
export LANG=C.UTF-8 LC_ALL=C.UTF-8

if ! docker compose -f "$repo/docker-compose.yml" exec -T postgres \
  psql -U santiye -d santiye -tAc "select 1 from pg_database where datname = 'santiye_demo'" | grep -q 1; then
  docker compose -f "$repo/docker-compose.yml" exec -T postgres psql -U santiye -d santiye -c "create database santiye_demo owner santiye"
fi

cd "$repo/backend"
DB_URL=jdbc:postgresql://localhost:5432/santiye_demo \
MEDIA_ROOT="$repo/marketing/video/demo-data/.media" \
APP_BOOTSTRAP_COMPANY_NAME='Toprak Yapı' \
APP_BOOTSTRAP_OWNER_NAME='Murat Toprak' \
APP_BOOTSTRAP_OWNER_EMAIL='patron@toprakyapi.local' \
APP_BOOTSTRAP_OWNER_PASSWORD='demo1234' \
  exec ./mvnw -B -q spring-boot:run
