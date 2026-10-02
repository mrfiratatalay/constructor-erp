"""Çizelgeden sese: src/film/cues/*.json'daki her efekt kaydını sentezleyip zamanına koyar.

Görüntü de aynı dosyaları okur: telefonun titrediği kare ile titreşim sesi aynı saniyededir.
"""

import json

import numpy as np

import ambience
import sfx_brand
import sfx_chaos
import sfx_ui
from dsp import db, place, silence
from paths import FILM_DIR, FILM_SECONDS

CHAOS = json.loads((FILM_DIR / "cues" / "chaos.json").read_text(encoding="utf-8"))
BRAND = json.loads((FILM_DIR / "cues" / "brand.json").read_text(encoding="utf-8"))
UI = json.loads((FILM_DIR / "cues" / "ui.json").read_text(encoding="utf-8"))

# Her ses türü: üretici ve seviye (dB). Seviyeler seslendirme -20 LUFS'e göre ayarlıdır: ses her zaman önde.
CHAOS_SOUNDS = {
    "ambience": (lambda cue: ambience.ambience(cue["dur"]), -1),
    "vibrate": (lambda cue: sfx_chaos.vibrate(cue["dur"], int(cue["t"] * 10)), -17),
    "ping": (lambda cue: sfx_chaos.ping(cue["variant"]), -16),
    "sms": (lambda cue: sfx_chaos.sms(), -15),
    "ring": (lambda cue: sfx_chaos.ring(cue["dur"]), -20),
    "keys": (lambda cue: sfx_chaos.keys(cue["dur"], int(cue["t"] * 10)), -15),
    "paper": (lambda cue: sfx_chaos.paper(cue["dur"], int(cue["t"] * 10)), -13),
    "scribble": (lambda cue: sfx_chaos.scribble(cue["dur"]), -12),
    "pulse": (lambda cue: sfx_chaos.pulse(cue["dur"]), -11),
}

BRAND_SOUNDS = {
    "line": (lambda cue: sfx_brand.line(), -24),
    "snap": (lambda cue: sfx_brand.snap(), -17),
    "rise": (lambda cue: sfx_brand.rise(cue["dur"]), -22),
    "shimmer": (lambda cue: sfx_brand.shimmer(), -13),
    "glide": (lambda cue: sfx_brand.glide(cue["dur"]), -26),
    "settle": (lambda cue: sfx_brand.settle(), -22),
}


# Ürün part'larının (2–7) arayüz sesleri: seyrek ve çok alçak; final logo ışıltısı ise bilinçli olarak belirgin.
UI_SOUNDS = {
    "click": (lambda cue: sfx_ui.click(), -31),
    "tab": (lambda cue: sfx_ui.tab(), -29),
    "tap": (lambda cue: sfx_ui.tap(), -29),
    "mark": (lambda cue: sfx_ui.mark(), -27),
    "keys": (lambda cue: sfx_chaos.keys(cue["dur"], int(cue["t"] * 10)), -31),
    "success": (lambda cue: sfx_ui.success(), -24),
    "confirm": (lambda cue: sfx_ui.confirm(), -26),
    "complete": (lambda cue: sfx_ui.complete(), -23),
    "grow": (lambda cue: sfx_ui.grow(cue["dur"]), -28),
    "whoosh": (lambda cue: sfx_brand.glide(cue["dur"]), -28),
    "settle": (lambda cue: sfx_brand.settle(), -26),
    "rise": (lambda cue: sfx_brand.rise(cue["dur"]), -24),
    "final": (lambda cue: sfx_brand.shimmer(), -14),
}


def _render(canvas: np.ndarray, cues: list[dict], sounds: dict) -> None:
    for cue in cues:
        if cue["kind"] not in sounds:
            continue
        make, level = sounds[cue["kind"]]
        place(canvas, make(cue), cue["t"], db(level))


def chaos_bus() -> np.ndarray:
    """Kaosun bütün sesleri (donma hariç): ambiyans, telefon, bildirimler, klavye, kâğıt, nabız, uçan kartlar."""
    canvas = silence(FILM_SECONDS + 1)
    _render(canvas, CHAOS["sfx"], CHAOS_SOUNDS)
    for index, at in enumerate(CHAOS["overloadCards"]):
        place(canvas, sfx_chaos.ping(index % 4), at, db(-23 + index * 0.25))
        place(canvas, sfx_brand.glide(0.32), at - 0.06, db(-30))
    return canvas


def freeze_sound() -> np.ndarray:
    canvas = silence(FILM_SECONDS + 1)
    cue = next(cue for cue in CHAOS["sfx"] if cue["kind"] == "freeze")
    place(canvas, sfx_chaos.freeze(cue["dur"]), cue["t"], db(-12))
    return canvas


def ui_bus() -> np.ndarray:
    canvas = silence(FILM_SECONDS + 1)
    _render(canvas, UI["sfx"], UI_SOUNDS)
    return canvas


def brand_bus() -> np.ndarray:
    canvas = silence(FILM_SECONDS + 1)
    _render(canvas, BRAND["sfx"], BRAND_SOUNDS)
    return canvas
