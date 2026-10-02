"""Filmin sesi: seslendirme + müzik + efekt → üç stem ve tek parça mix (public/audio/).

Kurallar (spesifikasyon Madde 13, 14, 33):
  - Seslendirme her zaman önde: her cümle -20 LUFS'e getirilir, müzik konuşma sırasında 6 dB daha kısılır.
  - 13,3'te kaos donar: kaos sesleri boğuklaşır (alçak geçiren) ve kısılır; 13,95'te bıçak gibi kesilir.
  - 13,95 – 15,95 arası seslendirme dışında tam sessizlik; müzik 15,95'te sessizlikten doğar.
  - Son mix -14 LUFS, en fazla -1 dBTP. Stem'ler aynı kazancı alır: toplandıklarında mix'i verirler.
"""

import json

import numpy as np
from scipy.ndimage import maximum_filter1d, uniform_filter1d

import cuesheet
import music
from dsp import SR, db, highpass, lowpass, place, silence, stereo
from loudness import lufs, master, report
from paths import FILM_DIR, FILM_SECONDS, PUBLIC_AUDIO, STEM_DIR, VO_DIR
from wavio import read, write

LENGTH = int(FILM_SECONDS * SR)
VOICE_LUFS = -20.0
MUSIC_LUFS = -26.0


def voice() -> np.ndarray:
    """Cümleleri zamanlarına koyar; her cümle aynı loudness'a getirilir ki ses seviyesi zıplamasın."""
    script = json.loads((FILM_DIR / "voiceover.json").read_text(encoding="utf-8"))
    canvas = silence(FILM_SECONDS + 1)
    for line in script["lines"]:
        path = VO_DIR / f'{line["id"]}.wav'
        if not path.exists():
            continue
        speech = highpass(read(path).astype(np.float64), 70)
        place(canvas, stereo(speech * db(VOICE_LUFS - lufs(speech))), line["at"])
    return canvas


def ducking(voice_track: np.ndarray, depth_db: float = -6.0) -> np.ndarray:
    """Konuşma varken müziği kısan kazanç eğrisi: hızlı iner (30 ms), yavaş kalkar (~0,4 sn)."""
    level = np.max(np.abs(voice_track), axis=1)
    present = (maximum_filter1d(level, size=int(0.25 * SR)) > db(-40)).astype(float)
    smooth = uniform_filter1d(present, size=int(0.4 * SR))
    return 1 - (1 - db(depth_db)) * smooth


def chaos_ending(bus: np.ndarray) -> np.ndarray:
    """Donma: 13,3'ten itibaren kaos boğuklaşır ve 10 dB kısılır; 13,95'te tamamen kesilir."""
    freeze, black = cuesheet.CHAOS["freeze"], cuesheet.CHAOS["black"]
    t = np.arange(len(bus)) / SR
    muffle = np.clip((t - freeze) / 0.15, 0, 1)[:, None]
    out = bus * (1 - muffle) + lowpass(bus, 280) * muffle * db(-10)
    out[int(black * SR):] = 0
    return out


def build() -> dict[str, np.ndarray]:
    """Üç stem: ses, müzik (konuşmada kısılmış), efekt (kaos + donma + marka)."""
    vo = voice()
    airy, dry = music.compose()
    score = np.zeros_like(vo)
    score[: len(airy)] += (airy + dry)[: len(score)]
    score[: int(cuesheet.CHAOS["black"] * SR)] = 0
    score *= db(MUSIC_LUFS - lufs(score[int(15.95 * SR):]))
    score *= ducking(vo)[:, None]
    # Final slogan (115,9 – 120): müzik bir kademe daha çekilir, son cümle tek başına duyulsun (spesifikasyon Madde 33).
    t = np.arange(len(score)) / SR
    score *= (1 - (1 - db(-5)) * np.clip((t - 115.6) / 0.5, 0, 1))[:, None]
    freeze = cuesheet.freeze_sound()
    freeze[int(cuesheet.CHAOS["black"] * SR):] = 0
    effects = chaos_ending(cuesheet.chaos_bus()) + freeze + cuesheet.brand_bus() + cuesheet.ui_bus()
    effects *= ducking(vo, depth_db=-4.0)[:, None]
    return {"vo": vo[:LENGTH], "music": score[:LENGTH], "sfx": effects[:LENGTH]}


def main() -> None:
    stems = build()
    mix, gain = master(stems["vo"] + stems["music"] + stems["sfx"])
    for name, stem in stems.items():
        write(STEM_DIR / f"{name}.wav", stem * gain)
    write(PUBLIC_AUDIO / "mix" / "film.wav", mix)
    report(mix, "film")


if __name__ == "__main__":
    main()
