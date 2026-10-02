"""Filmin müziği: 80 BPM, Re majör, ölçü 3 saniye. Bütün zamanlar filmin mutlak saniyesidir.

Yapı (spesifikasyon Madde 13):
  15,95  sessizlikten doğan ton yatağı (açık beşli)
  18,05  ilk temiz nota: kartlar iskeleye oturur (Sol majör üstünde Re)
  21,05  logo: ev tonuna varış (Re majör), alt bas kabarır
  24,05  yumuşak arpejler ve alt bas
  39,05  ritim açılır: davul, shaker, hareketli bas
  105,05 davullar çekilir, armonik çözülme (Re → Sol → La)
  114,05 "İskele ERP": son akor (Re), kuyruk 120'de biter
"""

import numpy as np

from dsp import SR, db, envelope, place, reverb, reverb_ir, silence
from instruments import epiano, kick, pad, pluck, rim, shaker, spread, sub

BED, DOWNBEAT, BAR = 15.95, 18.05, 3.0
BEAT = BAR / 4
RHYTHM, RESOLVE, FINAL, END = 39.05, 105.05, 114.05, 120.0

CHORDS = {
    "D": [50, 57, 66, 73, 76],
    "Bm": [47, 54, 62, 69, 74],
    "G": [43, 50, 59, 66, 69],
    "A": [45, 52, 59, 64, 69],
}
ROOTS = {"D": 38, "Bm": 35, "G": 31, "A": 33}
ARP = [1, 3, 2, 4, 3, 2, 4, 3]


def bar_start(index: int) -> float:
    return DOWNBEAT + index * BAR


# Kapanış kadansı: davullar çekildikten sonra Re → Sol → La → Re ("İskele ERP" eve dönüşe denk gelir).
ENDING = {29: "D", 30: "G", 31: "A", 32: "D"}


def chord_of(index: int) -> str:
    """0. ölçü Sol (beklenti), 1. ölçü logo ile Re (varış); sonra Re–Si minör–Sol–La döngüsü; sonda kadans."""
    if index in ENDING:
        return ENDING[index]
    return "G" if index == 0 else ["D", "Bm", "G", "A"][(index - 1) % 4]


BARS = int((FINAL - DOWNBEAT) / BAR) + 1


def pads(canvas: np.ndarray) -> None:
    place(canvas, pad([50, 57], 3.2, seed=7) * envelope(int(3.2 * SR), 1.6, 1.0)[:, None], BED, db(-21))
    for index in range(BARS):
        length = BAR + 1.8 if index < BARS - 1 else END - FINAL
        place(canvas, pad(CHORDS[chord_of(index)], length, seed=index * 9), bar_start(index) - 0.05, db(-19))


def keys(canvas: np.ndarray) -> None:
    """Elektrik piyano: ilk temiz nota, logo akoru ve finaldeki çözülme akorları (hafif arpejli vuruş)."""
    for at, note, gain in [(18.05, 74, -7), (19.55, 69, -15), (20.3, 71, -14)]:
        place(canvas, spread(epiano(note), 0.1, seed=note), at, db(gain))
    ending = [(RESOLVE + BAR * step, chord_of(29 + step), -16) for step in range(3)]
    for at, name, gain in [(21.05, "D", -14), *ending, (FINAL, "D", -17)]:
        for order, note in enumerate(CHORDS[name][1:]):
            pan = -0.3 + order * 0.2
            place(canvas, spread(epiano(note, 3.2, 0.8), pan, seed=order), at + order * 0.014, db(gain))


def arpeggio(canvas: np.ndarray) -> None:
    """Sekizlik arpej: ürün bölümleri boyunca akan, sakin bir hareket. Ritim açılınca biraz parlaklaşır."""
    for index in range(2, int((RESOLVE - DOWNBEAT) / BAR)):
        start, chord = bar_start(index), CHORDS[chord_of(index)]
        lively = start >= RHYTHM
        for step, voice in enumerate(ARP):
            note = chord[voice] + (12 if lively and step % 4 == 3 else 0)
            gain = db(-23 if not lively else -19) * (1.0 if step % 2 == 0 else 0.78)
            tone = pluck(note, 1.0, 1.3 if lively else 0.9)
            place(canvas, spread(tone, -0.35 + step * 0.1, seed=step), start + step * BEAT / 2, gain)


def bass(canvas: np.ndarray) -> None:
    """Alt bas: önce ölçü başına tek uzun nota, ritim açılınca 1 – 2,5 – 3. vuruşlarda senkoplu."""
    for index in range(2, int((RESOLVE - DOWNBEAT) / BAR)):
        start, root = bar_start(index), ROOTS[chord_of(index)]
        hits = [(0, BAR)] if start < RHYTHM else [(0, 1.3), (1.5, 0.5), (2.0, 0.9)]
        for beat, length in hits:
            place(canvas, spread(sub(root, length), 0, 0), start + beat * BEAT, db(-15))
    place(canvas, spread(sub(ROOTS["D"], 3.0), 0, 0), 21.05, db(-15))
    place(canvas, spread(sub(ROOTS["D"], END - FINAL), 0, 0), FINAL, db(-18))


def drums(canvas: np.ndarray) -> None:
    """Rahat, akan bir ritim: tekme 1 ve 3'te (tek ölçülerde 3,5'te de), rim 2 ve 4'te."""
    for index in range(int((RHYTHM - DOWNBEAT) / BAR), int((RESOLVE - DOWNBEAT) / BAR)):
        start = bar_start(index)
        for beat in [0, 2] + ([2.5] if index % 2 else []):
            place(canvas, spread(kick(index), 0, 0), start + beat * BEAT, db(-13))
        for beat in (1, 3):
            place(canvas, spread(rim(index + beat), 0.15, beat), start + beat * BEAT, db(-21))
    shakers(canvas)


def shakers(canvas: np.ndarray) -> None:
    """Shaker: 30. saniyeden sekizlik, ritim açılınca onaltılık; tek vuruşlar hafif geride (sallantı)."""
    for index in range(4, int((RESOLVE - DOWNBEAT) / BAR)):
        start = bar_start(index)
        division = BEAT / 4 if start >= RHYTHM else BEAT / 2
        for tick in range(int(BAR / division)):
            swing = division * 0.12 if tick % 2 else 0.0
            gain = db(-29 if start >= RHYTHM else -31) * (1.0 if tick % 2 == 0 else 0.6)
            place(canvas, spread(shaker(tick), 0.3, tick), start + tick * division + swing, gain)


def compose() -> tuple[np.ndarray, np.ndarray]:
    """Müziği iki parçada döner: kuru (davul, bas) ve yankılı (pad, piyano, arpej) katmanlar karışmış hâliyle."""
    length = END + 0.5
    airy, dry = silence(length), silence(length)
    pads(airy)
    keys(airy)
    arpeggio(airy)
    bass(dry)
    drums(dry)
    spacious = reverb(airy, reverb_ir(3.2, seed=11), wet=0.38)[: len(airy)]
    return spacious, dry
