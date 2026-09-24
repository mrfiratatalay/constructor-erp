# Kızılkan Şantiye — Ekran Tasarımı Kararları

22 Eylül 2026'da kararlaştırıldı, aynı gün dördüncü turda sadeleştirildi; 23 Eylül'de Şantiyeler modülü
ayrıntı ayrıntı yeniden kararlaştırıldı (telefon önce: patron şantiyelere telefondan bakar), 24-25 Eylül'de kişiler. Ekran düzeniyle
ilgili bir tercih yapılacağı zaman önce buraya bakılır. Kurallar değil, kararlardır; gerekçesiyle birlikte değişir.

## Tek ölçüt: tek cümle testi

Dayına telefonu uzatınca söylenecek cümle şudur:

> **"Bu, sadece şantiyeler için WhatsApp. Şefler buraya atıyor, sen burada görüyorsun."**

Bundan uzun bir açıklama gerekiyorsa tasarım yanlıştır. Dördüncü turda ekranlar bu teste vuruldu ve
öğrenilmesi gereken dokuz sessiz kural (yoğunluk kademesi, rozet renkleri, yaş şeritleri, sessizlik
saati, boş ekranın "iyi haber" anlamı…) tek tek kaldırıldı.

## İlkeler

**1. Tanıdık olan kazanır.** Şefin ve patronun elindeki alışkanlık WhatsApp'tır: sohbet listesi, grubun
içi, mesaj çubuğu, basılı tut ses kaydı, uzun basınca menü. Yeni bir kalıp icat etmek yerine onu
kullanırız. Yeni bir kavram eklemeden önce sorulur: **bunun WhatsApp'ta karşılığı ne?**

**2. Ekranda ne varsa yazar.** Anlam renk, genişlik ya da boşlukla anlatılmaz. "3 gündür bekliyor"
yazılır; kırmızı şeritle ima edilmez. Dayın ekrana okumaya bakar, siluete değil.

**3. Olumsuz bilgi yer kaplamaz.** "Henüz haber yok", "sorumlu atanmadı", "bugün sessiz" gibi cümleler
ekranda durmaz. Bir şantiyenin en son ne zaman konuştuğunu **satırdaki zaman** zaten söyler
("Dün", "Pazartesi", "12.09.2026"); ikinci kez etiketle söylemek gürültüdür.

**4. Eyleme dönüşmeyen sayı gösterilmez.** "Bugün 34 fotoğraf" ile patron hiçbir şey yapmaz.

**5. Bir gönderi şantiyesine aittir.** Gönderme her zaman şantiyenin içinde olur; ayrı bir gönderme
ekranı ve şantiye seçici yoktur.

**6. Defter iz bırakmadan değişmez.** Gönderi silinebilir ve düzeltilebilir, ama yerinde "silindi" ya da
"düzenlendi" izi kalır.

## Ekran 1 — Şantiyeler (WhatsApp'ın sohbet listesi)

Herkes aynı listeyi görür; tek şantiyesi olan şef de. Sekmenin adı herkes için "Şantiyeler".

```
┌──────────────────────────────────────────┐
│▓ Kızılkan İnşaat                      ＋ ▓│  firma adı · ＋ yalnızca patronda
│  🔍 Ara                                   │  şantiye adı + mesaj yazısı
│ (⛑)  Kartal B Blok            12.09.2026 │
│       Patron şantiyeyi kurdu          📌 │  sabitlenmiş (en fazla 3, kişiye özel)
│ (🏢)  NAMIK KEMAL PLAZA            13:05 │  sonra akışında en son bir şey olan
│       ✓✓ Sen: Demirci neden yok?         │  kendi mesajın: tik + "Sen:"
│ (🏢)  Bahçelievler Konutları        Dün  │
│       Ahmet: 📷 Beton döküldü         ②  │  okunmadı rozeti
│  Tamamlanan 2 şantiye                  › │
└──────────────────────────────────────────┘
```

| Parça | Karar |
|---|---|
| Sıralama | Sabitlenenler üstte (son sabitlenen önde), sonra akışında en son bir şey olan (mesaj ya da "şantiyeyi kurdu" satırı). "Katıldı" ve "çıkardı" satırları sayılmaz: her şantiyeye birden düşerler; sayılsalardı bütün şantiyeler aynı anda en üste zıplar, her önizleme aynı cümle olurdu. |
| ＋ | Yalnızca patronda; WhatsApp'taki "Yeni sohbet" gibi tek kapı: **Yeni şantiye** · **Kişi ekle** (firmanın bağlantısı; bkz. Kişiler). |
| Soldaki resim | Patronun koyduğu şantiye fotoğrafı (WhatsApp'taki grup fotoğrafı); konmamışsa gri baret. |
| Zaman | WhatsApp'ın aynısı: bugün `13:05`, dün `Dün`, bu hafta gün adı, daha eskisi `12.09.2026`. |
| Önizleme | Akıştaki son şey. Kendi mesajın `✓✓ Sen: …`; dosya simgeyle (`📷 Fotoğraf`, `🎤 Sesli not`, `📄 Proje.pdf`). Hiç mesajı olmayan şantiyede son sistem satırı ("Patron, Musa'yı ekledi"). |
| Tikler | Kendi mesajında: 🕓 henüz gitmedi, ✓ gitti, mavi ✓✓ şantiyedeki herkes gördü. Gri ✓✓ (telefonuna ulaştı) bilgisi bizde yok. |
| Okunmadı rozeti | Marka lacivertidir. Kırmızı hiçbir yerde kullanılmaz. |
| Arama | Üstte kutu: adı uyan şantiyeler ve yazısında aranan geçen mesajlar. Mesaja dokununca şantiye o mesajda açılır, mesaj kısa süre sarı yanar. |
| Uzun basma | Yalnızca 📌 Sabitle (masaüstünde satırın ⌄'i). Şantiyeyi tamamlamak nadirdir ve herkesi etkiler; bilgi ekranındaki Düzenle'de kalır. |
| Tamamlananlar | Listenin sonunda "Tamamlanan N şantiye ›". |
| Boş liste | Patron "İlk şantiyeni kur" düğmesini görür. |

## Ekran 2 — Şantiye sayfası (WhatsApp'ta bir grubun içi)

```
┌──────────────────────────────────────┐
│ ‹ (🏢) NAMIK KEMAL PLAZA     📞   ⋮ │  dokununca bilgi · ⋮: bilgi, bu şantiyede ara
│        Musa, Sen                     │
│ 📌 Demirci gelmedi              1/2 │  sabit mesaj şeridi
├──────────────────────────────────────┤
│   · Patron şantiyeyi kurdu ·         │  sistem satırları, olduğu anın yerinde
│   · Patron, Musa'yı ekledi ·         │
│             — DÜN —                  │
│  [ baloncuk ]                        │  en eski üstte
│  ─── buradan aşağısı yeni ───        │
│                    [ baloncuk ✓✓ ]   │  kendi mesajın sağda
│                    [ bekleyen 🕓 ]   │  henüz gitmemiş
├──────────────────────────────────────┤
│ [＋] Bir not yaz…          📷   🎤  │
└──────────────────────────────────────┘
```

| Parça | Karar |
|---|---|
| Akış yönü | En eski üstte, en yenisi altta; sayfa açılınca dibe iner. Yukarı kaydırınca geçmiş yüklenir, ekran zıplamaz. |
| Başlık | Şantiye fotoğrafı, ad, altında katılımcıların ilk adları ve "Sen". Başlığa dokununca bilgi açılır; sağda 📞 ve ⋮ (Şantiye bilgisi, Bu şantiyede ara). Altında Sohbet · Saha sekmeleri. |
| 📞 | 25 Eylül'de kararlaştırıldı. Aranabilecekler: patron ve katılımcılar, numarası olanlar, kişinin kendisi hariç (şef patronu da buradan arar). Tek kişi varsa doğrudan onu arar (dayının en sık işi tek dokunuş); birden fazlaysa alttan liste açılır: ad, rol, numara. Önceden "telefonu olan ilk katılımcı" aranıyordu: ikinci şef buradan hiç aranamıyordu. |
| Sistem satırları | "Patron şantiyeyi kurdu", "Mahmut davet bağlantısıyla katıldı", "Patron, Mahmut'u çıkardı" (WhatsApp gibi). Katılma ve çıkarma firmanın her şantiyesine düşer: herkes her şantiyededir. Şantiye başına üyelik varken yazılmış eski satırlar ("Patron, Musa'yı ekledi", "Musa eklendi") olduğu gibi durur. |
| Gönderme çubuğu | `[＋] [yazı] 📷 🎤` (iPhone WhatsApp). ＋: Fotoğraf ve video · Belge (PDF). 📷 doğrudan kamera. Yazı varken 📷 ve 🎤 yerine ➤. Masaüstünde `[＋] [yazı 😊] 🎤`. |
| Sesli not | Basılı tut, bırak → gider. Basılıyken yukarı kaydırınca kilitlenir: 🗑 ya da ➤. Dinlerken 1× / 1,5× / 2×. |
| Fotoğraflar | Baloncuk boyunda (ekranın ~3/4'ü, en çok 320px). Çok fotoğraf 2×2 albüm; dörtten fazlasında "+N". Dokununca tam ekran. |
| Mesaj menüsü | Uzun bas (masaüstünde ⋯): Yanıtla, Kopyala, İlet, Sabitle, Sahaya ekle (bkz. Saha sekmesi), Bilgi (yalnızca kendi mesajında), Düzelt, Sil. |
| Yanıtla | Çubuğun üstünde alıntı (✕ ile vazgeç); baloncukta alıntı şeridi, dokununca o mesaja gidilir. |
| İlet | Şantiye seçilir; mesaj iletenin adıyla, "İletildi" etiketiyle gider, dosyaları kopyalanır. |
| Sabit mesaj | Herkes sabitler, şantiye başına en fazla üç, kaldırılana kadar durur; yalnızca şantiyenin içinde (listeye yansımaz). |
| Bilgi | Kim, ne zaman gördü; kim henüz görmedi. |
| Alt sekmeler | Şantiyenin içinde herkes için gizlenir (WhatsApp'ta sohbetin içi gibi). |

**"En yeni üstte" kararı geri alındı (4. tur).** Gerekçesi "bu bir sohbet değil, defter"di; ama kabuğu
WhatsApp yapıp içeriyi ters akıtmak, alışkanlığı tam da en çok kullanılan yerde bozuyordu. Şantiye günü
kronolojiktir: sabah demir geldi, öğlen beton döküldü. Hikâye baştan okunur. Defter ihtiyacını artık
Saha sekmesi karşılar (aşağıda): sohbet sohbet olarak kalır.

## Saha sekmesi (şantiyenin görsel günlüğü)

25 Eylül'de kararlaştırıldı. Şantiye başlığının altında iki sekme vardır: **Sohbet · Saha**. Adresi
`/santiyeler/:id/saha`; sekme değişimi geçmişe yazılmaz (geri tuşu şantiyeden çıkarır). Saha bir pano değil,
bir günlüktür: kutucuk, sayaç ve ayrı bölümler yoktur; tek dikey akış vardır.

```
┌──────────────────────────────────────────────┐
│ ‹ (🏢) NAMIK KEMAL PLAZA            📞   ⋮  │
│        Sohbet      [Saha]                    │
├──────────────────────────────────────────────┤
│ [   son saha fotoğrafı, geniş             ]  │  Bugün şantiyede
│ [   Son güncelleme 17:42 · Musa           ]  │  4 saha güncellemesi
│ Bugün                                        │
│ 17:42  ✓  5. kat kolon kalıpları tamamlandı ⋯│  yeşil ✓
│        │  Musa   [foto] [foto]               │  kanıtı kendi satırında
│ 16:35  !  Beton pompası henüz gelmedi       ⋯│  sorun: satır hafif sarı
│ 15:10  ↻  Demir bağlama devam ediyor        ⋯│  mavi ↻
│ 12:45  📦 Tuğla teslimatı geldi             ⋯│  kahve 📦
│ ── 23 EYLÜL SALI · 6 GÜNCELLEME ──────────── │  önceki güne geçiş
├──────────────────────────────────────────────┤
│ [＋] Bugün şantiyede ne oldu?     📷   🎤   │
└──────────────────────────────────────────────┘
```

| Parça | Karar |
|---|---|
| Sıra | Günlük gibi en yeni üstte; aşağı kaydırdıkça önceki günler. Günlerin arası ince çizgi: "23 Eylül Salı · 6 güncelleme" (günün hepsi yüklenmediyse yalnızca tarih; yanlış sayı gösterilmez). |
| Kapak | En son çekilen saha fotoğrafı (ya da videonun kapağı), yoksa şantiye fotoğrafı, o da yoksa lacivert ızgara. Üstünde "Bugün şantiyede", "Son güncelleme 17:42 · Musa", "4 saha güncellemesi". Bugün bir şey yoksa "Şantiyede son durum" ve sayı yok (İlke 3). Hiç güncelleme yoksa kapak da yok. Ayrı bir "Son durum" kartı yoktur: akışın ilk satırları zaten son durumdur. |
| Satır | Saat · eksendeki simge · yazı (başlık odur) · yazan · altında fotoğraf, video kapağı, sesli not. Fotoğraflar ayrı bir galeride değil, ilgili güncellemenin içindedir: ne olduğu ve kanıtı aynı anda görünür. |
| Simge | ✓ yapıldı, ↻ devam ediyor, 📦 teslimat, gri nokta düz not. **Kullanıcıya tür seçtirilmez**: adam zaten "Tuğla geldi", "Beton bitti" diye yazıyor; simge yazının kendisinden okunur ("tamamlandı", "devam", "geldi"; tam kelime, "gelmedi" sayılmaz). Anlamı yazı taşır, simge göz gezdirmeyi kolaylaştırır (İlke 2). |
| Sorun | Tek özel tür. ＋ → **Sorun bildir**: çubuk sararır, "⚠ Sorun" (✕ ile vazgeç). Akışta satır hafif sarı zemin alır; patrona bildirim gider. Yazarı ⋯'dan "Sorun olarak işaretle / Sorun işaretini kaldır" der. |
| Gönderme | Mesaj atmak kadar kolay: `[＋] [yazı] 📷 🎤`, yazı ya da fotoğraf varken 🎤 yerine ➤. ＋: Fotoğraf / Video · Sorun bildir. Seçilen fotoğraflar çubukta küçük kareler olarak durur (✕ ile çıkar); ayrı pencere, form, etiket, ikinci açıklama yoktur. Sesli not sohbetteki gibi basılı tut. Gidince akışın en üstüne düşer; internet yoksa 🕓 ile bekler. |
| ⋯ menüsü | Sohbette göster · Kopyala · Sorun işareti · Düzelt · Sahadan çıkar · Sil. Yanıtla, İlet, Sabitle sohbetin işleridir; "Sohbette göster" Sohbet sekmesine geçip o mesajı sarı yakar. "Sahadan çıkar" mesajı silmez, sohbette kalır. |
| Sohbetle ilişkisi | Saha güncellemesi ayrı bir kayıt değil, işaretli bir gönderidir: **sohbette de görünür**, baloncuğun üstünde "📍 Saha" (sorunsa "⚠ Sorun") yazar. Listede önizleme, okunmadı rozeti, arama ve tikler olduğu gibi çalışır; patron hiçbir şeyi kaçırmaz; güncellemenin konuşması (Yanıtla) sohbette olur. WhatsApp'taki "Medya" görünümü gibi: aynı sohbetin süzülmüş hâli. Yansıma tek yönlüdür: sohbete atılan mesaj kendiliğinden Saha'ya girmez (ekran görüntüsü, fatura fotoğrafı günlüğe düşmesin). |
| Sahaya ekle | Şef alışkanlıkla "Beton döküldü" + fotoğrafı sohbete atar. Mesaja uzun bas (masaüstünde ⋯) → **Sahaya ekle**: mesaj atıldığı zamandaki yerine, yazarıyla günlüğe girer. Sabitleme gibi şantiyeyi gören herkes ekler ve çıkarır (şef de patron da). Otomatik ekleme (her fotoğraflı mesaj) konuşuldu, reddedildi: günlüğe çöp girer. |
| İki taslak | Sohbet ve Saha çubuğunun taslakları ayrıdır: yarım yazılan mesaj sekme değişince kaybolmaz. |

## Şantiye bilgisi (WhatsApp'taki grup bilgisi)

Başlığa dokununca: telefonda alttan açılır, masaüstünde akışın sağında panel olur (akış kararmaz).

| Parça | Karar |
|---|---|
| Fotoğraf | En üstte büyük; patron değiştirir ya da kaldırır. |
| Künye | Ad, "Şantiye · N katılımcı", adres (dokununca harita), patronda Düzenle (ad, adres, tamamlandı). |
| Medya ve belgeler | "Medya ve belgeler · N ›" ve son fotoğrafların şeridi. İçeride Medya ve Belgeler sekmeleri, aylara ayrılmış; şantiyenin bütün geçmişi. |
| Görevler | Görevler satırı (Musa'nın özelliği; ürün kararı Musa'yla konuşulacak). |
| Katılımcılar | "Katılımcılar · N": firmanın herkesi (her şantiyede aynı liste); en üstte "Sen", sonra patronlar, sonra şefler; yanında rolü (Patron / Şef) ve numarası (`0552 813 78 50`). Durum yazısı yok. Patronda "＋ Kişi ekle" (firmanın bağlantısı) ve kişiye dokununca menü (bkz. Kişiler). |

"Sorumlu" kelimesi kullanılmaz: şantiyenin "sorumlusu" yoktur, herkes her şantiyededir. Kişi şantiyenin
**katılımcısıdır**, firmadaki rolü **Patron** ya da **Şef**'tir.

## Ekran 3 — Şantiye kurma (WhatsApp'ta grup kurma)

Listenin başlığındaki ＋ (yalnızca patron), tek adım: yuvarlak fotoğraf (isteğe bağlı), şantiye adı
(zorunlu), adres (isteğe bağlı). Altında "Firmadaki herkes bu şantiyeyi görür ve yazabilir." yazar. Kişi
seçilmez. Oluşturunca şantiyenin içine düşülür; akışın başında "Patron şantiyeyi kurdu" yazar.

## Kişiler: tek bağlantı, herkes her şantiyede

25 Eylül'de kararlaştırıldı; 24 Eylül'deki "şantiye başına davet bağlantısı" modelinin yerini aldı. Gerçek
şu: firmanın 4 kişilik bir patron ekibi ve her gün değişen, her şantiyeye giden çalışanları var. "A
şantiyesinde 3 kişi, B'de 5 kişi" diye bir dağılım yok. Önceki modelde 5 işçiye 5 ayrı, tek kişilik, 7 günlük
link gerekiyordu; Fırat'ı en çok yoran buydu.

> **Firmanın tek bir bağlantısı vardır.** Patron onu WhatsApp grubuna atar. Tıklayan adını ve numarasını yazar,
> katılır; **bütün şantiyeleri görür ve hepsine yazar**, patron çıkarana kadar.

**Kimsenin durumu yazmaz.** "Henüz girmedi", "son görülme", "linki açmadı" bizim teknik derdimizdir, dayının
değil. Biri giremezse gerçek hayattaki gibi arar, patron ona giriş linki gönderir.

| İş | Nerede, nasıl |
|---|---|
| Yeni kişi | Şantiyeler listesinin başındaki **＋ → Kişi ekle** (şantiye bilgisindeki Katılımcılar'da da "＋ Kişi ekle" durur): bağlantı, "WhatsApp'ta paylaş" ve "Kopyala". WhatsApp grup ya da kişi seçtirerek açılır. Bağlantıyı açan "Şantiye ekibine katıl · Kızılkan İnşaat" görür, **adını ve numarasını kendisi yazar**, Katıl'a basar, şantiyeler listesine düşer; her şantiyenin akışına "Mahmut davet bağlantısıyla katıldı" yazılır. Patron hiç numara yazmaz. 25 Eylül'de bağlantı şantiye bilgisinin içinden listenin ＋'sına da çıkarıldı: kişi eklemek bir şantiyenin değil, firmanın işidir. |
| Bağlantı | Firma başına tek, **süresiz**, çok kullanımlık (WhatsApp grup bağlantısı gibi). Katılan kişinin erişimi de süresizdir; oturum her açışta yenilenir. Yanlış ellere geçerse **Bağlantıyı sıfırla**: eskisi çalışmaz, katılmış olanlar içeride kalır. |
| Zaten içerideki | Bu telefonda firmadan biri zaten içerideyse bağlantı doğrudan şantiyelere götürür. |
| Kişiye dokununca (patron) | Ara · Giriş linki gönder (telefonunu değiştirirse ya da "giremiyorum" derse; WhatsApp doğrudan onun sohbetinde açılır) · Düzenle (ad ve numara) · **Patron yap** / **Şef yap** · **Firmadan çıkar**. Kendi satırında yalnızca "Adımı ve numaramı düzenle" (patronun numarası buradan girilir; şeflerin 📞 listesinde görünmesi için). |
| Patron | Birden fazla olabilir; bir patron başkasını "Patron yap"la patron yapar. Patron şantiye kurar, kişileri düzeltir, patron yapar ve çıkarır, bağlantıyı paylaşır ve sıfırlar. Kendini çıkaramaz, kendi rolünü değiştiremez: firmada her zaman bir patron kalır. |
| Firmadan çıkarmak | Hiçbir şantiyeyi göremez, uygulamaya giremez, her cihazda oturumu kapanır; yazdıkları yerinde kalır. Her şantiyenin akışına "Patron, Mahmut'u çıkardı" yazılır. Aynı numarayla bağlantıdan yeniden katılırsa eski kaydı açılır. |
| Numara | Firmada tekildir; "0532…", "+90 532…" aynı numaradır. Kayıtlı bir numarayla bağlantıdan yeni hesap açılmaz (kimse başkasının numarasını yazıp onun yerine giremesin): "Bu numara zaten kayıtlı. Patronundan giriş linki iste." |
| İsim | Kaydederken Türkçe kurallarla düzeltilir: "FIRAT ATALAY" → "Fırat Atalay"; bilerek karışık yazılmış ad (ör. "McAllister") kalır. Kural gelmeden önce kaydedilmiş adlar da 25 Eylül'de bir kerelik aynı kuralla düzeltildi ("musa" → "Musa"). |

Kaldırılanlar: şantiye başına davet bağlantısı, tek kişilik ve 7 günlük davetler, "Firmadan ekle" listesi,
şantiye kurarken katılımcı seçmek, boş şantiyedeki "WhatsApp'tan davet et" düğmesi, "şantiyeden çıkar" ve
şantiyenin sorumlusuna 17:00 hatırlatması (herkes her şantiyede olunca her işçiye her sessiz şantiye için
bildirim giderdi). Geçmişteki "Patron, Musa'yı ekledi" satırları akışta olduğu gibi durur.

Telefon rehberinden doğrudan seçmek (Contact Picker) konuşuldu: tarayıcıda yalnızca Android'de çalışıyor,
dayının iPhone'unda çalışmıyor. Bağlantı bunu gereksiz kılar: rehber işini WhatsApp yapar.

## Masaüstü: solda liste, sağda şantiye (WhatsApp Masaüstü)

| Parça | Karar |
|---|---|
| Sol menü | Gmail'deki gibi en üstte ☰: açıkken ikonların yanında adları (🏗 Şantiyeler), altta kişinin adı ve rolü; kapalıyken ince ikon şeridi (üstüne gelince adı). İlk açılışta açık gelir (İlke 2: ekranda ne varsa yazar), kapatan için tercih hatırlanır. Seçili öğe baret sarısı zeminde lacivert. En altta kişinin kendisi: Hesabım. 24 Eylül'de "hep ince şerit" kararı bu yüzden geri alındı: ikonların adı yazmıyordu. |
| Liste | Telefondaki satırın aynısı; başlıkta firma adı ve ＋ (Yeni şantiye · Kişi ekle), altında arama. Satırın üstüne gelince ⌄: Sabitle. |
| Sağ taraf | Seçili şantiye; adres `/santiyeler/:id`, bağlantı paylaşılabilir. Hiçbiri seçili değilken sade karşılama (kimse istemeden okunmuş sayılmaz). |
| Bilgi ve arama | Akışın sağında panel; ikisi aynı yeri paylaşır. |
| Şantiye başlığı | `(📷) Ad / Musa, Ahmet, Sen … 🔍  📞 Musa  ⋮`. 🔍 (Bu şantiyede ara) masaüstünde dışarıdadır (yer bol, WhatsApp Masaüstü gibi); telefonda ⋮'de kalır. 📞 masaüstünde aramayı denemez (bilgisayar telefon edemez): tek kişide "📞 Musa", çok kişide "📞 Ara ▾"; basınca ad · rol · numara ve Kopyala. Sohbet · Saha sekmeleri başlık satırına çıkmaz, altında ince (40px) satırda durur: bilgi paneli açıkken başlığa ancak ad ve düğmeler sığıyor. |

## Ekran genişlikleri

Kabuk açılışta bir kez seçilir; kabuğun içi her genişliğe kendiliğinden uyar.

| Ekran | Kabuk | Düzen |
|---|---|---|
| Telefon (≤ 768px) | Mobil (Vant) | Tam genişlik |
| Dokunmatik tablet (≤ 1024px) | Mobil | Sayfa, başlık, gönderme çubuğu ve alttan açılan pencereler 640px'lik ortalı sütunda |
| Bilgisayar, dar pencere (< 1200px) | Masaüstü (Element Plus) | Sol menü ince (72px) başlar; ☰ onu içeriğin üstüne kaydırır (arkası kararır; seçince, boşluğa tıklayınca ya da Esc ile kapanır, kayıtlı tercih değişmez). Liste 280-360px arasında incelir |
| Bilgisayar, geniş | Masaüstü | Sol menü açıkken 256px (içerik yana kayar), kapalıyken 72px. Liste 360px, akış 760px'te ortalı; bilgi paneli 320-400px |

- Eşikler tek yerdedir: `core/platform/breakpoints.ts`. CSS'e kırılım noktası yazılmaz; genişlikler
  `tokens.css`'teki `--layout-*` ölçüleriyle (tavanlı `max-width`, `clamp`) verilir.
- Ekran yüksekliği `100dvh`: tablette tarayıcı çubuğu açılınca gönderme çubuğu ekranın altında kaybolmaz.
- "Mobil/masaüstü görünüme geç" tercihi eşikten önce gelir. Tablet döndürülünce kabuk değişmez: kabuk
  değişimi sayfayı yeniler, yarım yazılmış not kaybolurdu.

## Navigasyon

| | Patron | Şef |
|---|---|---|
| 1 | Şantiyeler | Şantiyeler (tek şantiyesi olsa da liste) |
| 2 | Ben | Ben |

Ayrı bir Ekip ekranı yoktur: kişiler firmanın bağlantısıyla gelir, şantiye bilgisindeki Katılımcılar'dan
yönetilir (bkz. Kişiler). Şantiye ayarları da
ayrı bir ekran değildir: ekleme listedeki ＋, düzenleme şantiye bilgisinde (başlığa dokununca).

## Mesaj silme ve düzeltme

| Kural | Karar |
|---|---|
| Kim silebilir | Yazar kendi gönderisini, patron her gönderiyi |
| Kim düzeltebilir | Yalnızca yazar: başkasının ağzından yazılmaz |
| Ne düzeltilir | Yalnızca yazı. Fotoğraf yanlışsa gönderi silinip yeniden atılır. |
| Süre | Sınır yok: her zaman düzeltilir ve silinir. |
| İz | "Bu gönderi silindi · Patron · 22 Eylül 14:20"; düzeltilende saatin yanında "düzenlendi" (İlke 6). Düzeltmeden önceki metin saklanmaz (WhatsApp gibi). |
| Silinen içerik | Yazı ve dosyalar gerçekten silinir; satır iz olarak kalır; sabitse sabitlikten düşer. |
| Nasıl | Mobilde uzun basınca alttan menü, masaüstünde baloncuğun köşesinde `⋯` |

## Askıya alınanlar

**Sorunlar modülü (4. turda arayüzden kaldırıldı).** Menü, sorun kuyruğu, çözülenler arşivi, kırmızı
etiketler, "sorun olarak işaretle" anahtarı ve "Çözüldü" düğmeleri arayüzden çıktı. Gerekçe: aynı gönderi
iki ayrı yerde iki ayrı kılıkta yaşıyordu ve ekranın öğrenilmesi gereken kavram sayısını ikiye katlıyordu.
Takibin yeni kılığı 23 Eylül'de kararlaştırıldı: **sabit mesaj** (WhatsApp'taki gibi, şantiyenin içinde,
kaldırılana kadar). Listede kırmızı önizleme istenmedi. Backend'e dokunulmadı: `posts.issue`, çözüm kaydı, bildirim ve uçlar
yerinde duruyor, veri kaybı yok.

**Bildirimler.** Push'un tek tetikleyicisi sorun bildirimiydi; sorun arayüzden kalkınca bildirim de
fiilen sessizleşti. Ana ekrandaki "bildirim al" hatırlatması kaldırıldı, anahtar "Ben"de kaldı. Neyin
bildirim göndereceği (ör. akşam 17:00'de rapor göndermemiş şefe hatırlatma) ayrıca kararlaştırılacak.
25 Eylül'den beri Saha'daki "Sorun bildir" yine bu bildirimi tetikler (sorun kuyruğu ve "Çözüldü" geri gelmedi).

## Sonraki turda konuşulacaklar

- **Görevler** (Musa): şantiye bilgisinde duruyor; WhatsApp'ta karşılığı olmayan yeni bir kavram (İlke 1),
  kalıp kalmayacağı konuşulacak.
- İlk açılış: sıfır şantiye, sıfır kişiyken patronun ilk on dakikası.
