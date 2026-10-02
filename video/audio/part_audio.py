"""Bir part'ın sesi: film mix'inden [başlangıç, bitiş) dilimi, kendi içinde -14 LUFS / -1 dBTP'ye getirilir.

Kullanım: python part_audio.py 0 23 ../out/parts/part-01.wav
Part'lar ayrı izlendiği için her biri tek başına doğru seviyede çalmalı; filmin bütünü mix.py'de ayrıca
ölçülür.
"""

import sys
from pathlib import Path

from dsp import SR, envelope
from loudness import master, report
from paths import PUBLIC_AUDIO
from wavio import read, write


def main() -> None:
    start, end, target = float(sys.argv[1]), float(sys.argv[2]), Path(sys.argv[3])
    film = read(PUBLIC_AUDIO / "mix" / "film.wav").astype("float64")
    piece = film[int(start * SR): int(end * SR)]
    # Part'ın sonu bir sonraki part'a bağlanır: kulakta "tık" olmasın diye son 30 ms yumuşakça kapanır.
    piece = piece * envelope(len(piece), 0.0, 0.03, curve=1)[:, None]
    mastered, _ = master(piece)
    write(target, mastered)
    report(mastered, target.name)


if __name__ == "__main__":
    main()
