"""Şantiye ambiyansı (0,15 – 13,95 sn): ofisin içinden, camın ardından duyulan sabah şantiyesi.

Uzak makine uğultusu, metal çınlamaları, matkap, geri vites uyarısı, birkaç sabah kuşu. Cam yüksek frekansları
yuttuğu için dış sesler alçak geçirenden geçer. Kaos arttıkça çınlamalar sıklaşır.
"""

import numpy as np

from dsp import SR, bandpass, decay, db, envelope, lowpass, pink, place, reverb, reverb_ir, rng, silence, slow_noise, stereo, timeline, white
from instruments import TWO_PI


def _clank(seed: int) -> np.ndarray:
    """Uzak metal çınlaması: uyumsuz kısmi tonlar, farklı hızlarda sönüm."""
    t = timeline(0.7)
    partials = [(523, 0.45), (1250, 0.3), (2133, 0.22), (3011, 0.15)]
    tone = sum(np.sin(TWO_PI * f * (1 + 0.01 * seed % 3) * t) * decay(len(t), d) for f, d in partials)
    return lowpass(tone, 2600) * envelope(len(t), 0.001, 0.05)


def _drill(seconds: float, seed: int) -> np.ndarray:
    t = timeline(seconds)
    jitter = 1 + 0.03 * slow_noise(seconds, 14, seed)
    buzz = np.sin(TWO_PI * np.cumsum(118 * jitter) / SR)
    grind = bandpass(white(seconds, seed + 1), 900, 3000) * 0.6
    return lowpass(np.sign(buzz) * 0.3 + grind, 2200) * envelope(len(t), 0.05, 0.12)


def _bird(seed: int) -> np.ndarray:
    t = timeline(0.12)
    sweep = 4600 - 1400 * (t / 0.12)
    return np.sin(TWO_PI * np.cumsum(sweep) / SR) * envelope(len(t), 0.01, 0.06) * (0.7 + 0.3 * (seed % 2))


def _beeper(seconds: float) -> np.ndarray:
    t = timeline(seconds)
    gate = (np.floor(t / 0.45) % 2 == 0).astype(float)
    return np.sin(TWO_PI * 1030 * t) * lowpass(gate, 60) * envelope(len(t), 0.2, 0.3)


def _distant(canvas: np.ndarray, seconds: float) -> None:
    """Uzak olaylar: çınlamalar (sona doğru sıklaşır), matkap, geri vites, kuşlar."""
    generator, at = rng(5), 0.8
    while at < seconds - 0.4:
        place(canvas, stereo(_clank(int(at * 10)), generator.uniform(-0.6, 0.6)), at, db(-30) * generator.uniform(0.5, 1))
        at += generator.uniform(0.6, 1.6) * (1 - 0.55 * at / seconds)
    for at, length in ((3.0, 0.9), (8.4, 1.2), (11.9, 0.8)):
        place(canvas, stereo(_drill(length, int(at)), -0.4), at, db(-33))
    place(canvas, stereo(_beeper(3.6), 0.5), 5.0, db(-42))
    for order, at in enumerate((0.5, 0.86, 1.6, 2.35)):
        place(canvas, stereo(_bird(order), 0.6), at, db(-37))


def ambience(seconds: float) -> np.ndarray:
    """Ambiyansın tamamı; başı yavaşça açılır, kaos arttıkça 4 dB yükselir."""
    canvas = silence(seconds)
    room = lowpass(pink(seconds, 1), 500)
    outside = bandpass(pink(seconds, 2), 120, 1500) * (0.8 + 0.2 * slow_noise(seconds, 0.6, 3))
    t = timeline(seconds)
    engine = lowpass(sum(np.sin(TWO_PI * 41 * k * t) / k for k in range(1, 9)), 600) * (0.7 + 0.3 * np.sin(TWO_PI * 0.13 * t))
    canvas += stereo(room * db(-40), 0, 0.6) + stereo(outside * db(-31), 0.1, 0.8) + stereo(engine * db(-37), -0.5)
    _distant(canvas, seconds)
    canvas = reverb(canvas, reverb_ir(1.8, seed=21, brightness=3000), wet=0.25)[: len(canvas)]
    swell = db(4) ** np.clip((t - 9) / 4.3, 0, 1)
    return canvas * (swell * envelope(len(t), 1.0, 0.01, curve=1))[:, None]
