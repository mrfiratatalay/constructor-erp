"""Loudness: ITU-R BS.1770 ölçümü, hedef seviyeye getirme ve gerçek tepe (true peak) sınırlayıcı.

Hedef (spesifikasyon Madde 6): -14 LUFS entegre, en fazla -1 dBTP. Gerçek tepe, sinyal 4 kat örneklenerek
bulunur: dijital örnekler arasında kalan tepe, AAC'ye çevrilince taşmaya dönüşebilir.
"""

import numpy as np
import pyloudnorm
from scipy import signal
from scipy.ndimage import minimum_filter1d, uniform_filter1d

from dsp import SR, db

TARGET_LUFS = -14.0
# AAC kodlayıcısı tepeyi ~0,1 dB aşırabilir (ilk renderda -0,95 ölçüldü): sınır -1,5'te tutulur, teslimde -1'in altında kalır.
CEILING_DBTP = -1.5


def lufs(sound: np.ndarray) -> float:
    return pyloudnorm.Meter(SR).integrated_loudness(sound)


def true_peak(sound: np.ndarray) -> np.ndarray:
    """Her örnek için 4 kat örneklenmiş sinyaldeki en yüksek mutlak değer (kanalların en büyüğü)."""
    oversampled = signal.resample_poly(sound, 4, 1, axis=0)
    loudest = np.max(np.abs(oversampled), axis=1)
    return loudest[: len(sound) * 4].reshape(-1, 4).max(axis=1)


def limit(sound: np.ndarray, ceiling_db: float = CEILING_DBTP, window: float = 0.006) -> np.ndarray:
    """İleriye bakan sınırlayıcı: tepeden önce kazancı yumuşakça indirir, sonra yavaşça bırakır.
    En-küçük filtre + hareketli ortalama: ortalama penceresi en-küçük penceresinin yarısı olduğu için tepe anında
    kazanç gereken değerin üstüne çıkamaz."""
    needed = np.minimum(1.0, db(ceiling_db) / (true_peak(sound) + 1e-12))
    span = max(3, int(window * SR))
    held = minimum_filter1d(needed, size=2 * span + 1)
    smooth = uniform_filter1d(held, size=span + 1)
    return sound * np.minimum(smooth, needed)[:, None]


def master(sound: np.ndarray, target: float = TARGET_LUFS) -> tuple[np.ndarray, float]:
    """Sesi hedef loudness'a getirir ve sınırlar; sınırlayıcının yuttuğu seviye ikinci geçişte geri eklenir.
    Döner: işlenmiş ses ve uygulanan toplam kazanç (stem'lere aynı kazancı vermek için)."""
    gain = db(target - lufs(sound))
    mastered = limit(sound * gain)
    correction = db(target - lufs(mastered))
    mastered = limit(sound * gain * correction)
    return mastered, gain * correction


def report(sound: np.ndarray, label: str) -> None:
    peak = 20 * np.log10(np.max(true_peak(sound)) + 1e-12)
    print(f"{label}: {lufs(sound):6.2f} LUFS, tepe {peak:5.2f} dBTP, {len(sound) / SR:6.2f} sn")
