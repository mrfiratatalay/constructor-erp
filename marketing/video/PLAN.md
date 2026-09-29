# Reklam videosu planı

29 Eylül 2026'da Fırat'la konuşularak kararlaştırıldı. Videolar tamamen kodla üretilir: uygulamanın gerçek
ekranları çekilir, Remotion ile canlandırılır. Gerçek çekim (insan, şantiye görüntüsü) yoktur.

## Amaç

Hedef kitle: **müteahhitler ve inşaata hizmet veren firmalar.** Çoğu teknik değil; şantiyelerini bugün WhatsApp
gruplarıyla, kâğıt puantaj defteriyle ve telefonla yönetiyor. Video onlara özellik listesi değil,
**kendi günlerini** göstermeli: "bu benim derdim, bu da çözümü".

Ana cümle (TASARIM.md'deki tek cümle testinden, izleyene dönük):

> **"Şefler sahadan yazıyor, siz tek ekrandan görüyorsunuz."**

## İlkeler

1. **Gerçek ekran, uydurma veri.** Her ekran uygulamanın kendisidir; kişiler ve şantiyeler hayalidir.
   Gerçek müşteri verisi, gerçek kişi adı ve başka markanın logosu kullanılmaz.
2. **Uydurma iddia yok.** "%30 tasarruf" gibi elimizde olmayan bir sayı yazılmaz. Sayılabilen gerçekler
   yazılır ("tek dokunuş", "tek bağlantı").
3. **Sessiz izlenebilir.** Sosyal medyada çoğu kişi sesi kapalı izler. Mesaj ekrandaki kısa yazılarla verilir
   (en çok 6 kelime); müzik üstüne eklenen katmandır.
4. **Telefon sahadır, masaüstü patrondur.** İki görünüm aynı şeyi iki kez göstermez, birbirine pas verir:
   iş telefonda yapılır, sonuç masaüstünde belirir. Uygulamanın gerçek rolleri de budur.
5. **Tatmin anı.** Her videoda en az bir "oh be" anı olur: tikler sırayla yeşile döner, sayı sayarak artar,
   cetvel dolar, dosya uçar.

## Seri

Üretim modül modüldür; her video kendi temposunda parlar, tek tek onaylanır. En sonda ana video bu
parçalardan kurgulanır.

| # | Video | Tek cümle | Telefonda (saha) | Masaüstünde (patron) |
|---|---|---|---|---|
| 1 | **Yoklama ve puantaj** (deneme) | Şef her sabah yazıyor, ay sonunda puantaj hazır. | Şef sabah yoklamayı alır | Puantaj cetveli, Excel |
| 2 | Şantiye sohbeti | Her şantiyenin kendi sohbeti. | Fotoğraf, sesli not | Bütün şantiyeler solda, sohbet sağda |
| 3 | Saha günlüğü | Şantiyede bugün ne oldu, tek akışta. | "Sorun bildir" | Sarı sorun satırı, günlük |
| 4 | Malzeme sevkiyatı | Ne çıktı, nereye gitti, geri gelecek mi. | Depocu sevkiyat çıkarır, irsaliye çeker | Sevkiyat defteri, "dışarıda" şeridi |
| 5 | Ekibi eklemek | Tek bağlantı, herkes içeride. | İşçi bağlantıdan katılır | Katılımcılar listesi |
| 6 | **Ana video** (60-75 sn) | Hepsi | 1-5'in en iyi anları | |

Görevler videoya girmez: TASARIM.md'de ürün kararı henüz konuşuluyor. Bildirim, 3. videonun parçasıdır.

## Biçim

- **Deneme ve modül videoları:** 1920×1080 (yatay), 30 kare/sn, 20-35 sn. Laptop ile telefon yan yana en iyi
  yatayda görünür.
- **Dikey (1080×1920) sürüm:** üslup onaylandıktan sonra aynı sahnelerden ikinci yerleşim olarak çıkar
  (Instagram, TikTok, LinkedIn).
- Çıktı MP4 (H.264). Müzik gelince aynı videoya eklenir, yeniden render edilir.

## Görsel dil

| Öğe | Karar |
|---|---|
| Renk | Uygulamanın kendi `tokens.css`'i: lacivert `#172554` zemin, baret sarısı `#facc15` vurgu, durum renkleri yalnızca durum için. |
| Zemin | Uygulamadaki teknik çizim ızgarası (`blueprint.css`), videoda kendini çizer. |
| Yazı tipi | Uygulamanınki: Plus Jakarta Sans. Video ile uygulama aynı markadan çıkmış görünür. |
| Cihazlar | Kendi çizdiğimiz sade telefon ve laptop çerçevesi (bir markanın birebir kopyası değil). Üstünde küçük etiket: "Şef · sahada", "Siz · ofiste". |
| Hareket | Yay (spring) hareketleri; imleç düz değil eğriyle gider; tıklanacak yere kamera yumuşakça yaklaşır. |
| Parmak / imleç | Telefonda yarı saydam dokunma halkası (dalga yaparak basar), masaüstünde ok imleç (tıklayınca halka). |
| Geçiş | Telefonda iş bitince ışık çizgisi masaüstüne uçar; kamera geri çekilip laptopu gösterir. |

## Üretim hattı

```
marketing/video/
├── PLAN.md          bu dosya
├── demo-data/       boş sisteme demo dünyasını API'den kuran betik (tekrar çalıştırılabilir)
├── capture/         Playwright: uygulamayı senaryodaki gibi kullanır, her adımın ekranını çeker
├── public/captures/ çekilen ekranlar (telefon 3x, masaüstü 2x çözünürlük)
└── src/             Remotion: parça seti (kit/) ve videolar (her modül kendi klasöründe)
```

1. **Demo verisi:** ayrı bir veritabanında (`santiye_demo`), API üzerinden: iş kuralları gerçek uygulamadaki
   gibi işler. API'nin geçmişe yazamadığı saatler (mesajın atıldığı saat, işaretin saati) SQL ile kaydırılır.
2. **Çekim:** Playwright uygulamayı gerçekten kullanır, her adımda fotoğraf çeker. Ekran kaydı alınmaz
   (bulanık, titrek, zamanı kontrol edilemez). Hareketli parçalar (alttan açılan menü, sağdan açılan panel)
   ayrı katman olarak çekilir; videoda gerçek fizikle yeniden oynatılır.
3. **Kurgu:** Remotion (React ile video). Parça seti bir kez yazılır, bütün videolarda aynen kullanılır.
4. **Kontrol:** her sahnenin kareleri tek tek resim olarak incelenir; sonra düşük çözünürlüklü taslak Fırat'a
   gider, geri bildirimle düzeltilir, son hali çıkar.

Uygulama bir ekranı değiştirirse çekim betiği yeniden çalıştırılır, videolar yeni ekranlarla yeniden render
edilir; kurgu kodu değişmez.

## Demo dünyası

Bütün videolarda aynı firma, aynı kişiler, aynı şantiyeler: seri ayrı reklamlar gibi değil, aynı hikâyenin
bölümleri gibi durur. Yoklamada gördüğün şef, saha günlüğünde sorun bildirir.

| Ne | Değer |
|---|---|
| Firma | **Toprak Yapı** (hayali), patron **Murat Toprak** |
| Şefler | Ahmet Kaya (telefondaki kahraman), Serkan Demir |
| Depo sorumlusu | Mehmet Yılmaz |
| Personel | 14 kişi: uygulamayı kullananlar ve uygulaması olmayanlar karışık, her birinin görevi (Kalıpçı, Duvarcı…) |
| Taşeron ekipler | Demirci · Hasan Usta, Elektrik · Volkan Usta, Tesisat · Erdal Usta, Alçıpan · Kadir Usta |
| Şantiyeler | Kartal Konutları B Blok, Ataşehir Ofis Binası, Beylikdüzü Villaları, Çekmeköy Okulu; tamamlanan: Maltepe Rezidans |
| Puantaj | Ayın başından dünkü güne kadar dolu: çoğu gün Geldi, arada gerçekçi Gelmedi / İzinli / Yarım gün, bazı günlerde mesai ve not. Pazar boş. Aynı betik her çalıştığında aynı veriyi üretir. |

## Deneme videosu: Yoklama ve puantaj (32 sn) — ilk taslak hazır

`npm run render:yoklama` → `out/yoklama.mp4`. Zamanlama `src/yoklama/timeline.ts`'tedir.

| Zaman | Sahne | Ekranda yazan |
|---|---|---|
| 0-3 sn | Lacivert ızgara kendini çizer. | "Sabah 08:00." → "Kim geldi, kim gelmedi?" |
| 3-7 sn | Telefon gelir (Şef · sahada), halka 0/18. Cemal'in satırına dokunur → alttan büyük düğmeler → **Gelmedi**. | "Şef yoklamayı telefondan alır." |
| 7-11 sn | **Seç** → liste kayar → altı satır tek tek işaretlenir → kalanlar → **Geldi**; "Geldi" satır satır yayılır. | "Seç, dokun, Geldi." |
| 11-14 sn | Liste başa kayar, halka yeşil **18/18**, etrafında dalga. | "Bugünün yoklaması tamam." |
| 14-17 sn | Telefon kenara çekilir, ışık çizgisi laptopa uçar (Patron · ofiste). | "Patron ofisten anında görür." |
| 17-20 sn | Masaüstünde bugünün özeti: Geldi 17, Gelmedi 1. | |
| 20-23 sn | İmleç **Puantaj**'a tıklar; cetvel soldan sağa dolar, en son toplamlar. | "Ayın puantajı kendiliğinden dolar." |
| 23-26 sn | Hüseyin'in 24 Eylül'ü: Geldi, mesai 3 saat, "Beton dökümü", "Kaydedildi · 08:16 · Serkan Demir". | "Kim, ne zaman yazdı: kayıtlı." |
| 26-28 sn | **Excel indir** → dosya ortaya uçar (Personel · Ekipler · Kayıtlar). | "Tek tıkla Excel." |
| 28-32 sn | Kapanış: KŞ imzası, "Kızılkan Şantiye". | "Şef her sabah yazar, puantaj ay sonunda hazır." |

**İlk taslakta öğrenilenler** (parça setine işlendi, sonraki videolar bunlarla başlar):

- Kamera telefona 1,5 kat yaklaşmazsa uygulamanın yazısı 1080p'de ~17 piksel kalıyor; telefondan izleyen okuyamıyor.
- Telefon sağdayken söz solun ortasında büyük durur; ekran dolunca sol alttaki levhaya iner.
- Uzun kaydırmada iki ekran görüntüsü arasında görülmemiş satırlar kalır: kaydırma, sayfanın tam boy şeridinden oynatılır.
- Tıklamadan sonra fare çekimde de videoda da kenara çekilir; yoksa açılan pencerede üzerine gelinmiş gibi görünür.

## Uygulamada fark edilenler

Çekim sırasında görüldü, videoyu etkilemedi (o kare kullanılmadı), ürün tarafında düzeltilecek:

- Telefonda toplu işaretlemeden sonra çıkan "17 satır işaretlendi" bildiriminde kutu dar: kelime ortadan bölünüyor
  ("işaretl / endi").

## Kalite kontrol

- Her sahnenin başı, ortası ve sonu kare kare resim olarak kontrol edilir: bulanıklık, taşan yazı, yanlış veri.
- Kod ANAYASA'nın boyut sınırlarına uyar (dosya 200, fonksiyon 30 satır).
- Taslak düşük çözünürlükte gönderilir; onaydan sonra 1080p son hali.

## Fırat'tan beklenenler

1. **Deneme videosuna geri bildirim:** hız, yazılar, renk; üslup bu turda donar.
2. **Kapanış:** web sitesi, telefon ya da "demo isteyin" gibi bir çağrı.
3. **Müzik:** telifsiz bir parça (ör. YouTube Ses Kitaplığı, Pixabay Music). Kurgu müziğin ritmine oturtulur.
4. **Firma adı:** demo firması "Toprak Yapı" uygun mu?

## Dikkat

- **Remotion lisansı:** bireylere ve en çok 3 çalışanı olan şirketlere ücretsizdir; daha büyük şirket
  ücretli lisans alır. Yayından önce güncel koşullar remotion.dev/license adresinden kontrol edilir.
- Bu klasör ürün kodu değildir: frontend'in ESLint'i ve backend'in Checkstyle'ı buraya bakmaz. Yine de
  ANAYASA'nın boyut ve isim kurallarına elle uyulur.
