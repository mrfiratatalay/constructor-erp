"""Marka bölümünün ses efektleri: ilk çizgi, kartların oturuşu, logoya yükseliş, logo ışıltısı, kayış, yerleşme.

Spesifikasyon Madde 14: efektler düşük seviyeli ve premium; ucuz "whoosh paketi" hissi yok. Bu yüzden hepsi
yumuşak filtreli gürültü ve sinüslerden, kısa ve ölçülü.
"""

import numpy as np

from dsp import SR, bandpass, decay, envelope, highpass, lowpass, reverb, reverb_ir, stereo, timeline, white
from instruments import TWO_PI


def _sweep(seconds: float, low: float, high: float, seed: int) -> np.ndarray:
    """Merkez frekansı low'dan high'a kayan gürültü: hava hareketi."""
    noise = white(seconds, seed)
    pieces, steps = [], 24
    size = len(noise) // steps
    for step in range(steps):
        center = low * (high / low) ** (step / (steps - 1))
        pieces.append(bandpass(noise[step * size:(step + 1) * size], center * 0.7, min(center * 1.4, 20000)))
    return np.concatenate(pieces)


def line() -> np.ndarray:
    """İlk dikmenin çizilişi: yukarı doğru ince bir hava ve çok hafif bir cam tınısı."""
    air = _sweep(0.5, 400, 2600, 3) * np.sin(np.linspace(0, np.pi, int(0.5 * SR))) ** 2
    t = timeline(0.9)
    ting = np.sin(TWO_PI * 2350 * t) * decay(len(t), 0.8) * 0.25
    return stereo(np.concatenate([air * 0.7, np.zeros(int(0.4 * SR))]) + ting, 0, 0.5)


def snap() -> np.ndarray:
    """Kartların iskeleye oturuşu: yumuşak bir gövde vuruşu ve on iki minik tık (her kart bir tık)."""
    t = timeline(0.6)
    body = np.sin(TWO_PI * np.cumsum(95 + 40 * np.exp(-t * 30)) / SR) * decay(len(t), 0.2)
    ticks = np.zeros(len(t))
    for index in range(12):
        click = bandpass(white(0.008, index), 2000, 6000) * decay(int(0.008 * SR), 0.006)
        start = int(index * 0.025 * SR)
        ticks[start:start + len(click)] += click * 0.35
    return stereo(body * 0.8 + ticks, 0, 0.4)


def rise(seconds: float) -> np.ndarray:
    """Logoya giden yükseliş: açılan filtre, üstel kabarma; tam logo anında biter."""
    swell = _sweep(seconds, 250, 6000, 9) * np.linspace(0, 1, int(seconds * SR)) ** 3
    return stereo(swell * envelope(len(swell), 0.05, 0.015), 0, 0.8)


def shimmer() -> np.ndarray:
    """Logo: derin, yumuşak bir alt darbe ve havada kalan parlak bir ışıltı."""
    t = timeline(2.4)
    sub = np.sin(TWO_PI * 52 * t) * decay(len(t), 1.6) * envelope(len(t), 0.004, 0.3)
    sparkle = sum(np.sin(TWO_PI * f * t) * (1 + 0.3 * np.sin(TWO_PI * 5.5 * t + f)) for f in (2637, 3951, 5274))
    sparkle = sparkle * decay(len(t), 1.8) * envelope(len(t), 0.02, 0.3) * 0.12
    soft_hit = lowpass(white(2.4, 4), 900) * decay(len(t), 0.25) * 0.3
    wide = stereo(sparkle, 0, 0.9) + stereo(sub + soft_hit)
    return reverb(wide, reverb_ir(2.6, seed=13), wet=0.35)


def glide(seconds: float) -> np.ndarray:
    """Logonun header'a kayışı: alçak, kısa bir hava geçişi."""
    air = _sweep(seconds, 500, 1800, 17) * np.sin(np.linspace(0, np.pi, int(seconds * SR))) ** 2
    return stereo(lowpass(air, 5000), -0.3, 0.6)


def settle() -> np.ndarray:
    """Arayüzün yerine oturması: çok hafif bir tok ses ve ince bir tık."""
    t = timeline(0.4)
    thump = np.sin(TWO_PI * np.cumsum(70 + 30 * np.exp(-t * 40)) / SR) * decay(len(t), 0.16)
    click = highpass(white(0.4, 8), 3000) * decay(len(t), 0.01) * 0.2
    return stereo(thump + click)
