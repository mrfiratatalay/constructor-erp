"""Efektler, sentezle: şantiye ambiyansı (rüzgâr, uzak metal sesleri, matkap, geri vites uyarısı), telefon titreşimi,
bildirimler, zil, klavye, kâğıt; donma anında boğuklaşma ve 14.85'te kesme. Arayüzde yalnızca önemli anlara düşük
seviyeli vurgu (görev dosyası §14). python3 audio/sfx.py -> out/audio/sfx.wav"""
import numpy as np
import soundfile as sf
from pathlib import Path
from pedalboard import Pedalboard, Reverb
from synth import SR, bandpass, envelope, highpass, lowpass, place

OUT = Path(__file__).resolve().parent.parent / 'out' / 'audio'
RNG = np.random.default_rng(11)
T = lambda seconds: np.arange(int(seconds * SR)) / SR


def tone(freqs, seconds, decay, level=1.0):
    t = T(seconds)
    return (sum(np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs) * np.exp(-t / decay) * level).astype(np.float32)


def delayed(sound, delay, length):
    """Sesi delay saniye geciktirip length uzunluğa tamamlar."""
    out = np.zeros(int(length * SR), dtype=np.float32)
    place(out, sound, delay)
    return out


def ding(pitch=1.0):
    return tone([1318 * pitch, 1975 * pitch], 0.5, 0.12, 0.5) + delayed(tone([1760 * pitch], 0.4, 0.1, 0.35), 0.07, 0.5)


def buzz():
    t = T(0.85)
    gate = ((t % 0.42) < 0.3).astype(float)
    body = np.sign(np.sin(2 * np.pi * 172 * t)) * 0.5 + np.sin(2 * np.pi * 86 * t)
    return (lowpass(body * gate, 900) * 0.5).astype(np.float32)


def ring():
    notes = [76, 81, 79, 84] * 3
    out = np.zeros(int(1.8 * SR), dtype=np.float32)
    for i, midi in enumerate(notes):
        f = 440 * 2 ** ((midi - 69) / 12)
        place(out, tone([f, f * 3.98], 0.3, 0.07, 0.4), i * 0.15)
    return out


def keyboard(seconds):
    out = np.zeros(int(seconds * SR), dtype=np.float32)
    at = 0.0
    while at < seconds - 0.05:
        click = bandpass(RNG.standard_normal(int(0.03 * SR)), 1800, 6000) * np.exp(-T(0.03) / 0.006)
        place(out, click.astype(np.float32), at, 0.25 + RNG.random() * 0.15)
        at += 0.07 + RNG.random() * 0.09
    return out


def paper():
    t = T(0.7)
    noise = bandpass(RNG.standard_normal(len(t)), 900, 7000)
    flutter = np.abs(np.sin(2 * np.pi * (9 + 6 * t) * t)) * envelope(len(t), 0.05, 0.3)
    return (noise * flutter * 0.25).astype(np.float32)


def clank(pitch):
    return tone([pitch, pitch * 2.76, pitch * 5.4, pitch * 8.9], 1.2, 0.25, 0.4)


def ambience(seconds):
    """Rüzgâr + uzak şantiye: metal, matkap, geri vites uyarısı. Uzakta duyulsun diye alçak geçiren ve yankı."""
    n = int(seconds * SR)
    wind = lowpass(highpass(np.cumsum(RNG.standard_normal(n)), 30), 420)
    out = (wind / (np.sqrt((wind ** 2).mean()) + 1e-9) * 0.03).astype(np.float32)
    for at in np.arange(0.8, seconds, 1.35):
        place(out, clank(300 + RNG.random() * 500), at + RNG.random() * 0.6, 0.1 + RNG.random() * 0.1)
    for at in (3.1, 7.3, 10.9):
        t = T(1.0)
        drill = np.sign(np.sin(2 * np.pi * (95 + 8 * np.sin(2 * np.pi * 6 * t)) * t)) * envelope(len(t), 0.05, 0.2)
        place(out, lowpass(drill, 1400).astype(np.float32) * 0.1, at)
    for i in range(4):
        place(out, tone([1040], 0.32, 1.0, 0.05), 5.4 + i * 0.6)
    far = Pedalboard([Reverb(room_size=0.9, wet_level=0.5, dry_level=0.5, damping=0.7)])
    return far(np.stack([out, np.roll(out, 600)]), SR)


def chime(level=0.35):
    """Marka ve önemli onaylar için yumuşak çan (FM): ucuz 'whoosh' değil, kısa ve sıcak."""
    t = T(2.4)
    modulator = np.sin(2 * np.pi * 1.4 * 880 * t) * 2.2 * np.exp(-t / 0.4)
    bell = np.sin(2 * np.pi * 880 * t + modulator) * np.exp(-t / 0.9)
    sub = np.sin(2 * np.pi * 55 * t) * np.exp(-t / 0.5) * 0.8
    return ((bell * 0.6 + sub) * level).astype(np.float32)


def tick(level=0.2):
    return (bandpass(RNG.standard_normal(int(0.08 * SR)), 2500, 7000) * np.exp(-T(0.08) / 0.008) * level
            + tone([2093], 0.08, 0.02, level * 0.6)).astype(np.float32)


def confirm(level=0.22):
    return tone([784], 0.35, 0.12, level) + delayed(tone([1175], 0.35, 0.15, level), 0.09, 0.35)


CHAOS_DINGS = [2.6, 3.2, 5.3, 6.0, 8.4, 9.2, 10.05, 10.55, 10.85] + [11.0 + i * 0.085 for i in range(12)]
CHAOS_BUZZ = [1.8, 2.6, 5.3, 8.4, 10.05, 11.2]
# (zaman, ses, seviye) — film saniyesi. Arayüzde yalnızca önemli geçişler (görev dosyası §14).
UI_CUES = [
    (22.25, 'chime', 0.30), (27.05, 'tick', 0.16), (30.05, 'confirm', 0.18), (31.9, 'confirm', 0.16),
    (38.0, 'chime', 0.18), (47.7, 'tick', 0.14), (52.9, 'tick', 0.12), (54.0, 'tick', 0.12), (55.0, 'tick', 0.12),
    (56.0, 'tick', 0.12), (61.4, 'tick', 0.14), (67.4, 'confirm', 0.16), (79.4, 'confirm', 0.18), (90.4, 'tick', 0.12),
    (92.1, 'confirm', 0.18), (93.4, 'tick', 0.16), (113.95, 'chime', 0.34), (118.5, 'chime', 0.12),
]


def chaos():
    """0-14.85: ambiyans ve bildirim yükü; 12.1'de donma (boğuklaşır, kısılır), 14.85'te tam kesme."""
    n = int(14.85 * SR)
    left = np.zeros(n, dtype=np.float32)
    for at in CHAOS_DINGS:
        place(left, ding(0.9 + RNG.random() * 0.25), at, 0.5 if at < 11 else 0.3)
    for at in CHAOS_BUZZ:
        place(left, buzz(), at, 0.55)
    place(left, ring(), 4.9, 0.5)
    place(left, keyboard(1.0), 3.6, 1.0)
    place(left, paper(), 6.7, 1.0)
    place(left, paper(), 8.35, 0.9)
    bed = ambience(14.85) * np.linspace(0, 1, n).clip(0, 1) ** 0.3
    stereo = bed[:, :n] + np.stack([left, np.roll(left, 240)])
    fade_in = np.minimum(1, np.arange(n) / (1.0 * SR))
    stereo *= fade_in
    freeze = int(12.1 * SR)
    tail = stereo[:, freeze:]
    muffled = np.stack([lowpass(channel, 500) for channel in tail]) * np.linspace(0.9, 0.55, tail.shape[1])
    stereo[:, freeze:] = muffled
    return stereo


def main():
    out = np.zeros((2, int(120.0 * SR)), dtype=np.float32)
    part = chaos()
    out[:, : part.shape[1]] += part
    sounds = {'chime': chime, 'tick': tick, 'confirm': confirm}
    for at, name, level in UI_CUES:
        sound = sounds[name](level)
        for channel in out:
            place(channel, sound, at)
    swell = highpass(RNG.standard_normal(int(2.2 * SR)), 2000) * np.linspace(0, 1, int(2.2 * SR)) ** 2 * 0.02
    for channel in out:
        place(channel, swell.astype(np.float32), 16.9)
    out = Pedalboard([Reverb(room_size=0.35, wet_level=0.12, dry_level=0.95)])(out, SR)
    out[:, int(14.85 * SR):int(16.9 * SR)] = 0.0
    OUT.mkdir(parents=True, exist_ok=True)
    sf.write(OUT / 'sfx.wav', out.T, SR, subtype='PCM_24')
    print('sfx.wav', float(np.abs(out).max()))


if __name__ == '__main__':
    main()
