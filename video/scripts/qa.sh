#!/usr/bin/env bash
# Final kalite kontrolü: süreler, akışlar, bağımsız loudness ölçümü ve filmden kareler (kontak baskı).
# Kullanım: bash scripts/qa.sh
set -euo pipefail
cd "$(dirname "$0")/.."
BIN=node_modules/@remotion/compositor-win32-x64-msvc
FILM=out/final/iskele-erp-reklam-filmi-120s-1080p.mp4

echo "== Akışlar ve süre"
"$BIN/ffprobe.exe" -v error -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate,channels:format=duration,size -of compact "$FILM"
echo "== Part'lar"
for part in out/parts/*.mp4; do
  printf '%s  ' "$(basename "$part")"
  "$BIN/ffprobe.exe" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$part"
done
echo "== Loudness (FFmpeg, bağımsız)"
"$BIN/ffmpeg.exe" -hide_banner -nostats -i "$FILM" -vn -af loudnorm=I=-14:TP=-1:print_format=json -f null - 2>&1 \
  | grep -E '"input_(i|tp|lra)"'
echo "== Kareler"
mkdir -p out/qa
for t in 3 8 12.5 17 21.5 26 29.5 33 40 43.4 46 52 56.5 60.5 65 68 71 78 83.8 90.5 94.5 99 104.8 109 113.5 117 119.2; do
  "$BIN/ffmpeg.exe" -hide_banner -loglevel error -y -ss "$t" -i "$FILM" -frames:v 1 -q:v 3 "out/qa/f-$t.jpg"
done
.venv/Scripts/python scripts/contact_sheet.py out/qa/sheet.png 3 640 $(ls out/qa/f-*.jpg | sort -t- -k2 -g)
echo "Kontak baskı: out/qa/sheet.png"
