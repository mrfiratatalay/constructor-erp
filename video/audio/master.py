"""Miks ve mastering: seslendirme önde ve ortada; müzik konuşmanın ~13 dB altında, konuşma varken ayrıca kısılır
(yan zincir), final marka cümlesinde biraz daha; efektler kısa ve kontrollü. Sonuç -14 LUFS, en çok -1 dBTP.
python3 audio/master.py -> out/audio/{voiceover,music-mix,sfx-mix,master}.wav ve iskele-erp-reklam-filmi.srt"""
import json
import subprocess
import numpy as np
import pyloudnorm
import soundfile as sf
from pathlib import Path
from pedalboard import Pedalboard, Reverb
from scipy.ndimage import maximum_filter1d, uniform_filter1d

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / 'out' / 'audio'
SR = 48000
LENGTH = int(120.0 * SR)
MUSIC_UNDER_VOICE_DB = -13.0
DUCK_DB = -4.0
SFX_DB = -9.0


def db(value):
    return 10 ** (value / 20)


def voice_track(script):
    track = np.zeros(LENGTH, dtype=np.float32)
    for line in script:
        audio, _ = sf.read(AUDIO / 'vo' / f"{line['id']}.wav", dtype='float32')
        start = int(line['at'] * SR)
        end = min(LENGTH, start + len(audio))
        track[start:end] += audio[: end - start]
    room = Pedalboard([Reverb(room_size=0.18, damping=0.6, wet_level=0.05, dry_level=1.0, width=0.3)])
    return room(np.stack([track, track]), SR)


def ducking(voice):
    """Konuşma varken 1'den DUCK_DB'ye inen, yumuşak açılıp kapanan kazanç; 113.9 sn sonrası 2 dB daha."""
    level = uniform_filter1d(np.abs(voice[0]), int(0.05 * SR))
    active = (level > db(-45)).astype(np.float32)
    active = maximum_filter1d(active, int(0.35 * SR))
    smooth = uniform_filter1d(active, int(0.25 * SR))
    gain = 1 - (1 - db(DUCK_DB)) * smooth
    gain[int(113.9 * SR):] *= db(-2)
    return gain


def srt(script, durations):
    def stamp(seconds):
        ms = int(round(seconds * 1000))
        return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}'

    blocks = []
    for i, line in enumerate(script, 1):
        text = line['text']
        if len(text) > 42:
            words, half = text.split(), len(text) / 2
            cut, size = 0, 0
            while size < half:
                size += len(words[cut]) + 1
                cut += 1
            text = ' '.join(words[:cut]) + '\n' + ' '.join(words[cut:])
        following = script[i]['at'] - 0.05 if i < len(script) else 120.0
        end = min(line['at'] + durations[line['id']] + 0.25, following)
        blocks.append(f"{i}\n{stamp(line['at'])} --> {stamp(end)}\n{text}\n")
    (ROOT / 'out' / 'iskele-erp-reklam-filmi.srt').write_text('\n'.join(blocks), encoding='utf-8')


def true_peak_limit(mix_path, out_path):
    """4x örneklemede sınırlama: örnekler arası tepeler de -1 dBTP'nin altında kalır."""
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(mix_path), '-af',
                    'aresample=192000,alimiter=limit=0.85:attack=3:release=60:level=false,aresample=48000',
                    '-c:a', 'pcm_s24le', str(out_path)], check=True)


def main():
    script = json.loads((AUDIO / 'vo' / 'script.json').read_text())
    durations = json.loads((AUDIO / 'vo' / 'durations.json').read_text())
    voice = voice_track(script)
    music = sf.read(AUDIO / 'music.wav', dtype='float32')[0].T[:, :LENGTH]
    sfx = sf.read(AUDIO / 'sfx.wav', dtype='float32')[0].T[:, :LENGTH]
    speech_rms = np.sqrt(np.mean(voice[0][np.abs(voice[0]) > db(-45)] ** 2))
    music_rms = np.sqrt(np.mean(music[:, int(39 * SR):int(94 * SR)] ** 2))
    music_gain = speech_rms * db(MUSIC_UNDER_VOICE_DB) / music_rms
    music = music * music_gain * ducking(voice)[None, :]
    sfx = sfx * db(SFX_DB)
    mix = voice + music + sfx
    meter = pyloudnorm.Meter(SR)
    loudness = meter.integrated_loudness(mix.T)
    gain = db(-14.0 - loudness)
    for name, stem in (('voiceover', voice), ('music-mix', music), ('sfx-mix', sfx)):
        sf.write(AUDIO / f'{name}.wav', (stem * gain).T, SR, subtype='PCM_24')
    sf.write(AUDIO / 'premaster.wav', (mix * gain).T, SR, subtype='FLOAT')
    true_peak_limit(AUDIO / 'premaster.wav', AUDIO / 'master.wav')
    srt(script, durations)
    print(f'müzik kazancı {20 * np.log10(music_gain):.1f} dB, ön ses yüksekliği {loudness:.1f} LUFS')


if __name__ == '__main__':
    main()
