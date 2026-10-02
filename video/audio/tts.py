"""Seslendirme: voiceover.json'daki her cümleyi Türkçe nöral sesle üretir, sessizliği kırpar, süreleri yazar.

Çıktılar:
  public/audio/vo/<id>.wav          kırpılmış cümle (48 kHz, mono)
  src/film/voiceover.timing.json    her cümlenin süresi ve kelime zamanları (görüntü senkronu, altyazı)

Aynı metin, ses ve hız için TTS bir kez çağrılır; sonuç .cache/tts altında saklanır.
"""

import asyncio
import hashlib
import json
from pathlib import Path

import edge_tts

from paths import CACHE_DIR, FILM_DIR, SAMPLE_RATE, VO_DIR
from wavio import decode, read, speech_bounds, write

SCRIPT = FILM_DIR / "voiceover.json"
TIMING = FILM_DIR / "voiceover.timing.json"
TTS_CACHE = CACHE_DIR / "tts"


def spoken_text(line: dict) -> str:
    """TTS'e giden metin: okunuşu farklı olan kelimeler için 'say' (ör. ERP → 'erepe'), yoksa altyazı metni."""
    return line.get("say", line["text"])


def speech_rate(config: dict, line: dict) -> str:
    """Varsayılan hız; kaos bölümü gibi aciliyet isteyen cümleler kendi hızını taşıyabilir."""
    return line.get("rate", config["rate"])


def cache_key(config: dict, line: dict) -> str:
    key = f'{config["voice"]}|{speech_rate(config, line)}|{config["pitch"]}|{spoken_text(line)}'
    return f'{line["id"]}-{hashlib.sha1(key.encode()).hexdigest()[:10]}'


async def synthesize(config: dict, line: dict, mp3: Path) -> list[dict]:
    """Cümleyi üretir; ses mp3'e, kelime sınırları (saniye) listeye."""
    communicate = edge_tts.Communicate(spoken_text(line), config["voice"], rate=speech_rate(config, line),
                                       pitch=config["pitch"], boundary="WordBoundary")
    audio, words = bytearray(), []
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio.extend(chunk["data"])
        elif chunk["type"] == "WordBoundary":
            words.append({"t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7, "text": chunk["text"]})
    mp3.write_bytes(bytes(audio))
    return words


async def cached_line(config: dict, line: dict) -> tuple[Path, list[dict]]:
    """Önbellekte varsa onu, yoksa yeni üretimi döner."""
    TTS_CACHE.mkdir(parents=True, exist_ok=True)
    key = cache_key(config, line)
    mp3, meta = TTS_CACHE / f"{key}.mp3", TTS_CACHE / f"{key}.json"
    if mp3.exists() and meta.exists():
        return mp3, json.loads(meta.read_text(encoding="utf-8"))
    words = await synthesize(config, line, mp3)
    meta.write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
    return mp3, words


def finish_line(line: dict, mp3: Path, words: list[dict]) -> dict:
    """mp3'ü çözer, sessizliği kırpar, kelime zamanlarını kırpılmış başlangıca göre kaydırır."""
    raw = TTS_CACHE / f'{line["id"]}.raw.wav'
    decode(mp3, raw)
    samples = read(raw)
    start, end = speech_bounds(samples)
    write(VO_DIR / f'{line["id"]}.wav', samples[start:end])
    # Servis ilk kelimeyi baştaki sessizlikle birlikte sayar (hep 0,104 sn); diğer kelimeler sesle birebir tutar.
    # Bu yüzden zamanlar kırpma kadar kaydırılır, ilk kelime de sesin başladığı andan önceye düşmez.
    shift = start / SAMPLE_RATE
    shifted = [{**word, "t": round(max(word["t"] - shift, 0.02), 3)} for word in words]
    return {"duration": round((end - start) / SAMPLE_RATE, 3), "words": shifted}


def report(lines: list[dict], timing: dict) -> None:
    """Her cümlenin başlangıcı, bitişi ve bir sonrakine kalan boşluk: çakışma varsa göze çarpsın."""
    for current, following in zip(lines, lines[1:] + [None]):
        end = current["at"] + timing[current["id"]]["duration"]
        gap = following["at"] - end if following else 0.0
        flag = "  <-- ÇAKIŞMA" if gap < 0.15 and following else ""
        print(f'{current["id"]:>3}  {current["at"]:7.2f} → {end:7.2f}  boşluk {gap:5.2f}{flag}  {current["text"]}')


async def main() -> None:
    config = json.loads(SCRIPT.read_text(encoding="utf-8"))
    timing = {}
    for line in config["lines"]:
        mp3, words = await cached_line(config, line)
        timing[line["id"]] = finish_line(line, mp3, words)
    TIMING.write_text(json.dumps(timing, ensure_ascii=False, indent=1), encoding="utf-8")
    report(config["lines"], timing)


if __name__ == "__main__":
    asyncio.run(main())
