#!/usr/bin/env bash
# Sistemi durdurur. Veriler (veritabanı ve medya) yerinde kalır; ./scripts/start.sh ile kaldığı yerden devam eder.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
source scripts/lib.sh

require_docker
docker compose --profile app down
echo "Durdu. Veriler duruyor; silmek için ./scripts/reset.sh"
