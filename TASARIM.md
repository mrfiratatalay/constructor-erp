# Kızılkan Şantiye — Ekran Tasarımı Kararları

22 Eylül 2026'da kararlaştırıldı; ilk sürüm ekranlarda görüldükten sonra aynı gün ikinci
turda inceltildi. Ekran düzeniyle ilgili bir tercih yapılacağı zaman önce buraya bakılır.
Kurallar değil, kararlardır; gerekçesiyle birlikte değişir.

## İlkeler

**1. İyi haber sessizdir.** Sıfır sayı, boş kutu, "sorun yok" rozeti gösterilmez.
Sakin şantiyenin yeri, yer kaplamamaktır. Ekranda görünen her şey ya bir iş ya bir haberdir.

**2. Ayrımı başlıkla değil, yoğunlukla anlat.** "Dikkat isteyen / Diğer" gibi başlıklar
yerine önemli olan geniş, önemsiz olan dar çizilir. Kullanıcı okumadan, siluetten anlar.

**3. Eyleme dönüşmeyen sayı gösterilmez.** "Bugün 34 fotoğraf" bilgisiyle patron hiçbir şey
yapmaz; "2 açık sorun, en eskisi 3 gündür" bilgisiyle telefon açar.

**4. Bir gönderi şantiyesine aittir.** Gönderme her zaman şantiyenin içinde olur;
ayrı bir gönderme ekranı ve şantiye seçici yoktur.

**5. Uyarı, ancak anlam taşıdığı saatte uyarır.** Sabah 08:00'de hiçbir şantiyeden haber
gelmemiştir. "Bugün haber yok" 13:00'ten önce nötr gri, sonra amber yazılır.

**6. Defter iz bırakmadan değişmez.** Gönderi silinebilir ve düzeltilebilir, ama yerinde
"silindi" ya da "düzenlendi" izi kalır. Patron sabah bildirilen bir sorunun öğlen sessizce
kaybolmadığından emin olur.

**7. Tanıdık olan kazanır.** Şefin elindeki alışkanlık WhatsApp'tır: mesaj çubuğu, basılı tut
ses kaydı, uzun basınca menü. Yeni bir kalıp icat etmek yerine onu kullanırız.

## Ekran 1 — Şantiyeler (ana ekran)

Patronda "Şantiyeler", şefte "Şantiyem". Tek şantiyesi olan listeyi hiç görmez,
doğrudan o şantiyenin sayfasına düşer.

**Başlık:** ince lacivert (blueprint) şerit. Marka adı + tarih, altında tek cümlelik durum
("3 açık sorun · 2 şantiye sessiz"), Sorunlar'a gider. Selamlama yok.

**Liste yukarıdan aşağı daralır.** Sıralama: açık sorun → okunmamış haber → sessiz → sakin.

| Durum | Yoğunluk |
|---|---|
| Okunmamış haber | Geniş: 3'lü kare fotoğraf şeridi (fazlası `+5`), son gönderinin önizleme metni, durum satırı, okunmadı rozeti |
| Açık sorun var, hepsi okunmuş | Orta: fotoğraf yok; önizleme metni + kırmızı sorun etiketi |
| Bugün haber gelmedi | Orta: fotoğraf yok, "Dünden beri haber yok" + şef adı |
| Sorun yok, hepsi okunmuş | Sıkışık: tek satır — ad · şef · saat |

**Fotoğraf = görmediğin yeni şey.** İlk sürümde sorunlu şantiye okunmuş olsa da üç büyük
fotoğrafla duruyordu; bir satır ~300px yer kaplıyor, fotoğraf "yeni" anlamını yitiriyordu.
Sorunu kırmızı etiket anlatır, fotoğrafı yeni haber. Sıralama değişmez: sorunlu şantiye yine en üsttedir.

**Bildirim hatırlatması listenin altında, tek satır.** İlk sürümde en tepede ~180px kaplıyordu
ve ilk ekranda yalnızca 1,3 şantiye görünüyordu. Ana içerik her zaman önce gelir.

**Önizleme metni** (`Ahmet: "Demir gelmedi…"`) ekranın en değerli parçasıdır: patron çoğu gün
içeri hiç girmeden cevabını alır.

**Okunmadı rozeti lacivert**, kırmızı değil. Kırmızı açık soruna ayrılmıştır; okunmamış
gönderi alarm değil, bilgidir.

**Sakin satırda hiçbir işaret yok** — yeşil onay simgesi de yok (İlke 1).

**Her şey yolundaysa** listenin üstünde sakin bir cümle: "Bugün her şey yolunda —
9 şantiyeden de haber geldi."

## Ekran 2 — Sorunlar

Bu bir akış değil, bir iş listesidir. Sekme ve şantiye süzgeci yoktur: açık sorun sayısı
normalde 3-5'tir, süzülecek bir şey yokken süzgeç gürültüdür.

**En eski üstte.** Yaş, satırın **sol şeridinin rengini** belirler:
bugün nötr (şeritsiz) · dün amber · 2+ gün kırmızı. Böylece hiçbir şey yapılmazsa
ekran kendi kendine kızarır — sessiz bir hatırlatma.

Akışta sorun, olaylar arasında bir olaydır; orada üstteki kırmızı bant doğrudur.
Burada her şey zaten sorundur, ayırt edici olan yaştır.

**Satır:** yaş etiketi · şantiye · şef · gönderi metni · fotoğraflar ·
`Çözüldü` ve `📞 Ara` düğmeleri.

**Altta** `Çözülen N sorun ›` linki, ayrı sayfaya gider.

**Boş durum** bu ekranın en sık hâlidir, öyle yazılır:
"Bekleyen iş yok. Son sorun 2 gün önce çözüldü."

## Ekran 3 — Şantiye sayfası

En çok açılan ekran; "Akış" sekmesi buraya taşındı.

1. **Künye:** şantiye adı, şef adı, `📞 Ara` düğmesi. Sorumlu atanmamışsa patron tek satırlık
   "Sorumlu ata" bağlantısı görür (Ekip'e gider), şef hiçbir şey görmez: olumsuz bilgi kart kaplamaz.
2. **Açık sorun şeridi** — yalnızca sorun varsa çıkar, sıfırken hiç yer kaplamaz.
3. **Akış:** gün başlıklarıyla, **en yeni üstte**. Bu bir sohbet değil, şantiye defteri:
   gönderiler rapordur, karşılıklı konuşma değil.
4. **"Buradan yukarısı yeni" ayracı:** son bakıştan sonraki gönderilerin altında ince çizgi.
   Ana ekrandaki rozet "3 yeni var" der, bu çizgi "hangileri" der.
5. **Gönderme: WhatsApp mesaj çubuğu** (sayfanın altında sabit, herkeste; İlke 7).

```
  Boşken:                                Yazmaya başlayınca:
 ┌──────────────────────────────┐         ⚠ Sorun olarak işaretle ○
 │ 📷 │ Bir not yaz…      │ 🎤 │        ┌──────────────────────────────┐
 └──────────────────────────────┘        │ 📷 │ Demir gelmedi…    │ ➤  │
                                         └──────────────────────────────┘
```

   - Yazı doğrudan çubuğa yazılır; ayrı pencere açılmaz.
   - 📷 kamera/galeri açar → önizleme penceresi (fotoğraflar + açıklama + sorun) → Gönder.
   - 🎤 basılı tut, bırakınca gider. Yazı varken 🎤 yerine ➤ çıkar.
   - "Sorun olarak işaretle" yalnızca içerik varken çubuğun üstünde görünür.

   İlk sürümdeki üç düğme (Fotoğraf · Ses · Not) üçü de aynı pencereyi açıyordu; "Not" bile
   fotoğraf kutusuyla başlıyordu. Söz verilenle yapılan farklıydı.

6. **Alt sekmeler bu sayfada gizlenir** (WhatsApp'ta sohbetin içi gibi): gönderme çubuğu ile
   sekme çubuğu üst üste ekranın %15'ini yiyordu. Tek şantiyeli şef için bu sayfa ana ekrandır;
   onda sekmeler kalır.

## Masaüstü: solda liste, sağda şantiye (WhatsApp Masaüstü)

Üçüncü turda (22 Eylül) değişti. İkinci turdaki masaüstü çözümü, yani büyük kart ızgarası, küçük
kart ızgarası, sakinler tablosu ve şantiye sayfasında sağ sütunda üç kutu, aynı şeyi (şantiyeyi) ekranda
üç ayrı kılıkta gösteriyordu. Göz tek bir listeyi okuyamıyordu, "kutu kutu" dağınık görünüyordu.
Patron her şantiye için sayfa değiştirip geri dönüyordu.

```
┌───┬────────────────────────┬─────────────────────────────────────────┐
│ ☰ │ Şantiyeler     22 Eyl  │ NAMIK KEMAL · Ahmet Yılmaz     📞   ⓘ    │
│ 🏗 │ ⚠ 1 açık sorun·1 sessiz │─────────────────────────────────────────│
│ ⚠ │────────────────────────│  BUGÜN                                  │
│   │ Bahçelievler     03:42 │  ┌ gönderi ─────────────────────────┐   │
│ ⚙ │ Ahmet: Beton pompası…  │  └──────────────────────────────────┘   │
│ 👥 │ ⚠ 1 açık sorun          │  ─── buradan yukarısı yeni ───          │
│   │▐NAMIK KEMAL     03:42 ①│                                         │
│   │ EREGLI                 │                                         │
│   │ Henüz hiç haber yok    │ ┌─────────────────────────────────────┐ │
│ PA│ Kartal B Blok    03:42 │ │ 📷 │ Bir not yaz…             │ 🎤 │ │
└───┴────────────────────────┴─────────────────────────────────────────┘
```

| Parça | Karar |
|---|---|
| Sol menü | `el-menu` `collapse`: ☰ ile ikonlara daralır (64px), ikonun üstünde ad ipucu olarak çıkar. Seçim tarayıcıda hatırlanır. Seçili öğe baret sarısıyla dolu, yazısı lacivert (logodaki KŞ rozetinin ikilisi). Beyaz yazı değil: sarı üstünde beyaz ~1,5:1 kontrastla okunmaz, lacivert ~11:1. |
| Liste | Tek tip satır: ad + saat + okunmadı rozeti, altında önizleme ya da durum. Seçili satır lacivert zeminli. Kart, ızgara, tablo ve listede fotoğraf yok: fotoğraflar sağdaki akışta. Durum cümlesi listenin başında tek satır yazı (kutu değil). |
| Sağ panel | Seçili şantiyenin defteri; adres `/santiyeler/:id`, bağlantı paylaşılabilir, geri tuşu çalışır. Gönderme altta, mobildeki WhatsApp çubuğuyla aynı. |
| Hiçbir şantiye seçili değilken | Sağda sakin bir boş durum: günün cümlesi + "Soldan bir şantiye seç". Kullanıcı istemeden hiçbir şantiye okunmuş sayılmaz. |
| Künye | Sağ panel başlığında şantiye · şef adı · 📞. Adres, bütün sorumlular ve bu haftanın fotoğrafları ⓘ ile açılan `el-drawer` çekmecede (WhatsApp'taki "kişi bilgisi"). |
| Kaydırma | Liste ve akış ayrı ayrı kayar (`el-scrollbar`); sayfa bütün olarak kaymaz. |

Mobil değişmez: orada zaten liste → şantiye sayfası (WhatsApp mobil) düzeni var.

### Sorunlar da aynı düzende

İki ana menü aynı mantıkla çalışır; amcan bir kere öğrenir. Sorunlar bir iş kuyruğudur: e-posta kutusu
gibi yukarıdan aşağı "oku → karar ver → sıradakine geç" diye işlenir. İkinci turdaki tek sütun kartlarda
(her birinde koca fotoğraf) ekranda aynı anda ancak 1,5 sorun görünüyordu.

```
┌───┬────────────────────────┬─────────────────────────────────────────┐
│ ☰ │ Sorunlar        3 açık │ 3 GÜNDÜR BEKLİYOR                        │
│   │▌3 gündür  Bahçelievler │ Bahçelievler Konutları › · Ahmet   📞    │
│   │ Beton pompası 2 saat…  │─────────────────────────────────────────│
│   │▌Dün       Etimesgut    │ Beton pompası 2 saat geç geldi…          │
│   │ Bugün     Keçiören     │ [ fotoğraf ]  [ fotoğraf ]              │
│   │ Çözülen 12 sorun ›     │              [ ✓ Çözüldü ]              │
└───┴────────────────────────┴─────────────────────────────────────────┘
```

| Parça | Karar |
|---|---|
| Liste satırı | Yaş · şantiye · sorunun ilk satırı. Yaş şeridi mobildekiyle aynı: bugün şeritsiz, dün amber, 2+ gün kırmızı. |
| Sağ panel | Tam metin, büyük fotoğraflar, bildiren; başlıkta şantiye adı (şantiyeye gider) ve 📞; altta tek büyük "Çözüldü". |
| Açılış | En eski (en uzun bekleyen) sorun seçili gelir. Seçmek yan etki yaratmaz (Şantiyeler'deki "okundu"nun aksine), bu yüzden güvenli. |
| Çözülünce | Sıradaki sorun kendiliğinden açılır; kuyruk bitince sağda "Bekleyen iş yok." |
| Çözülenler | Listenin sonunda "Çözülen N sorun ›"; aynı düzende çözülenler listesi. |

### Şantiye ayarları ayrı bir ekran değil

Ayarlar şantiyenin kendisinde durur (WhatsApp'ta grubun ayarları grubun bilgi ekranındadır). İkinci
turda aynı şantiye iki yerde, iki kılıkta duruyordu: adresi düzeltmek için şantiyeden çıkıp Yönetim ›
Şantiye ayarları'na gitmek, tabloda aynı şantiyeyi bulmak gerekiyordu.

| Ne | Nerede |
|---|---|
| Şantiye ekleme | Şantiye listesinin başlığında ＋ (yalnızca patron) |
| Düzenleme (ad, adres, durum) | Şantiyenin ⓘ çekmecesinde "Düzenle" (yalnızca patron); form bugünkünün aynısı |
| Tamamlanan şantiyeler | Listenin sonunda "Tamamlanan N şantiye ›" (Sorunlar'daki "Çözülen N sorun ›" kalıbı) |

"Şantiye ayarları" menüsü ve sayfası kalkar; Yönetim'de yalnızca Ekip kalır. Mobilde de aynı: ana ekranın
başlığında ＋, şantiye sayfasının başlığında ⓘ (alttan açılan pencere); "Ben"deki satır gider.

### Ekip de aynı düzende

Uygulamanın bütün ana ekranları tek kalıp: solda liste, sağda seçili olan. İkinci turdaki tabloda her
satırda üç küçük düğme vardı (kişiyi kapatan dahil), her satırda yeşil "Aktif" etiketi duruyordu, patronun
kendi satırında bile "Giriş linki" vardı.

| Parça | Karar |
|---|---|
| Liste | Ad · rol · son görülme. Tek etiket: sarı "Linki açmadı" (patronun yapacağı bir iş varsa). Yeşil "Aktif" yok (İlke 1). Pasifler en altta "Pasif N kişi ›". |
| Sağ panel | Rol ve telefon (📞), şantiyeleri (bağlantı), giriş bölümü (son görülme + "Yeni giriş linki · WhatsApp'ta gönder"), Düzenle. "Erişimi kapat" en altta, ayrı ve kırmızı. Patron kendi hesabında giriş linki ve erişimi kapat görmez. |
| Kişi ekleme | Liste başlığında ＋ (Şantiyeler'deki ＋ ile aynı yer). Kaydedince sağda yeni kişi açılır, giriş linki göndermeye hazır. |
| Mobil | Liste kalır; kişiye dokununca çıplak menü yerine sağ panelin aynısı alttan açılır. |

### Hesabım masaüstünde sayfa değil, panel

Sol alttaki kullanıcı düğmesine (menü daralmışken yalnızca avatar) basınca açılan `el-popover`: ad · rol ·
firma, Bildirimler anahtarı, Mobil görünüme geç, Çıkış yap. İkinci turda üç satır bilgi ve bir anahtar
için menüden geçilen ayrı bir sayfa vardı. Masaüstünde `/ben` sayfası kalkar; mobilde "Ben" sekmesi kalır
("Şantiye ayarları" satırı çıkar). Giriş ekranı değişmez.

### Masaüstünün son hâli

| Menü | Ekran |
|---|---|
| 🏗 Şantiyeler | Liste · seçili şantiyenin defteri (＋ ekle, ⓘ bilgi ve düzenle, Tamamlananlar) |
| ⚠ Sorunlar | Liste · seçili sorun (en eskisi seçili, çözülünce sıradaki, Çözülenler) |
| 👥 Ekip (Yönetim, patron) | Liste · seçili kişi (＋ ekle, giriş linki, Pasifler) |
| [PA] kullanıcı | Panel: bildirimler, mobil görünüm, çıkış |

## Gönderi silme ve düzeltme

| Kural | Karar |
|---|---|
| Kim silebilir | Yazar kendi gönderisini, patron her gönderiyi |
| Kim düzeltebilir | Yalnızca yazar: başkasının ağzından yazılmaz. Patron başkasının gönderisini düzeltemez, silebilir. |
| Ne zaman | Her zaman |
| İz | Silinen gönderinin yerinde "Bu gönderi silindi · Patron · 22 Eylül 14:20" kalır (sorunsa "Bu sorun silindi"); düzeltilende saatin altında "düzenlendi" (İlke 6) |
| Silinen içerik | Yazı ve fotoğraf/video/ses dosyaları gerçekten silinir: adresini bilen de açamaz, ana ekranın fotoğraf şeridine ve okunmadı sayısına girmez. Satır iz olarak kalır. |
| Düzeltilebilen | Yazı ve sorun işareti. Fotoğraf yanlışsa gönderi silinip yeniden atılır. Çözülmüş sorunun işareti değişmez. |
| Nasıl | Mobilde gönderiye uzun basınca alttan menü (WhatsApp gibi); masaüstünde kartın köşesinde `⋯` |
| Sorunlar'a etkisi | Silinen açık sorun Sorunlar'dan düşer. Sonradan "sorun" işaretlenen gönderi Sorunlar'a girer ve bildirim gider. Giden bildirim geri alınamaz. |

## Navigasyon

Üç sekme, iki rolde de aynı yapı. Ortadaki yükseltilmiş `+` düğmesi ve rol bazlı iki ayrı
menü tablosu kalkar.

| | Patron | Şef |
|---|---|---|
| 1 | Şantiyeler | Şantiyem (doğrudan kendi akışı) |
| 2 | Sorunlar | Sorunlar (kendi şantiyesininkiler) |
| 3 | Ben | Ben |

Şantiye ve ekip yönetimi "Ben" altına iner: ayda bir yapılan iş, günlük sekme işgal etmez.
Masaüstünde sol menüde ayrı bir "Yönetim" grubundadır. Şantiye düzenleme de buraya taşındı
(`/ayarlar/santiyeler`); şantiye sayfasında düzenle düğmesi yoktur.

## Backend

| Ne | Niçin |
|---|---|
| Telefon `SiteLead` ve gönderi yazarında | Sorunlar ve şantiye künyesindeki `Ara` düğmesi. Alan `users.phone` olarak zaten vardı. |
| `site_visits` tablosu (V6), `POST /sites/{id}/visits` | Okunmadı rozeti ve "buradan yukarısı yeni" ayracı. Şantiye açılınca ve kapanınca hepsi okundu sayılır. Hiç bakılmamış şantiyede yalnızca bugünkü gönderiler okunmamış sayılır. |
| `/today` satırında son gönderi, 3 fotoğraf, okunmamış sayısı, en eski açık sorun | Ana ekranın üç yoğunluğu. |
| Açık sorunlar en eski üstte | Sorunlar ekranının sıralaması. |
| Gönderi düzeltme ve silme (V7), `PATCH` / `DELETE /posts/{id}` | Silinen satır iz olarak kalır, medyası silinir (dosyalar işlem kesinleşince). |
| `GET /sites/{id}/photos` | Masaüstü sağ sütunundaki "bu haftanın fotoğrafları" (son 7 gün, en çok 24). |

## Kaldırılanlar

- `TodayHero` — dört sayı kutusu; ikisi eyleme dönüşmüyordu (İlke 3)
- Ana ekrandaki iki `SectionHeading` — ayrımı artık yoğunluk taşıyor (İlke 2)
- `Akış` sekmesi — şantiyenin içine taşındı
- Sorunlar'daki `van-tabs` ve `SiteFilter`
- `ComposePage` ve şantiye seçici — gönderme sayfa içine indi (İlke 4)
- Tabbar'daki `primary` düğme ve `navItems.ts`'teki rol bazlı menü tabloları
