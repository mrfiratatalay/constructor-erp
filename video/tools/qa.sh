#!/usr/bin/env bash
# Final videonun denetimi: her 2 sn'den bir kare → kontak baskılar (gözle kontrol) ve OCR (makineyle):
# eski marka ("Constructor"), yerel adres ya da açık kurulum belirteci hiçbir karede olmamalı.
#   tools/qa.sh teslim/iskele-erp-reklam-filmi-120s-1080p.mp4
set -euo pipefail
VIDEO="$1"
QA="$(dirname "$0")/../out/qa"
rm -rf "$QA" && mkdir -p "$QA/frames"
ffmpeg -hide_banner -loglevel error -i "$VIDEO" -vf fps=0.5 -q:v 2 "$QA/frames/%03d.jpg"
ffmpeg -hide_banner -loglevel error -i "$VIDEO" -vf "fps=0.5,scale=384:-1,tile=6x5" -q:v 3 "$QA/sheet-%d.jpg"
found=0
for frame in "$QA"/frames/*.jpg; do
  text=$(tesseract "$frame" - -l tur+eng --psm 11 2>/dev/null | tr '\n' ' ')
  if echo "$text" | grep -qiE "constructor|localhost|kurulum/[A-Za-z0-9_-]{6,}"; then
    echo "BULUNDU $(basename "$frame"): $(echo "$text" | grep -oiE '.{0,30}(constructor|localhost|kurulum/).{0,30}' | head -1)"
    found=1
  fi
done
echo "OCR: $(ls "$QA"/frames | wc -l) kare tarandı, $([ $found = 0 ] && echo 'eski marka / gizli bilgi yok ✓' || echo 'bulgu var ✗')"
