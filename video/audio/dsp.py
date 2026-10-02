"""Ses sentezinin temel araçları: zaman ekseni, zarflar, gürültü, filtreler, stereo, yankı.

Bütün sesler float32/float64 numpy dizileridir; stereo sinyal (n, 2) biçimindedir. Rastgelelik tohumludur:
her çalıştırma birebir aynı sesi üretir (film gibi ses de yeniden üretilebilir olmalı).
"""

import numpy as np
from scipy import signal

from paths import SAMPLE_RATE as SR


def timeline(seconds: float) -> np.ndarray:
    """0'dan başlayan zaman ekseni (saniye)."""
    return np.arange(int(seconds * SR)) / SR


def silence(seconds: float, channels: int = 2) -> np.ndarray:
    return np.zeros((int(seconds * SR), channels))


def db(value: float) -> float:
    """Desibeli doğrusal kazanca çevirir."""
    return 10 ** (value / 20)


def rng(seed: int) -> np.random.Generator:
    return np.random.default_rng(seed)


def white(seconds: float, seed: int) -> np.ndarray:
    return rng(seed).standard_normal(int(seconds * SR))


def pink(seconds: float, seed: int) -> np.ndarray:
    """Pembe gürültü (1/f): rüzgâr, uzak uğultu, oda sesi için doğal bir taban."""
    spectrum = np.fft.rfft(white(seconds, seed))
    freqs = np.fft.rfftfreq(int(seconds * SR), 1 / SR)
    spectrum[1:] /= np.sqrt(freqs[1:])
    spectrum[0] = 0
    noise = np.fft.irfft(spectrum, int(seconds * SR))
    return noise / (np.max(np.abs(noise)) + 1e-9)


def envelope(length: int, attack: float, release: float, curve: float = 2.0) -> np.ndarray:
    """Yumuşak giriş ve çıkış: sesin başı ve sonu tıklamasın."""
    env = np.ones(length)
    a = min(int(attack * SR), length)
    r = min(int(release * SR), length - a)
    if a > 0:
        env[:a] = np.linspace(0, 1, a) ** curve
    if r > 0:
        env[length - r:] *= np.linspace(1, 0, r) ** curve
    return env


def decay(length: int, seconds: float) -> np.ndarray:
    """Üstel sönüm: vuruşlu seslerin (çan, tıkırtı, darbe) doğal kuyruğu. seconds = -60 dB'e iniş süresi."""
    return np.exp(-6.9 * np.arange(length) / (seconds * SR))


def _filter(sound: np.ndarray, kind: str, cutoff, order: int = 4) -> np.ndarray:
    sos = signal.butter(order, cutoff, btype=kind, fs=SR, output="sos")
    return signal.sosfilt(sos, sound, axis=0)


def lowpass(sound: np.ndarray, cutoff: float, order: int = 4) -> np.ndarray:
    return _filter(sound, "lowpass", cutoff, order)


def highpass(sound: np.ndarray, cutoff: float, order: int = 4) -> np.ndarray:
    return _filter(sound, "highpass", cutoff, order)


def bandpass(sound: np.ndarray, low: float, high: float, order: int = 2) -> np.ndarray:
    return _filter(sound, "bandpass", [low, high], order)


def stereo(mono: np.ndarray, pan: float = 0.0, width: float = 0.0, seed: int = 0) -> np.ndarray:
    """Eşit güçte sağ-sol konumlama; width > 0 ise sağ ve sol arasına küçük bir gecikme farkı konur (genişlik)."""
    angle = (pan + 1) * np.pi / 4
    left, right = mono * np.cos(angle), mono * np.sin(angle)
    if width > 0:
        shift = int(width * 0.012 * SR) + int(rng(seed).integers(0, 40))
        right = np.concatenate([np.zeros(shift), right[:-shift]]) if shift else right
    return np.stack([left, right], axis=1)


def place(canvas: np.ndarray, sound: np.ndarray, at: float, gain: float = 1.0) -> None:
    """Sesi tuvalde 'at' saniyesine ekler (tuvalin dışına taşan kısım kesilir)."""
    start = int(at * SR)
    if start >= len(canvas):
        return
    end = min(start + len(sound), len(canvas))
    piece = sound[: end - start] * gain
    canvas[start:end] += piece if piece.ndim == canvas.ndim else piece[:, None]


def reverb_ir(seconds: float, seed: int, brightness: float = 6000.0) -> np.ndarray:
    """Sentetik yankı tepkisi: sönen stereo gürültü, kuyruk ilerledikçe kararır (gerçek odalar gibi)."""
    length = int(seconds * SR)
    tail = np.stack([white(seconds, seed), white(seconds, seed + 1)], axis=1) * decay(length, seconds)[:, None]
    early, late = lowpass(tail, brightness), lowpass(tail, brightness / 4)
    mix = np.linspace(0, 1, length)[:, None]
    ir = early * (1 - mix) + late * mix
    return ir / np.sqrt(np.sum(ir**2, axis=0) + 1e-9)


def reverb(sound: np.ndarray, ir: np.ndarray, wet: float, predelay: float = 0.02) -> np.ndarray:
    """Kuru sesle yankılı sesi karıştırır; çıktı yankı kuyruğu kadar uzar."""
    dry = sound if sound.ndim == 2 else stereo(sound)
    pad = np.zeros((int(predelay * SR), 2))
    wet_left = signal.fftconvolve(np.concatenate([pad[:, 0], dry[:, 0]]), ir[:, 0])
    wet_right = signal.fftconvolve(np.concatenate([pad[:, 1], dry[:, 1]]), ir[:, 1])
    tail = np.stack([wet_left, wet_right], axis=1)
    out = np.zeros_like(tail)
    out[: len(dry)] += dry * (1 - wet * 0.5)
    return out + tail * wet


def saturate(sound: np.ndarray, drive: float) -> np.ndarray:
    """Yumuşak doyum: alt frekansa üst harmonik ekler, küçük hoparlörde de duyulur."""
    return np.tanh(sound * drive) / np.tanh(drive)


def slow_noise(seconds: float, rate: float, seed: int) -> np.ndarray:
    """Yavaş, pürüzsüz rastgele dalgalanma (-1..1): saniyede 'rate' kadar nokta, aralar yumuşak eğriyle dolar.
    Çok düşük kesimli filtre yerine kullanılır: 48 kHz'de 1 Hz altı filtreler sayısal olarak kararsızlaşır."""
    points = rng(seed).uniform(-1, 1, int(seconds * rate) + 3)
    position = timeline(seconds) * rate
    whole = np.floor(position).astype(int)
    fraction = position - whole
    smooth = fraction * fraction * (3 - 2 * fraction)
    return points[whole] * (1 - smooth) + points[whole + 1] * smooth
