"""Ses hattının ortak yolları ve sabitleri: bütün betikler aynı klasörlere yazar, aynı örnekleme hızını kullanır."""

from pathlib import Path

VIDEO_ROOT = Path(__file__).resolve().parent.parent
FILM_DIR = VIDEO_ROOT / "src" / "film"
PUBLIC_AUDIO = VIDEO_ROOT / "public" / "audio"
VO_DIR = PUBLIC_AUDIO / "vo"
STEM_DIR = PUBLIC_AUDIO / "stems"
CACHE_DIR = VIDEO_ROOT / ".cache"
OUT_DIR = VIDEO_ROOT / "out"

# Remotion kendi FFmpeg derlemesini getirir: loudnorm, AAC ve H.264 içinde; ayrıca kurmaya gerek yok.
FFMPEG = VIDEO_ROOT / "node_modules" / "@remotion" / "compositor-win32-x64-msvc" / "ffmpeg.exe"

SAMPLE_RATE = 48_000
FILM_SECONDS = 120.0
