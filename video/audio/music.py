"""Filmin müziği, filme kilitli: 0-12 sn alçak nabız, 14.85'te kesilir (kontrollü sessizlik), 17'de ton yatağı,
iki marka cümlesinin arasında ilk temiz piyano notası, 24.6'da ritim hafifçe açılır, 38.7'de akış, 94'te yükselir,
106.6'da davullar çekilir, 113.95'te tonikte çözülür ve kuyruk bırakır. 100 BPM, Re majör.
python3 audio/music.py -> out/audio/music.wav (stereo, 48 kHz)"""
import numpy as np
import soundfile as sf
from pathlib import Path
from pedalboard import Chorus, Compressor, Limiter, Pedalboard, Reverb
from synth import SR, bass, hat, kick, lowpass, pad, piano, place, pluck, pulse, rim

OUT = Path(__file__).resolve().parent.parent / 'out' / 'audio'
LENGTH = 121.0
BEAT = 0.6
BAR = 4 * BEAT
LOOP_START = 24.6
# Gmaj9 - D/F# - Em7 - A7sus4 (bas, pad sesleri, arpej sesleri)
CHORDS = [
    (43, [55, 59, 62, 66, 69], [67, 71, 74, 78]),
    (42, [57, 62, 66, 69], [66, 69, 74, 78]),
    (40, [55, 59, 62, 64], [64, 67, 71, 74]),
    (45, [57, 62, 64, 67], [64, 69, 72, 76]),
]
RESOLVE = (38, [50, 54, 57, 62, 64, 69], [62, 66, 69, 74])


def track():
    return np.zeros(int(LENGTH * SR), dtype=np.float32)


def intro(stems):
    place(stems['pulse'], pulse(12.05, rate=1.0 / BEAT), 0.6, 0.55)
    place(stems['pulse'], pulse(2.8, rate=2.0 / BEAT, root=38) * np.linspace(1, 1.6, int(2.8 * SR)), 12.05, 0.6)
    drone = pad([38, 45], 14.25, brightness=380) * np.linspace(0, 1, int(14.25 * SR)) ** 1.5
    place(stems['pad'], drone, 0.6, 0.5)


def brand(stems):
    place(stems['pad'], pad(CHORDS[0][1], 5.4, brightness=900), 17.0, 0.55)
    place(stems['piano'], piano(74, 4.0, 0.55), 19.35, 0.9)
    place(stems['piano'], piano(69, 3.0, 0.35), 19.6, 0.7)
    place(stems['pad'], pad(RESOLVE[1], 3.2, brightness=1300), 22.1, 0.6)
    for note, delay in ((62, 0.0), (66, 0.06), (69, 0.12), (74, 0.2)):
        place(stems['piano'], piano(note, 3.5, 0.6), 22.25 + delay, 0.7)
    place(stems['bass'], bass(38, 2.4), 22.25, 0.5)


def bar_parts(stems, start, chord, energy):
    root, voicing, arp = chord
    place(stems['pad'], pad(voicing, BAR + 0.4, brightness=900 + 600 * energy), start, 0.42)
    place(stems['bass'], bass(root, BAR * (0.5 if energy > 0.5 else 1.0)), start, 0.55)
    if energy > 0.5:
        place(stems['bass'], bass(root, BAR / 2), start + BAR / 2, 0.5)
    steps = 8 if energy < 0.75 else 16
    for i in range(steps):
        note = arp[(i * (3 if steps == 16 else 1)) % len(arp)] + (12 if energy > 0.9 and i % 4 == 3 else 0)
        level = 0.24 + 0.08 * (i % 4 == 0)
        place(stems['pluck'], pluck(note, 1.0, 0.35 + 0.3 * energy), start + i * BAR / steps, level)


def drums(stems, start, energy):
    for beat in range(4):
        at = start + beat * BEAT
        if beat in (0, 2) or (energy > 0.5 and beat == 3):
            place(stems['drums'], kick(0.75 if beat != 3 else 0.45), at, 0.8)
        if energy > 0.45 and beat in (1, 3):
            place(stems['drums'], rim(0.3), at, 0.7)
        for half in (0, 0.5):
            place(stems['drums'], hat(0.2 if half else 0.12), at + half * BEAT, 0.7)
        if energy > 0.85:
            place(stems['drums'], hat(0.1), at + 0.25 * BEAT, 0.6)


def energy_at(t):
    if t < 38.7:
        return 0.35
    if t < 94.0:
        return 0.6
    return 0.95


def groove(stems):
    start = LOOP_START
    index = 0
    while start + BAR <= 106.6 + 0.01:
        chord = CHORDS[index % len(CHORDS)]
        energy = energy_at(start)
        bar_parts(stems, start, chord, energy)
        if not (62.9 < start < 65.3):
            drums(stems, start, energy)
        start += BAR
        index += 1
    return start, index


def ending(stems, start, index):
    """Davullar çekilir; ilerleyiş yavaşça sürer, 113.95'te Re'de çözülür, 116.4'ten sonra uzun kuyruk."""
    while start < 112.4:
        chord = CHORDS[index % len(CHORDS)]
        place(stems['pad'], pad(chord[1], BAR + 0.6, brightness=1100), start, 0.45)
        place(stems['bass'], bass(chord[0], BAR), start, 0.4)
        for i, note in enumerate(chord[2]):
            place(stems['piano'], piano(note, 2.4, 0.4), start + i * BEAT, 0.55)
        start += BAR
        index += 1
    place(stems['pad'], pad(CHORDS[3][1], 113.95 - start + 0.5, brightness=1200), start, 0.45)
    root, voicing, arp = RESOLVE
    place(stems['pad'], pad(voicing, 7.0, brightness=1500), 113.95, 0.6)
    place(stems['bass'], bass(root, 5.5), 113.95, 0.6)
    for i, note in enumerate(arp + [78]):
        place(stems['piano'], piano(note, 5.0, 0.5), 113.95 + i * 0.09, 0.6)
    place(stems['piano'], piano(74, 5.0, 0.45), 118.6, 0.7)


def master(stems):
    rng = np.random.default_rng(7)
    room = Pedalboard([Reverb(room_size=0.62, damping=0.45, wet_level=0.28, dry_level=0.8, width=1.0)])
    wide = Pedalboard([Chorus(rate_hz=0.4, depth=0.18, mix=0.35), Reverb(room_size=0.8, wet_level=0.35, dry_level=0.75)])
    mix = np.zeros((2, len(stems['pad'])), dtype=np.float32)
    for name, gain, board in (('pad', 0.5, wide), ('piano', 0.55, room), ('pluck', 0.55, room),
                              ('bass', 0.6, None), ('drums', 0.5, None), ('pulse', 0.6, None)):
        stereo = np.stack([stems[name], np.roll(stems[name], int(0.004 * SR) if name in ('pad', 'pluck') else 0)])
        mix += (board(stereo, SR) if board else stereo) * gain
    mix += lowpass(rng.standard_normal(mix.shape[1]), 1200)[None, :].astype(np.float32) * 0.0006
    mix *= automation(mix.shape[1])[None, :] * 0.5
    mix[:, int(14.85 * SR):int(17.0 * SR)] = 0.0
    bus = Pedalboard([Compressor(threshold_db=-20, ratio=1.6, attack_ms=30, release_ms=300), Limiter(threshold_db=-2)])
    out = bus(mix, SR)
    return out * (10 ** (-1 / 20) / max(1e-6, float(np.abs(out).max())))


def automation(n):
    """Bölüm kazancı: enerji eğrisi kompresörden önce verilir (yoksa her yer aynı yükseklikte kalır)."""
    points = [(0, 1.0), (24.6, 0.55), (38.2, 0.6), (39.2, 0.85), (93.5, 0.85), (94.5, 1.0), (106.2, 1.0), (107.4, 0.62),
              (113.6, 0.7), (114.2, 0.95), (121, 0.95)]
    times, gains = zip(*points)
    return np.interp(np.arange(n) / SR, times, gains).astype(np.float32)


def main():
    stems = {name: track() for name in ('pad', 'piano', 'pluck', 'bass', 'drums', 'pulse')}
    intro(stems)
    brand(stems)
    start, index = groove(stems)
    ending(stems, start, index)
    mix = master(stems)
    OUT.mkdir(parents=True, exist_ok=True)
    sf.write(OUT / 'music.wav', mix.T[: int(120.0 * SR)], SR, subtype='PCM_24')
    print('music.wav', mix.shape, float(np.abs(mix).max()))


if __name__ == '__main__':
    main()
