"""Kontak baskı: birçok kareyi küçültüp tek bir ızgara görüntüde toplar (çekimleri hızlıca gözden geçirmek için).

Kullanım: python scripts/contact_sheet.py çıktı.png sütun genişlik kare1.png kare2.png ...
"""

import sys

from PIL import Image, ImageDraw


def main() -> None:
    target, columns, width = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    frames = [Image.open(path).convert("RGB") for path in sys.argv[4:]]
    height = int(width * frames[0].height / frames[0].width)
    rows = (len(frames) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * width, rows * (height + 22)), "#111")
    draw = ImageDraw.Draw(sheet)
    for index, (frame, path) in enumerate(zip(frames, sys.argv[4:])):
        x, y = (index % columns) * width, (index // columns) * (height + 22)
        sheet.paste(frame.resize((width, height)), (x, y + 22))
        draw.text((x + 6, y + 4), path.replace("\\", "/").split("/")[-1], fill="#ddd")
    sheet.save(target)


if __name__ == "__main__":
    main()
