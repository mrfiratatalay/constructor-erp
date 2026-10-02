# İskele ERP — 120 sn reklam filmi

Bu klasör reklam filminin bütün kaynağıdır: demo verisi, gerçek ürün çekimi, kodla çizilmiş sahneler, ses ve kurgu.
Ürün koduna (frontend, backend) dokunulmaz; film ürünün kendisini, ayrı bir demo veritabanında çalıştırarak çeker.

## Hat

| Adım | Ne | Nerede |
|---|---|---|
| 1. Demo ortamı | Ayrı veritabanı (`santiye_video`), demo saati 22 Ekim 2026 14:26 (ayrı jar, ürün kodu değişmez) | `demo/backend.sh`, `demo/clock/` |
| 2. Fotoğraflar | Şantiye fotoğrafları Three.js ile kodla render edilir (kolon kalıbı, demir teslimi, iskele, vinç) | `demo/photos/` |
| 3. Demo verisi | Atalay Yapı: ekip, puantaj, sohbet/saha, malzeme, imalat, görev — ürünün kendi API'siyle | `demo/seed/` |
| 4. Ürün çekimi | Playwright, kare kare deterministik (sayfanın saati ve CSS animasyonları her karede 1/30 sn ilerler), 2× çözünürlük | `capture/` |
| 5. Kurgu | Remotion: kaos, marka, ürün bölümleri, üç cihaz, kapanış | `film/` |
| 6. Ses | Türkçe seslendirme (TTS + stüdyo zinciri), sentezlenmiş müzik ve efektler, -14 LUFS / -1 dBTP | `audio/` |

## Yeniden üretmek

```bash
cd video && npm install && pip install numpy scipy pedalboard pyloudnorm soundfile
./demo/up.sh && ./demo/backend.sh reset             # PostgreSQL (Docker) + arayüz (5173) + demo backend
node demo/photos/render.mjs && node demo/assets/build.mjs
node capture/run.mjs landing apply admin setup      # firma arayüzden kurulur
node demo/seed/index.mjs                            # kurulan firmanın üstüne demo verisi
DEMO_NOW=2026-10-22T14:15:40 ./demo/snapshot.sh restore ui   # şantiye çekiminde mesaj 14:20'ye düşsün
node capture/run.mjs sites rollcall puantaj materials production tasks phoneField phoneMaterials overview
node tools/extractClips.mjs                         # çekimler → public/clips (kare dizisi)
node audio/voice.mjs && python3 audio/music.py && python3 audio/sfx.py && python3 audio/master.py
npx remotion render film/index.ts Film out/film-video.mp4 --codec=h264 --crf=14
python3 tools/deliver.py                            # ses + görüntü → teslim/
```

Önizleme: `npx remotion studio film/index.ts`. Zamanlamanın tek kaynağı `audio/script.mjs` (seslendirme) ve
`film/timeline.ts` (bölümler).

## Kararlar

- **Marka:** ürün arayüzünde hâlâ "Constructor ERP" yazar; çekim katmanı (`capture/inject/stage.js`) bunu ekrana
  basılmadan "İskele ERP" yapar. Logo, ürünün mevcut vinç işaretidir; yeni ikon icat edilmedi.
- **Saat:** filmin "bugün"ü ayın sonuna yakın bir gün (22 Ekim) seçildi: puantaj cetveli dolu görünsün diye.
- **Malzeme:** üründe "Geri bekleniyor" yalnızca harici firmaya geri dönecek gönderimdir; filmdeki canlı hareket
  "Ana depo → Yomra Park, 24 kalıp paneli", geri beklenen kayıt taşerondaki kalıp panelleridir (gerçek davranış).
- **Gizlilik:** bütün kişiler, telefonlar (0500 000 …) ve e-postalar (`.test`) uydurmadır; kurulum bağlantısı her
  karede maskelenir.
- **Seslendirme:** sentetik Türkçe ses (Google Çeviri TTS) + rubberband tempo, EQ, de-esser, sıkıştırma. Gerçek bir
  seslendirme sanatçısının kaydı `out/audio/vo/<id>.wav` olarak konursa aynı zamanlamayla miks yeniden alınır.
- **Lisans:** Remotion, 3 kişiye kadar şirketlerde ve bireysel kullanımda ücretsizdir; daha büyük ekipler için şirket
  lisansı gerekir (remotion.dev/license).
