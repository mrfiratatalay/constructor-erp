"""Türkçe altyazı (SRT): seslendirme metninden, gerçek konuşma süreleriyle.

Kullanım:
  python srt.py                         → out/final/iskele-erp-reklam-filmi.srt (bütün film)
  python srt.py 0 23 ../out/parts/x.srt → yalnızca o aralık, zamanlar part'ın başından sayılır
Altyazıda TTS okunuşu ("erepe") değil, doğru yazım ("ERP") görünür. Satır en fazla 42 karakter, en fazla 2 satır.
"""

import json
import sys
from pathlib import Path

from paths import FILM_DIR, OUT_DIR

MAX_LINE = 42


def stamp(seconds: float) -> str:
    millis = int(round(seconds * 1000))
    hours, rest = divmod(millis, 3_600_000)
    minutes, rest = divmod(rest, 60_000)
    secs, millis = divmod(rest, 1000)
    return f"{hours:02}:{minutes:02}:{secs:02},{millis:03}"


def wrap(text: str) -> str:
    """İki satıra böler: ortaya en yakın boşluktan (satırlar dengeli dursun)."""
    if len(text) <= MAX_LINE:
        return text
    middle = len(text) // 2
    spaces = [index for index, char in enumerate(text) if char == " "]
    split = min(spaces, key=lambda index: abs(index - middle))
    return f"{text[:split]}\n{text[split + 1:]}"


def cues(start: float, end: float) -> list[tuple[float, float, str]]:
    script = json.loads((FILM_DIR / "voiceover.json").read_text(encoding="utf-8"))
    timing = json.loads((FILM_DIR / "voiceover.timing.json").read_text(encoding="utf-8"))
    rows = []
    for line in script["lines"]:
        begin, finish = line["at"], line["at"] + timing[line["id"]]["duration"]
        if begin >= start and begin < end:
            rows.append((begin - start, min(finish, end) - start + 0.15, line["text"]))
    # Okuma payı (0,15 sn) bir sonraki altyazıya taşmasın: bitiş, sonrakinin başından 40 ms önce kesilir.
    return [(a, min(b, rows[i + 1][0] - 0.04) if i + 1 < len(rows) else b, text) for i, (a, b, text) in enumerate(rows)]


def main() -> None:
    if len(sys.argv) == 4:
        start, end, target = float(sys.argv[1]), float(sys.argv[2]), Path(sys.argv[3])
    else:
        start, end, target = 0.0, 120.0, OUT_DIR / "final" / "iskele-erp-reklam-filmi.srt"
    blocks = [f"{index}\n{stamp(a)} --> {stamp(b)}\n{wrap(text)}\n" for index, (a, b, text) in enumerate(cues(start, end), 1)]
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text("\n".join(blocks), encoding="utf-8")
    print(f"{target.name}: {len(blocks)} altyazı")


if __name__ == "__main__":
    main()
