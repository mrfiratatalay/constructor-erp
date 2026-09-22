#!/usr/bin/env bash
# Servislerin kayıtlarını akıtır. Tek servis için: ./scripts/logs.sh api
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
source scripts/lib.sh

require_docker
docker compose --profile app logs -f --tail=100 "$@"
