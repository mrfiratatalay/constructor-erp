# Reklam videoları

Uygulamanın gerçek ekranlarından, tamamen kodla üretilen reklam videoları. Neyin neden böyle yapıldığı:
**[PLAN.md](PLAN.md)**.

| Klasör | Ne |
|---|---|
| `demo-data/` | Boş bir veritabanına demo dünyasını (Kızılkan Yapı, hayali çalışanlar) API'den kuran betikler |
| `audio/` | Müzik ve ses efektleri, kodla: osilatör, filtre, yankı; kütüphane yok |
| `capture/` | Playwright: uygulamayı senaryodaki gibi kullanır, her adımın ekranını çeker |
| `public/captures/` | Çekilen ekranlar (telefon 3x, masaüstü 2x) |
| `public/audio/` | Üretilen sesler (`npm run audio`; repoda durmaz, her seferinde aynı çıkar) |
| `src/captures/` | Çekimin defteri: hangi resim, nereye dokunuldu, neresi kaydırıldı |
| `src/kit/` | Parça seti: telefon, laptop, parmak, imleç, kamera, sözler, kapanış. Bütün videolar ortak kullanır. |
| `src/yoklama/` | Yoklama videosu; `timeline.ts` bütün zamanlamayı tutar |

Bu klasör ürün kodu değildir: frontend'in ESLint'i ve backend'in Checkstyle'ı buraya bakmaz. ANAYASA'nın boyut ve
isim kurallarına yine de uyulur.

## Yalnızca videoyu yeniden üretmek

Çekimler repoda durur; uygulamayı çalıştırmak gerekmez.

```bash
cd marketing/video
npm install
npm run studio          # sesleri üretir, tarayıcıda önizleme: zaman çizelgesi, kare kare ileri geri
npm run render:yoklama  # sesleri üretir, out/yoklama.mp4 (1920×1080, 30 kare/sn, sesli)
npm run render:malzeme  # out/malzeme.mp4
npm run render:ekip     # out/ekip.mp4
npm run render:ilerleme # out/ilerleme.mp4
npm run render:saha     # out/saha.mp4
npm run render:tanitim  # ana video, 72 sn: beş videodan birer parça
```

Her video kendi klasöründedir (`src/yoklama/`, `src/malzeme/`, `src/ekip/`, `src/ilerleme/`, `src/saha/`; ana video
`src/tanitim/`). Metni ya da zamanlamayı değiştirmek için `timeline.ts`, kamerayı `camera.ts`, efektlerin yeri ve
yüksekliğini `sounds.ts`; müziğin akorları ve melodisi `audio/scores.mjs`'te, sesin kendisi `audio/music.mjs`'tedir.
Müzik 120 BPM'dir: timeline'daki büyük anlar (120, 480, 840. kare) müziğin düşüşleridir; biri değişirse öteki de
değişir.

## Ekranları yeniden çekmek (uygulama değiştiyse)

Uygulama ayrı bir veritabanıyla (`santiye_demo`) çalışır: geliştirme verine dokunulmaz.

```bash
docker compose up -d                          # repo kökünde: yalnızca PostgreSQL
marketing/video/demo-data/backend.sh          # backend, demo veritabanıyla (8080)
cd frontend && npm run dev                    # arayüz (5173), ayrı bir terminalde
cd marketing/video
npm run seed                                  # firma, kişiler, şantiyeler, ayın puantajı
npm run capture:yoklama                       # ekranlar ve defter yenilenir
npm run capture:malzeme
npm run capture:ekip
npm run capture:ilerleme
npm run capture:saha
```

- Puantaj ayın başından düne kadar doldurulur: çekim ayın sonuna doğru yapılırsa cetvel dolu görünür.
- Çekim her seferinde bugün girdiğini siler (yoklamada işaretler, malzemede sevkiyatlar, ekipte yeni usta, ilerlemede
  bugünün girişi, sahada sorun ve cevap) ve aynı
  sabahtan başlar; tekrar tekrar çalıştırılabilir. Gün değiştiyse dünkü çekimden kalanlar silinmez: çekimlerden
  önce demo dünyası baştan kurulur.
- Demo dünyasını baştan kurmak: backend'i durdur, `demo-data/reset.sh`, sonra yeniden `backend.sh` ve `npm run seed`.
- Kişilerin ve şantiyelerin adları `demo-data/world.mjs`'tedir.

## Bulut ortamında

Tarayıcılar önceden kurulu olduğunda indirme yerine onlar kullanılır:

```bash
PLAYWRIGHT_CHROMIUM=/opt/pw-browsers/chromium npm run capture:yoklama
npm run audio
npx remotion render src/index.ts Yoklama out/yoklama.mp4 --jpeg-quality=95 --crf=18 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

## Lisans

Remotion bireylere ve en çok 3 çalışanı olan şirketlere ücretsizdir; daha büyük şirket ücretli lisans alır.
Yayından önce güncel koşullar: https://www.remotion.dev/license
