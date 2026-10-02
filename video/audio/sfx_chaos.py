"""Kaos bölümünün ses efektleri: telefon, bildirimler, klavye, kâğıt, kalem, nabız, donma.

Her fonksiyon stereo bir ses döner; nereye ve hangi seviyede konacağına mix.py çizelgeye (chaos.json) bakarak
karar verir. Bildirim sesleri bilerek birbirinden farklıdır: her biri başka bir uygulamadan gelir.
"""

import numpy as np

from dsp import SR, bandpass, decay, envelope, highpass, lowpass, rng, stereo, timeline, white
from instruments import TWO_PI, hz

PHONE_PAN = 0.35


def _motor(seconds: float, seed: int) -> np.ndarray:
    t = timeline(seconds)
    hum = sum(np.sin(TWO_PI * 158 * k * t) / k for k in (1, 3, 5, 7))
    rattle = bandpass(white(seconds, seed), 260, 1800) * (0.6 + 0.4 * np.sin(TWO_PI * 158 * t))
    return lowpass(hum * 0.55 + rattle * 0.9, 3200)


def vibrate(seconds: float, seed: int = 0) -> np.ndarray:
    """Masadaki telefonun titreşimi: 0,45 sn'lik vızıltılar, aralarında kısa sessizlik."""
    out = np.zeros(int(seconds * SR))
    pulse, gap, at = 0.45, 0.28, 0.0
    while at < seconds - 0.05:
        length = min(pulse, seconds - at)
        burst = _motor(length, seed + int(at * 10)) * envelope(int(length * SR), 0.012, 0.03)
        out[int(at * SR): int(at * SR) + len(burst)] += burst
        at += pulse + gap
    return stereo(out, PHONE_PAN)


def _tone(freq: float, seconds: float, ring: float) -> np.ndarray:
    t = timeline(seconds)
    return (np.sin(TWO_PI * freq * t) + 0.12 * np.sin(TWO_PI * freq * 3 * t)) * decay(len(t), ring) * envelope(len(t), 0.004, 0.02)


def ping(variant: int) -> np.ndarray:
    """Dört farklı uygulamanın bildirimi: ikili çan, tahta tok, hızlı üçlü, baloncuk."""
    if variant == 0:
        sound = np.concatenate([_tone(1318.5, 0.08, 0.3)[: int(0.08 * SR)], _tone(1975.5, 0.45, 0.4)])
    elif variant == 1:
        t = timeline(0.3)
        sound = (np.sin(TWO_PI * 784 * t) + 0.3 * np.sin(TWO_PI * 784 * 4 * t) * np.exp(-t * 40)) * decay(len(t), 0.25)
    elif variant == 2:
        sound = np.zeros(int(0.5 * SR))
        for order, freq in enumerate((1046.5, 1318.5, 1568.0)):
            note = _tone(freq, 0.35, 0.3)
            sound[int(order * 0.05 * SR): int(order * 0.05 * SR) + len(note)] += note * 0.7
    else:
        t = timeline(0.18)
        sound = np.sin(TWO_PI * np.cumsum(500 + 600 * np.minimum(t / 0.06, 1)) / SR) * decay(len(t), 0.14)
    return stereo(sound * envelope(len(sound), 0.002, 0.02), PHONE_PAN * 0.6)


def sms() -> np.ndarray:
    """Düz SMS sesi: kısa, ikili, telefon hoparlöründen."""
    beep = _tone(1200, 0.07, 1.0) * envelope(int(0.07 * SR), 0.003, 0.01)
    sound = np.concatenate([beep, np.zeros(int(0.07 * SR)), beep])
    return stereo(bandpass(sound, 600, 5000), PHONE_PAN)


def ring(seconds: float) -> np.ndarray:
    """Genel bir zil melodisi (marimba): Mi–Sol#–Si–Sol#, tekrar tekrar; telefon hoparlörü rengiyle."""
    out = np.zeros(int(seconds * SR))
    motif, at = [76, 80, 83, 80], 0.0
    while at < seconds:
        for step, note in enumerate(motif):
            t = timeline(0.3)
            tone = (np.sin(TWO_PI * hz(note) * t) + 0.25 * np.sin(TWO_PI * hz(note) * 4 * t) * np.exp(-t * 30)) * decay(len(t), 0.3)
            start = int((at + step * 0.12) * SR)
            if start < len(out):
                out[start: start + len(tone)] += tone[: len(out) - start]
        at += 1.0
    return stereo(bandpass(out, 500, 6000) * envelope(len(out), 0.005, 0.08), PHONE_PAN)


def keys(seconds: float, seed: int = 0) -> np.ndarray:
    """Klavye: düzensiz aralıklı tıkırtılar, her tuşta küçük bir gövde sesi."""
    out = np.zeros(int(seconds * SR) + SR // 10)
    generator, at = rng(seed), 0.0
    while at < seconds:
        click = bandpass(white(0.02, seed + int(at * 100)), 1800, 6000) * decay(int(0.02 * SR), 0.012)
        t = timeline(0.03)
        thock = np.sin(TWO_PI * generator.uniform(140, 190) * t) * decay(len(t), 0.025) * 0.5
        start = int(at * SR)
        out[start: start + len(click)] += click * generator.uniform(0.6, 1.0)
        out[start: start + len(thock)] += thock
        at += generator.uniform(0.06, 0.15)
    return stereo(out, -0.15)


def paper(seconds: float, seed: int = 0) -> np.ndarray:
    """Kâğıt hışırtısı: çok sayıda kısa gürültü tanesi, yükselip alçalan bir hareketle."""
    out = np.zeros(int(seconds * SR) + SR // 10)
    generator, at = rng(seed), 0.0
    while at < seconds:
        grain_length = generator.uniform(0.02, 0.06)
        grain = bandpass(white(grain_length, seed + int(at * 1000)), 800, 7000) * envelope(int(grain_length * SR), 0.004, 0.01)
        shape = np.sin(np.pi * at / seconds) ** 0.7
        start = int(at * SR)
        out[start: start + len(grain)] += grain * generator.uniform(0.3, 1.0) * shape
        at += generator.uniform(0.008, 0.025)
    return stereo(out, -0.2)


def scribble(seconds: float, seed: int = 0) -> np.ndarray:
    """Kalemle tik atmak: iki kısa çizgi, kâğıdın pürüzü genliği titretir."""
    out = np.zeros(int(seconds * SR))
    for start, end in ((0.0, 0.12), (0.14, min(0.34, seconds))):
        length = int((end - start) * SR)
        texture = np.abs(lowpass(white(end - start, seed + int(start * 100)), 90)) * 3 + 0.3
        stroke = bandpass(white(end - start, seed + 5), 2500, 9000) * texture * envelope(length, 0.01, 0.03)
        out[int(start * SR): int(start * SR) + length] += stroke
    return stereo(out, 0.1)


def pulse(seconds: float) -> np.ndarray:
    """Kaos yükselirken alttan gelen nabız: hızlanan, güçlenen 'lub-dub' ve arkasında yükselen gerilim."""
    out = np.zeros(int(seconds * SR))
    at = 0.0
    while at < seconds:
        grow = at / seconds
        for offset, strength in ((0.0, 1.0), (0.17, 0.65)):
            t = timeline(0.3)
            thump = np.sin(TWO_PI * np.cumsum(52 + 30 * np.exp(-t * 25)) / SR) * decay(len(t), 0.28)
            start = int((at + offset) * SR)
            if start < len(out):
                out[start: start + len(thump)] += (thump * strength * (0.25 + 0.75 * grow))[: len(out) - start]
        at += 0.86 - 0.4 * grow
    rising = np.linspace(0, 1, len(out)) ** 2
    tension = bandpass(white(seconds, 77), 300, 1600) * rising * 0.08
    return stereo(out + tension)


def freeze(seconds: float) -> np.ndarray:
    """Donma anı: kısa, derin bir çöküş ve havada asılı kalan ince bir ton. 13,95'te kesilir."""
    t = timeline(seconds)
    whump = np.sin(TWO_PI * np.cumsum(38 + 52 * np.exp(-t * 9)) / SR) * decay(len(t), 0.6)
    hang = (np.sin(TWO_PI * hz(57) * t) * 0.5 + highpass(white(seconds, 31), 4000) * 0.04) * np.minimum(t / 0.25, 1)
    return stereo(whump * 0.9 + lowpass(hang, 2400) * 0.35, width=0.5) * envelope(len(t), 0.003, 0.004)[:, None]
