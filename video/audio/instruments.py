"""Müziğin enstrümanları, hepsi sentezle: pad, elektrik piyano/çan, pluck, alt bas, davul.

Karakter hedefi (spesifikasyon Madde 13): modern B2B, sıcak, güven veren; fütüristik değil. Bu yüzden sert
dalga biçimleri yerine yumuşatılmış harmonikler, yavaş girişler ve doğal sönümler kullanılır.
"""

import numpy as np

from dsp import SR, bandpass, decay, envelope, highpass, rng, saturate, stereo, timeline, white

TWO_PI = 2 * np.pi


def hz(midi: float) -> float:
    """MIDI nota numarasını frekansa çevirir (69 = La4 = 440 Hz)."""
    return 440.0 * 2 ** ((midi - 69) / 12)


def additive(freq: float, seconds: float, ceiling: float = 2400.0, seed: int = 0) -> np.ndarray:
    """Yumuşatılmış testere dalga: harmonikler yükseldikçe hızla zayıflar (doğal bir alçak geçiren gibi)."""
    t = timeline(seconds)
    phases = rng(seed).uniform(0, TWO_PI, 64)
    out = np.zeros_like(t)
    for k in range(1, min(64, max(1, int(ceiling / freq))) + 1):
        out += np.sin(TWO_PI * k * freq * t + phases[k - 1]) / k**1.25 * np.exp(-k * freq / ceiling)
    return out


def pad(notes: list[float], seconds: float, seed: int = 0) -> np.ndarray:
    """Akor pad'i: her nota iki hafif akortsuz ses (sol/sağ), yavaş giriş, uzun bırakış."""
    length = int(seconds * SR)
    left, right = np.zeros(length), np.zeros(length)
    for index, midi in enumerate(notes):
        left += additive(hz(midi) * 2 ** (-6 / 1200), seconds, seed=seed + index)
        right += additive(hz(midi) * 2 ** (6 / 1200), seconds, seed=seed + index + 50)
    shape = envelope(length, attack=0.9, release=1.6)
    return np.stack([left, right], axis=1) * shape[:, None] / (len(notes) ** 0.5)


def epiano(midi: float, seconds: float = 3.2, brightness: float = 1.0) -> np.ndarray:
    """FM elektrik piyano: çarpma anında parlak, hemen yumuşayan bir ton; filmin "temiz notası"."""
    t = timeline(seconds)
    f = hz(midi)
    index = brightness * 2.0 * np.exp(-t * 3.2)
    tone = np.sin(TWO_PI * f * t + index * np.sin(TWO_PI * f * t))
    tine = 0.18 * brightness * np.sin(TWO_PI * f * 4.0 * t) * np.exp(-t * 14)
    body = (tone + tine) * decay(len(t), 2.9) * envelope(len(t), 0.003, 0.08, curve=1)
    return body


def pluck(midi: float, seconds: float = 1.1, brightness: float = 1.0) -> np.ndarray:
    """Telli çalgı gibi sönen nota: üst harmonikler alt harmoniklerden hızlı söner."""
    t = timeline(seconds)
    f = hz(midi)
    out = np.zeros_like(t)
    for k in range(1, min(24, int(6000 / f)) + 1):
        out += np.sin(TWO_PI * k * f * t) / k * np.exp(-t * (2.6 + 2.2 * k / brightness))
    return out * envelope(len(t), 0.002, 0.06, curve=1)


def sub(midi: float, seconds: float) -> np.ndarray:
    """Alt bas: sinüs + yumuşak doyum (küçük hoparlörde de duyulsun diye üst harmonik)."""
    t = timeline(seconds)
    tone = np.sin(TWO_PI * hz(midi) * t)
    return saturate(tone * 0.9, 1.8) * envelope(len(t), 0.03, 0.25)


def kick(seed: int = 0) -> np.ndarray:
    """Yumuşak tekme davul: düşen perde, kısa tık. Sert değil, "nabız" gibi."""
    t = timeline(0.5)
    freq = 46 + 70 * np.exp(-t * 30)
    body = np.sin(TWO_PI * np.cumsum(freq) / SR) * np.exp(-t * 7.5)
    click = highpass(white(0.5, seed), 3000) * np.exp(-t * 400) * 0.25
    return body + click


def rim(seed: int = 0) -> np.ndarray:
    """Hafif rim/el çırpma: dar bant gürültü + kısa gövde tonu."""
    t = timeline(0.3)
    noise = bandpass(white(0.3, seed), 1300, 4200) * np.exp(-t * 26)
    body = np.sin(TWO_PI * 215 * t) * np.exp(-t * 45) * 0.5
    return (noise * 1.6 + body) * envelope(len(t), 0.001, 0.02, curve=1)


def shaker(seed: int = 0, length: float = 0.09) -> np.ndarray:
    """Shaker/hi-hat: tiz gürültü, yumuşak çıkış."""
    t = timeline(length)
    noise = highpass(white(length, seed), 6500)
    return noise * envelope(len(t), 0.008, length * 0.8) * 0.6


def spread(mono: np.ndarray, pan: float, seed: int) -> np.ndarray:
    """Enstrümanı stereo alana yerleştirir (hafif genişlikle)."""
    return stereo(mono, pan=pan, width=0.4, seed=seed)
