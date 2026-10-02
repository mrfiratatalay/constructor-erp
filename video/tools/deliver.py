"""Teslim: Remotion görüntüsü + master ses → iki MP4 (master: yüksek bit hızı; 1080p: yayın), stem'ler ve SRT.
Sonra denetim: süre 119-121 sn, 1920x1080, 30 kare/sn, H.264 + AAC 48 kHz, -14 LUFS, -1 dBTP.
python3 tools/deliver.py -> teslim/"""
import json
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'out'
DELIVER = ROOT / 'teslim'
NAME = 'iskele-erp-reklam-filmi'


def ffmpeg(*args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *args], check=True)


def probe(path):
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_name,width,height,r_frame_rate,sample_rate',
                             '-of', 'json', str(path)], capture_output=True, text=True, check=True)
    return json.loads(result.stdout)


def loudness(path):
    result = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                            capture_output=True, text=True)
    summary = result.stderr.split('Summary:')[-1]
    integrated = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summary).group(1))
    peak = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summary).group(1))
    return integrated, peak


def main():
    DELIVER.mkdir(exist_ok=True)
    video, audio = OUT / 'film-video.mp4', OUT / 'audio' / 'master.wav'
    master = DELIVER / f'{NAME}-120s-master.mp4'
    ffmpeg('-i', str(video), '-i', str(audio), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k',
           '-ar', '48000', '-t', '120', '-movflags', '+faststart', str(master))
    release = DELIVER / f'{NAME}-120s-1080p.mp4'
    ffmpeg('-i', str(video), '-i', str(audio), '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
           '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-t', '120',
           '-movflags', '+faststart', str(release))
    for stem, target in (('voiceover', 'voiceover'), ('music-mix', 'music'), ('sfx-mix', 'sfx')):
        shutil.copy(OUT / 'audio' / f'{stem}.wav', DELIVER / f'{NAME}-{target}.wav')
    shutil.copy(OUT / f'{NAME}.srt', DELIVER / f'{NAME}.srt')
    for path in (release, master):
        info = probe(path)
        integrated, peak = loudness(path)
        duration = float(info['format']['duration'])
        streams = {s['codec_name']: s for s in info['streams']}
        ok = 119 <= duration <= 121 and streams['h264']['width'] == 1920 and streams['h264']['height'] == 1080
        print(f"{path.name}: {duration:.2f} sn, {streams['h264']['width']}x{streams['h264']['height']} @ {streams['h264']['r_frame_rate']}, "
              f"aac {streams['aac']['sample_rate']} Hz, {integrated} LUFS, tepe {peak} dBFS, {path.stat().st_size / 1e6:.1f} MB {'✓' if ok else '✗'}")


if __name__ == '__main__':
    main()
