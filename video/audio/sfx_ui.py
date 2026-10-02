"""Arayüz sesleri (part 2–7): yalnızca önemli anlarda, çok düşük seviyede (spesifikasyon Madde 14).

Tık sesleri kısa ve yumuşak; başarı, onay ve tamamlanma sesleri birkaç notalık sıcak çanlar; geçişler hafif hava.
"""

import numpy as np

from dsp import bandpass, decay, envelope, reverb, reverb_ir, stereo, timeline, white
from instruments import TWO_PI, hz


def _bell(midi: float, seconds: float = 0.9, ring: float = 0.7) -> np.ndarray:
    t = timeline(seconds)
    tone = np.sin(TWO_PI * hz(midi) * t) + 0.18 * np.sin(TWO_PI * hz(midi) * 2.76 * t) * np.exp(-t * 9)
    return tone * decay(len(t), ring) * envelope(len(t), 0.004, 0.05, curve=1)


def _notes(notes: list[tuple[float, float]], seconds: float = 1.2) -> np.ndarray:
    out = np.zeros(int(seconds * 48_000))
    for at, midi in notes:
        bell = _bell(midi)
        start = int(at * 48_000)
        out[start: start + len(bell)] += bell[: len(out) - start]
    return out


def click() -> np.ndarray:
    """Yumuşak tık: kısa tiz gürültü ve küçük bir gövde."""
    t = timeline(0.06)
    tick = bandpass(white(0.06, 3), 2200, 6500) * decay(len(t), 0.012)
    body = np.sin(TWO_PI * 320 * t) * decay(len(t), 0.02) * 0.4
    return stereo(tick + body, 0.05)


def tab() -> np.ndarray:
    t = timeline(0.12)
    blip = np.sin(TWO_PI * np.cumsum(900 + 300 * (t / 0.12)) / 48_000) * decay(len(t), 0.08) * envelope(len(t), 0.003, 0.02)
    return stereo(blip * 0.6)


def tap() -> np.ndarray:
    """Telefon dokunuşu: boğuk, kısa."""
    t = timeline(0.08)
    return stereo(np.sin(TWO_PI * 180 * t) * decay(len(t), 0.04) + bandpass(white(0.08, 5), 1500, 4000) * decay(len(t), 0.01) * 0.3)


def mark() -> np.ndarray:
    """Durum işareti: dokunuş ve tek, kısa, sıcak nota."""
    note = _bell(81, 0.4, 0.25) * 0.5
    touch = tap()[:, 0]
    out = np.zeros(max(len(note), len(touch)))
    out[: len(touch)] += touch
    out[: len(note)] += note
    return stereo(out, 0.1)


def success() -> np.ndarray:
    return reverb(stereo(_notes([(0.0, 79), (0.09, 86)])), reverb_ir(1.4, 41), wet=0.3)


def confirm() -> np.ndarray:
    return reverb(stereo(_notes([(0.0, 81)], 0.9) * 0.8), reverb_ir(1.2, 43), wet=0.25)


def complete() -> np.ndarray:
    """Görev tamamlandı: yükselen üç nota, hafif ışıltı."""
    return reverb(stereo(_notes([(0.0, 76), (0.08, 83), (0.16, 88)], 1.4)), reverb_ir(1.6, 47), wet=0.32)


def grow(seconds: float) -> np.ndarray:
    """İlerleme çubuğu uzarken: yumuşak, yükselen bir ton."""
    t = timeline(seconds)
    glide = np.sin(TWO_PI * np.cumsum(440 + 220 * (t / seconds)) / 48_000)
    return stereo(glide * envelope(len(t), seconds * 0.4, seconds * 0.5) * 0.5, 0, 0.4)
