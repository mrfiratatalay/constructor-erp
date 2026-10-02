# İskele ERP — 120 saniyelik reklam filmi

Film tamamen kodla üretilir: sinematik sahneler SVG/HTML ile çizilir, ürün ekranları gerçek uygulamadan Playwright
ile çekilir, müzik ve efektler Python ile sentezlenir, hepsi Remotion'da birleşip render edilir. Ürün koduna
(frontend/backend) dokunulmaz; eski "Constructor ERP" adı yalnızca çekim katmanında "İskele ERP" olur.

## Part'lar

Film part part üretilir; her part kendi başına izlenebilir bir MP4'tür, final film hepsinin birleşimidir.

| Part | Aralık | İçerik | Durum |
|---|---|---|---|
| 1 | 0 – 23 sn | Kaos (kodla çizilmiş şantiye ofisi) + marka kırılması + landing | Hazır |
| 2 | 23 – 38 sn | Başvuru → platform yönetimi → ödeme → kurulum bağlantısı → sihirbaz | |
| 3 | 38 – 53 sn | Şantiyeler, sohbet, saha | |
| 4 | 53 – 67 sn | Yoklama (telefon) → puantaj (ofis) → Excel | |
| 5 | 67 – 83 sn | Malzeme hareketleri | |
| 6 | 83 – 105 sn | İmalat/ilerleme, görevler | |
| 7 | 105 – 120 sn | Saha + depo + ofis, kapanış | |

## Kurulum (bir kez)

```bash
cd video
npm install
python -m venv --system-site-packages .venv
.venv/Scripts/pip install edge-tts pyloudnorm   # numpy ve scipy sistemden gelir
```

FFmpeg ayrıca kurulmaz: Remotion'ın getirdiği derleme kullanılır (loudnorm, AAC, H.264 içinde).

## Üretim hattı

| Adım | Komut | Ne yapar |
|---|---|---|
| Seslendirme | `cd audio && ../.venv/Scripts/python tts.py` | `src/film/voiceover.json` → cümle cümle Türkçe nöral ses, süreler ve kelime zamanları |
| Ürün çekimi | `node capture/landing.mjs` | Gerçek arayüzden 2x PNG + öğe kutuları (`public/capture/`) |
| Ses | `cd audio && ../.venv/Scripts/python mix.py` | Müzik + efekt + ambiyans + seslendirme → `public/audio/mix/film.wav` (-14 LUFS, -1 dBTP), stem'ler `out/stems/` |
| Önizleme | `npm run studio` | Tarayıcıda zaman çizelgesiyle, sesli |
| Part render | `node scripts/renderPart.mjs 1` | `out/parts/iskele-erp-part-01-….mp4` + `.srt` |

Ürün çekimleri izole bir Docker yığınından alınır (kullanıcının verisine dokunmaz): arayüz 5190, API 8090,
veritabanı 5440, compose projesi `iskele-video`.

## Zaman tek kaynaktan

- `src/film/voiceover.json`: her cümlenin filmde başladığı saniye (`at`), TTS okunuşu (`say`: "ERP" → "erepe").
- `src/film/cues/*.json`: planlar, bildirimler, efektler. Görüntü (React) ve ses (Python) aynı dosyayı okur;
  telefonun titrediği kare ile titreşim sesi aynı saniyededir.
- Bütün sahneler filmin mutlak saniyesiyle çalışır (`useFilmTime`).

## Notlar

- Seslendirme Microsoft'un nöral Türkçe sesiyle (tr-TR-AhmetNeural) üretildi. Ticari yayında lisanslı TTS ya da
  profesyonel seslendirme önerilir; metin ve zamanlar aynı kaldığı için ses dosyaları değiştirilip mix yeniden
  alınır.
- Remotion ücretsiz lisansı en fazla 3 çalışanlı şirketleri kapsar; daha büyük ekipte şirket lisansı gerekir.
- Müzik ve efektlerin hepsi sentezdir; telifli parça ya da hazır ses paketi yoktur.
