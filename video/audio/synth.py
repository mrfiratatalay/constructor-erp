"""Enstrümanlar, sıfırdan sentez (numpy): keçe piyano, sıcak pad, koparma (Karplus-Strong), bas, yumuşak davul.
Her fonksiyon mono float32 dizisi döner (48 kHz). Aranjman audio/music.py'dedir."""
import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
RNG = np.random.default_rng(2026)


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def lowpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, 'low', fs=SR, output='sos'), x)


def highpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, 'high', fs=SR, output='sos'), x)


def bandpass(x, low, high, order=2):
    return sosfilt(butter(order, [low, high], 'band', fs=SR, output='sos'), x)


def envelope(n, attack, release, sustain_level=1.0):
    t = np.arange(n) / SR
    env = np.minimum(1.0, t / max(attack, 1e-4)) * sustain_level
    tail = int(release * SR)
    if tail and tail < n:
        env[-tail:] *= np.linspace(1, 0, tail) ** 2
    return env


def piano(midi, seconds=3.5, velocity=0.8):
    """Keçe piyano: hafif gergin (inharmonik) kısmi sesler, üstler hızlı söner, yumuşak çekiç tıkı."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    f0 = hz(midi)
    out = np.zeros(n)
    for k in range(1, 9):
        f = f0 * k * np.sqrt(1 + 0.00035 * k * k)
        if f > 9000:
            break
        decay = 1.6 / (1 + 0.55 * k) * (1.4 if midi < 60 else 1.0)
        out += (0.65 ** (k - 1)) * np.sin(2 * np.pi * f * t + RNG.random()) * np.exp(-t / decay)
    hammer = lowpass(RNG.standard_normal(n) * np.exp(-t / 0.006), 2500) * 0.15
    out = lowpass(out + hammer, 2200 + 2500 * velocity)
    return (out * velocity * envelope(n, 0.004, 0.4)).astype(np.float32)


def pad(midis, seconds, brightness=1400.0):
    """Sıcak pad: her nota için üç hafif akort dışı testere, alçak geçiren filtre, yavaş giriş ve çıkış."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for midi in midis:
        for detune in (-0.07, 0.0, 0.065):
            f = hz(midi + detune)
            phase = RNG.random()
            out += 2 * ((f * t + phase) % 1.0) - 1
    out = lowpass(out / (3 * len(midis)), brightness, order=4)
    wobble = 1 + 0.06 * np.sin(2 * np.pi * 0.17 * t)
    return (out * wobble * envelope(n, min(1.2, seconds / 3), min(1.6, seconds / 3))).astype(np.float32)


def pluck(midi, seconds=1.4, brightness=0.5):
    """Karplus-Strong: tel gibi doğal, sıcak bir koparma."""
    n = int(seconds * SR)
    period = int(SR / hz(midi))
    buffer = lowpass(RNG.uniform(-1, 1, period), 1500 + 5000 * brightness)
    out = np.zeros(n)
    for i in range(n):
        value = buffer[i % period]
        out[i] = value
        buffer[i % period] = 0.497 * (value + buffer[(i + 1) % period])
    return (lowpass(out, 4200) * envelope(n, 0.002, 0.3)).astype(np.float32)


def bass(midi, seconds):
    n = int(seconds * SR)
    t = np.arange(n) / SR
    f = hz(midi)
    out = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t) + 0.08 * np.sin(6 * np.pi * f * t)
    out = np.tanh(out * 1.3) / 1.3
    return (out * envelope(n, 0.01, min(0.25, seconds / 2))).astype(np.float32)


def kick(level=1.0):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    freq = 46 + 80 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t / 0.16)
    click = lowpass(RNG.standard_normal(n) * np.exp(-t / 0.002), 3000) * 0.2
    return ((body + click) * level).astype(np.float32)


def hat(level=0.25, open_=False):
    n = int((0.22 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    noise = highpass(RNG.standard_normal(n), 7000, order=4)
    return (noise * np.exp(-t / (0.07 if open_ else 0.018)) * level).astype(np.float32)


def rim(level=0.25):
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    tone = np.sin(2 * np.pi * 1650 * t) * np.exp(-t / 0.012)
    noise = bandpass(RNG.standard_normal(n), 1200, 4000) * np.exp(-t / 0.02) * 0.5
    return ((tone + noise) * level).astype(np.float32)


def pulse(seconds, rate=1.666, root=38):
    """Düşük frekanslı nabız (kaos): kalp atışı gibi alçak bir vuruş, yavaş yükselen yoğunluk."""
    n = int(seconds * SR)
    t = np.arange(n) / SR
    beat = np.exp(-((t * rate) % 1.0) / 0.12)
    tone = np.sin(2 * np.pi * hz(root) * t) + 0.3 * np.sin(2 * np.pi * hz(root + 12) * t)
    return (tone * beat * np.linspace(0.25, 1.0, n) ** 1.6).astype(np.float32)


def place(track, clip, at, gain=1.0):
    start = int(at * SR)
    if start >= len(track):
        return
    end = min(len(track), start + len(clip))
    track[start:end] += clip[: end - start] * gain
