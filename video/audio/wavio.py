"""WAV okuma-yazma ve FFmpeg ile çözme. Hat içinde ses her zaman float32, -1..1 aralığında, 48 kHz dolaşır."""

import subprocess
from pathlib import Path

import numpy as np
from scipy.io import wavfile

from paths import FFMPEG, SAMPLE_RATE


def decode(source: Path, target: Path, channels: int = 1) -> None:
    """Herhangi bir ses dosyasını 48 kHz PCM WAV'a çevirir (TTS mp3 olarak gelir)."""
    target.parent.mkdir(parents=True, exist_ok=True)
    command = [str(FFMPEG), "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
               "-ar", str(SAMPLE_RATE), "-ac", str(channels), "-c:a", "pcm_s24le", str(target)]
    subprocess.run(command, check=True)


def read(path: Path) -> np.ndarray:
    """WAV'ı float32 olarak okur; tek kanallıysa (n,), çok kanallıysa (n, kanal) döner."""
    rate, samples = wavfile.read(path)
    if rate != SAMPLE_RATE:
        raise ValueError(f"{path.name}: {rate} Hz, beklenen {SAMPLE_RATE} Hz")
    if samples.dtype == np.float32:
        return samples
    scale = float(np.iinfo(samples.dtype).max) + 1.0
    return (samples.astype(np.float64) / scale).astype(np.float32)


def write(path: Path, samples: np.ndarray) -> None:
    """Ara dosyalar 32 bit float yazılır: kırpılmaz, sınırlama yalnızca son mix'te yapılır."""
    path.parent.mkdir(parents=True, exist_ok=True)
    wavfile.write(path, SAMPLE_RATE, samples.astype(np.float32))


def speech_bounds(samples: np.ndarray, threshold_db: float = -45.0, pad_seconds: float = 0.02) -> tuple[int, int]:
    """Konuşmanın başladığı ve bittiği örnek: baştaki ve sondaki sessizlik atılsın, cümle tam 'at' anında başlasın."""
    level = 10 ** (threshold_db / 20)
    loud = np.flatnonzero(np.abs(samples) > level)
    if loud.size == 0:
        return 0, len(samples)
    pad = int(pad_seconds * SAMPLE_RATE)
    return max(loud[0] - pad, 0), min(loud[-1] + pad * 4, len(samples))
