#!/usr/bin/env bash
# Her şeyi siler: kaplar, veritabanı ve yüklenmiş bütün fotoğraf, video, sesler. Geri dönüşü yoktur.
# Sıfırdan temiz bir kurulum denemek için kullanılır.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
source scripts/lib.sh

require_docker

read -r -p "Veritabanı ve bütün medya dosyaları silinecek. Emin misin? (evet/hayır) " answer
if [ "$answer" != "evet" ]; then
  echo "Vazgeçildi, hiçbir şey silinmedi."
  exit 0
fi

docker compose --profile app down -v
echo "Silindi. Sıfırdan kurmak için ./scripts/start.sh"
