# İskele ERP — 120 saniyelik reklam filmi

Film tamamen kodla üretilir: sinematik sahneler SVG/HTML ile çizilir, ürün ekranları gerçek uygulamadan Playwright
ile çekilir, müzik ve efektler Python ile sentezlenir, hepsi Remotion'da birleşip render edilir. Ürün koduna
(frontend/backend) dokunulmaz; eski "Constructor ERP" adı yalnızca çekim katmanında "İskele ERP" olur.

## Part'lar

Film part part üretilir; her part kendi başına izlenebilir bir MP4'tür, final film hepsinin birleşimidir.

| Part | Aralık | İçerik |
|---|---|---|
| 1 | 0 – 23 sn | Kaos (kodla çizilmiş şantiye ofisi) + marka kırılması + landing |
| 2 | 23 – 37,5 sn | Başvuru → platform yönetimi → Havale/EFT ödemesi → kurulum bağlantısı → sihirbaz |
| 3 | 37,5 – 50,6 sn | Şantiyeler, sohbet (fotoğraf, sesli not), saha akışı (şef Ayşe) |
| 4 | 50,6 – 62,5 sn | Yoklama (şefin telefonu) → aynı kayıtlar ofiste → aylık puantaj → Excel |
| 5 | 62,5 – 76,5 sn | Malzeme: şantiyeye sevkiyat, iade, geri beklenenler (depo sorumlusu Mehmet) |
| 6 | 76,5 – 95,5 sn | İlerleme (günlük giriş, çubuk gerçekten uzar) ve görev (oluştur → tamamla) |
| 7 | 95,5 – 120 sn | Saha + depo + ofis aynı kayıtta; kapanış: sakin ofis, logo, slogan |

Spesifikasyondaki son 15 saniye (01:45–02:00) ~21 sn konuşma içeriyordu; doğal hızda sığmadığı için ara bölümler
1–4 sn kısaltıldı ve kapanışa yer açıldı.

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
| Yığın | `node scripts/stack.mjs reset` | İzole Docker yığını sıfırdan, rastgele şifrelerle (`.cache/stack.json`) |
| Kurulum çekimi | `node capture/onboarding.mjs` | Gerçek akış: başvuru → firmaya dönüştürme → ödeme → bağlantı → sihirbaz (Part 2) |
| Demo veri | `node capture/seed.mjs` | Ekip (katılma bağlantısıyla), şantiyeler, sohbet, puantaj, malzeme, imalat, görev; saatler SQL'le |
| Ürün çekimleri | `node capture/landing.mjs`, `sites.mjs`, `attendance.mjs`, `materials.mjs`, `work.mjs`, `devices.mjs` | Her kişi kendi rolüyle; 2x PNG + öğe kutuları (`public/capture/`) |
| Kutular | `node scripts/boxes.mjs` | Çekimlerin öğe kutularını `src/film/boxes.json`'a toplar |
| Ses | `cd audio && ../.venv/Scripts/python mix.py` | Müzik + efekt + ambiyans + seslendirme → `public/audio/mix/film.wav` (-14 LUFS, -1 dBTP), stem'ler `out/stems/` |
| Önizleme | `npm run studio` | Tarayıcıda zaman çizelgesiyle, sesli |
| Kontrol kareleri | `node scripts/stills.mjs 24.5 60 118` | Bir kez paketler, verilen saniyelerin karelerini alır |
| Final | `node scripts/renderFilm.mjs` | Master + 1080p teslim, ses kanalları (24 bit WAV), SRT, 7 part dilimi (`out/final`, `out/parts`) |

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
