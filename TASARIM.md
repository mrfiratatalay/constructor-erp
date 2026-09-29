# Kızılkan Şantiye — Ekran Tasarımı Kararları

22 Eylül 2026'da kararlaştırıldı, aynı gün dördüncü turda sadeleştirildi; 23 Eylül'de Şantiyeler modülü
ayrıntı ayrıntı yeniden kararlaştırıldı (telefon önce: patron şantiyelere telefondan bakar), 24-25 Eylül'de kişiler, 28 Eylül'de yoklama, roller ve malzemeler. Ekran düzeniyle
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

## Yoklama (firmanın puantajı)

28 Eylül'de baştan kararlaştırıldı (Fırat); önceki iki denemenin (şantiye şantiye şef penceresi, sohbette
"Yoklamaya Katıl") yerini aldı, bkz. Askıya alınanlar. Yoklamanın tek işi **ay sonunda "kime kaç gün, kaç saat
mesai" sorusunun kavgasız cevabıdır**: o günün gerçeğini o gün, sahada olan şef yazar.

> **"Şef her sabah defteri dolduruyor, sen ay sonunda puantajı görüyorsun."**

Tanıdık kalıp burada WhatsApp değil, şefin kâğıt **puantaj defteridir**: satırda kişi, sütunda gün. Görsel
referanslar ve neyin neden alındığı: `docs/referanslar/yoklama/`.

| Karar | Neden |
|---|---|
| **Firmanın, şantiyenin değil.** Menüde Şantiyeler'in yanında **Yoklama**; sohbette yoklama yoktur. | Çalışanlar her gün başka şantiyeye gider; puantaj kişinindir. |
| **Kim görür:** patron ve şef. Çalışan yoklamada sayılır; menüsünde Yoklama yerine kendi ayı, **Puantajım** vardır. | Roller: bkz. Kişiler. |
| **Kim sayılır:** Personel, kişi kişi (uygulamadaki çalışanlar kendiliğinden, uygulaması olmayanlar adıyla eklenir) ve Taşeron ekipler, ekip olarak ("Demirci · Hasan Usta"). Patron ve şef sayılmaz. | Dayı demircinin kaç adamla geldiğine değil, ekibin gelip gelmediğine bakar; ekip, ekip başının işidir. |
| **Durumlar:** Geldi · Yarım gün · Gelmedi · İzinli; ekipte yalnızca Geldi · Gelmedi. **İşaretlenmedi** ayrı durumdur, "Gelmedi" değildir. | Şef henüz bakmamış olabilir; kaydı olmayan gün yazılmaz. |
| **Mesai** bir durum değil, Geldi gününe eklenen saattir: yarım saatlik adımla, en çok 16. Ekibe mesai yazılmaz. | "Yarım gün + mesai" kendiyle çelişir. |
| **Not** her günde isteğe bağlı (200 harf). | Ay sonunda patron nedenini görür. |
| **Kayıt anında.** "Kaydet" ya da "Tamamla" yoktur; son satır işaretlenince yoklama kendiliğinden tamamdır. Her işaretin yanında kim, ne zaman. | Ayrı bir "tamamlandı" durumu listeyle çelişebilirdi. |
| **Hangi gün:** şef yalnızca bugünü, patron geçmişi de düzeltir; ileri gün işaretlenmez. Sunucu da reddeder. | Şef geçmişe dönüp puantajla oynayamaz. |

**Bugün sekmesi, şefin sabahı.** Menüden girince doğrudan bugün açılır.

```
Yoklama · 28 Eylül Pazartesi                              [+ Kişi ya da ekip ekle]
 Bugün | Puantaj
┌ Geldi ┐ ┌ Gelmedi ┐ ┌ İzinli ┐ ┌ İşaretlenmedi ┐
│ 8     │ │ 1       │ │ 1      │ │ 3             │
[Geldi · 8] [Yarım gün · 1] [Gelmedi · 1] [İzinli · 1] [İşaretlenmedi · 3]     🔍 Ara
── Personel · 12 ──────────────────────────────────────────────────────────────
☐ (AY) Ali Usta   ✓ Geldi   ✓ Geldi   Geldi +2 s   Bugün [Geldi|Yarım gün|Gelmedi|İzinli] ⋯
       Kalıpçı
── Taşeron ekipler · 2 ────────────────────────────────────────────────────────
☐ [▣] Demirci     ✓ Geldi   ✕ Gelmedi  ✓ Geldi     Bugün [Geldi|Gelmedi] ⋯
       Ekip başı · Hasan Usta
```

| Parça | Karar |
|---|---|
| İlke (28 Eylül, masaüstü baştan) | Hiçbir şey gizli değil (tıklanan şey tıklanır görünür); satır işaretlenince şekil değiştirmez; satır kâğıt puantajın bir satırı gibi bir form satırıdır; seçim araçları sayfayı itmez. Önceki deneme (tıklanabilir kartlar, işaretlenince etikete küçülen satır, araya giren toplu çubuk) fark edilmedi, boşluk bıraktı, sayfayı bozdu. |
| Özet | Yalnızca gösterge, tıklanmaz. Solda geniş **Bugünün yoklaması** kartı: halka kaçının işaretlendiğini gösterir ("2/6"), yanında kaç kişinin beklediği; bitince yeşil "Yoklama tamam". Yanında dört eşit durum kartı: büyük sayı ve o durumun listedeki payı (kendi renginde ince çubuk). Raporda sayı kartı yoktur (İlke 4). |
| Süzgeç | Listenin üstünde sekme görünüşlü tek kontrol (`el-segmented`): **Tümü · Bekleyen · Geldi · Yarım gün · Gelmedi · İzinli**, her birinde sayısı ve dairesi. Sabahın asıl süzgeci "Bekleyen". **Arama sayfa başlığında** (ad, görev, ekip başı), iki sekmeyi de süzer. |
| Satır | Avatar, kalın ad, altında gri görev (ekipte "Ekip başı · Hasan Usta"). **Son günler** tek sütunda yan yana küçük daireler (yalnızca birinin işaretlendiği günler; kaydı yoksa gri halka; üstüne gelince gün ve durum, tıklayınca o gün açılır). **Bugün**: düğme grubu hep açık, seçili olan kendi renginde dolu, tek tıkla değişir. **Mesai**: Geldi gününde satırda yarım saatlik sayı kutusu, başka durumda "—". **Not**: satırda gerçek yazı kutusu, Enter'la ya da çıkınca kaydedilir. İşaretsiz satırda mesai ve not boş (göz düğmelere gider). Bir alan değişince öbürleri yerinde kalır. En sağda sabit ⋯: Ayın takvimi · Bugünün işaretini kaldır. 1470 px dizüstünde satırın tamamı kaydırmadan sığar. |
| Toplu işaretleme | Yalnızca işaretlenmemiş satırlar seçilebilir ("tümünü seç" kalanları alır; bir "Gelmedi"yi ezmez, seçiliyken tek tek işaretlenen satır seçimden düşer). Seçili satırın zemini hafif lacivert. Seçim varken **alttan şerit** kayar (`el-drawer`, arkayı kilitlemez, sayfayı itmez; listenin dibinde onun kadar pay kalır): "4 seçildi:" ve adlar (× ile çıkar), "Bugün:" ve kendi renginde büyük düğmeler, "Vazgeç". Akış: Bekleyen → tümünü seç → Geldi. Seçimde ekip varsa yalnızca Geldi · Gelmedi. |
| Telefonda | Başlığın altında sabit Bugün · Puantaj sekmeleri. Halka kaçının işaretlendiğini gösterir ("10/15", bitince yeşil), altında renkli sayılar (süzgeç: "○ 5 Kalan"). Arama. Sağ üstte **Seç**: toplu işaretleme, alttaki çubuk sekme çubuğunun üstüne biner. Satıra dokununca alttan büyük renkli düğmeler (tek dokunuş); altında "Mesai ve not", "Ayın takvimi", "İşaretlemeyi kaldır". Sağ üstte **＋** kişi ya da ekip ekler. |

**Puantaj sekmesi, ay sonu.** Ay seçici takvim uygulamalarının kalıbıyla: ‹ › ve yanında "Eylül 2026 ▾" (son on
iki ay; gelecek ay yok; ay adreste `?ay=2026-09`, sekme `?sekme=puantaj`), işaretlerin açıklaması, patrona **Excel
indir**. Personel cetveli ızgara çizgili ve **rahat boyda** (sıkı boy dizüstünde "çok ufak" kaldı, 28 Eylül): gün
sütunları esnek, geniş ekranda kartın tamamına yayılır; sığmayan ekranda cetvel açılınca bugüne kayar. Bugünün
başlığı lacivert, gelecek günler ve Pazar soluk. Hücrede kısa
işaret (✓ ½ ✕ İ dairesi; mesai köşesinde nokta, saati üstüne gelince); sağda sabit **Çalıştığı gün** (yarım gün yarım
sayılır, yevmiye buna göre), **Mesai**, **Gelmedi** ve **İzinli** (başlıkları daire); en altta ayın toplamı. Taşeron
ekipler cetvelinde **Geldiği gün** ve Gelmedi. **Bir hücreye tıklayınca kişinin ayı o gün seçili açılır** (adres
`?gun=2026-09-09`); Bugün cetvelindeki geçmiş gün hücreleri de öyle. Telefonda cetvel yerine liste: "Ali Usta ·
22,5 gün", altında mesai, yarım gün, gelmedi, izinli ve ince bir ay çubuğu (çalıştığı günün ayın bugüne kadarki iş
günlerine oranı, Pazar hariç).

**Kişinin ya da ekibin ayı.** Ada dokununca: masaüstünde sağdan geniş panel (liste yerinde kalır; üstte toplamlar
"19 gün", altta solda sıkı takvim "‹ Eylül 2026 ›", sağda seçili günün ayrıntısı, kaydırmadan), telefonda ayrı sayfa
(`/yoklama/kisi/:entryId`). Toplamlar, takvim (her günde kısa işaret; telefonda Vant takvimi, ‹ › ile ay değişir,
altında "Ayın özeti" aynı dairelerle ve takvimin açıklaması da odur), güne dokununca ayrıntı: durum (satırdaki
renkli düğmelerin aynısı), mesai (yalnızca Geldi gününde) ve not (durum seçilince; öncesinde kilitli boş kutu yerine
"Durumu seçince mesai ve not yazılır") ve "Kaydedildi · 08:17 · Patron" izi. Ayrı bir kayıt geçmişi listesi yoktur
(28 Eylül'de denendi, kaldırıldı): kimin işaretlediği günün ayrıntısında yazar. Uygulaması olmayan kişi ya da ekip buradan düzeltilir
ve **listeden çıkarılır** (geçmiş günleri puantajda kalır). Uygulamadaki çalışanın yalnızca görevi düzeltilir;
listeden Katılımcılar'dan çıkar (firmadan çıkar ya da şef yap).

**Puantajım (çalışanın sekmesi, 28 Eylül).** Hikâyenin eksik halkası: kayıt yalnızca şefte ve patronda dursa
çalışan ay sonunda yine "ben 24 gün geldim" der. Kendi ayını her gün görürse itiraz o gün, şef hatırlarken çıkar.
Menüde Şantiyeler'in yanında (telefonda Şantiyeler · Puantajım · Ben): bugünkü kaydı, ayın toplamları (çalıştığı
gün, mesai, gelmedi, izinli), takvim. Güne dokununca durum, mesai ve **kimin ne zaman işaretlediği**; telefonda
**Ara** ile o kişiyi doğrudan arar, masaüstünde numarası yazar ve kopyalanır. İtiraz için ayrı bir düğme ya da
süreç yoktur, gerçek hayattaki gibi aranır. Yalnızca kendi kaydı görünür; başkasınınki, şefin notu (not şefle
patron arasındadır, çalışan okuyacağını bilse şef yazmazdı) ve tutar görünmez. Kayıt işaretlendiği anda görünür.
Uygulaması olmayan kişi ve taşeron ekip görmez; patron ve şef yoklamada sayılmaz, bu sekmeleri yoktur.

**Excel** (`puantaj-2026-09.xlsx`): "Personel" ve "Ekipler" cetvelleri (G / Y / X / İ, mesaiyle "G+2", ekrandaki
renklerle, sağda toplamlar) ve gün gün tam liste "Kayıtlar" (tür, görev, durum, mesai, not, işaretleyen, saat).

**Görünüş (28 Eylül, estetik turu).** Masaüstü yalnızca Element Plus, telefon yalnızca Vant bileşenleriyle kurulur;
bu modülde elle CSS yazılmaz (boşluk ve genişlik de bileşenlerin kendi seçenekleriyle verilir: `title-style`,
`badge-style`, `el-space` genişliği). Renk
yalnızca bileşenin kendi tonundan gelir; durum tonları iki kütüphaneye de bizim koyu durum renklerimizle bağlıdır
(`theme.css`): Geldi yeşil, Yarım gün sarı-turuncu, Gelmedi kırmızı, İzinli mavi (marka rengi), İşaretlenmedi gri.
İşaretin **tek dili, iki boyu** vardır:

| Boy | Nerede | Nasıl |
|---|---|---|
| Kısa (`MarkDot`) | Cetvel, takvim, açıklama, sayı kartları | Renkli dolu daire, içinde beyaz ✓ ½ ✕ İ (kaydı yoksa gri ○). Hep aynı genişlik: göz ritmi yakalar. Mesai köşede lacivert nokta. |
| Uzun (`MarkTag`) | Tek günün gösterildiği yer: bugünün sütunu, telefon satırı, gün ayrıntısı | Açık zemin, koyu yazı: "✓ Geldi · +2 s", "○ İşaretlenmedi". |

Durum seçimi her yerde aynı: yan yana (telefonda 2×2 büyük) düğmeler, seçili olan kendi renginde dolu. Etiketin
içinde her zaman yazı ya da ayrı şekilli bir işaret vardır, anlam yalnızca renge kalmaz (İlke 2).

## Malzemeler (firmanın sevkiyat defteri)

28 Eylül'de kararlaştırıldı, **29 Eylül'de baştan yazıldı.** İlk tur bir depo yönetim sistemine dönüşmüştü: 7 hareket
türü, 8 durum, 4 sayı kartı, 13 süzgeç, başlıkta "(Rol: Depo Sorumlusu)" rozeti, ayrı bir Stok sekmesi. Dokümanın kendi
ilkelerini çiğniyordu (İlke 4: eyleme dönüşmeyen sayı gösterilmez). Bu turda modül tek bir işe indirildi.

Malzeme firmanındır, şantiyenin değil: Kızılkan'ın **bir ana deposu** vardır. Depo sorumlusu deponun başında durur;
malzemeyi kendi şantiyelerine ya da başka bir müteahhide gönderir. Menüde Şantiyeler ve Yoklama'nın yanında kendi
maddesidir.

> **"Bu ekran stok tutmaz, sevkiyat tutar: ne çıktı, nereye gitti, ulaştı mı, geri gelecek mi."**

### Stok ekranı yoktur

Bu turun ana kararı. Modülün konusu stok değil **sevkiyat**: patronun sorusu "depoda kaç torba çimento var" değil,
"şu malzeme nereye gitti, karşılığı ne oldu, geri gelecek mi".

Stok yine de hesaplanır (giren eksi çıkan) ama **ekranı yoktur**: sayı yalnızca sevkiyat çıkarılırken seçilen
malzemenin altında tek satır olarak görünür — "Depoda: 300 Torba". Depo sorumlusunun onu merak ettiği tek an,
gönderirken olan andır. Ortada duran bir stok tablosu ise bir sevkiyat yazılmayı unutulduğu anda yalan söyler ve
kavga çıkarır; kenarda duran sayı yalnızca yardım eder.

| Kalkan | Neden |
|---|---|
| **Stok sekmesi**, kritik/tükendi durumu, kritik eşik (`min_stock`), lokasyon kırılımı | Ayrı ekran, öğrenilecek kavram demektir; "Depoda: 300 Torba" cümlesini herkes anlar. |
| **Sayım Düzeltmesi** ve **şantiyede harcama** hareketleri | İkisi de yalnızca stok sayısını değiştirmek için vardı. |
| **"Stok eksiye düşmez"** kilidi, "Kullanılabilir: 900 Torba" uyarısı | Sayılmayan stok engel de koyamaz. Depo sorumlusu ne gönderdiğini kendi bilir. |
| **Sayı kartları** (Toplam Malzeme / Bu Ay / Dışarı Verilen / Beklenen İade) | İlke 4. |

**Kalan:** sevkiyatın kendisi, **dışarıdakiler** (bu stok değil, takiptir) ve malzeme kartı — ama kart sadeleşir:
**ad + birim.** Kategori alanı sahada birim gibi dolduruluyordu ("Çimento · CUVAL"), kritik eşik ise stok ekranı
olmadan anlamsız.

### Tek kavram: sevkiyat

Bir sevkiyat bir kamyondur: tek hedef, tek irsaliye, içinde birden çok kalem. Depo sorumlusu çıkarır, şef teslim alır.

| Karar | Neden |
|---|---|
| **Kullanıcı "hareket türü" seçmez.** Tek soru: *nereden nereye?* Türü sunucu hesaplar, ekran yalnızca sonucu yazar ("Şantiyeye gönderildi"). | Depo sorumlusu "bu bir TO_SITE hareketidir" diye düşünmez; "bu çimento A şantiyesine gidiyor" diye düşünür. Altı kutu tek soruya iner. |
| **Sevkiyat çok kalemlidir.** Bir kamyon çıkar, tek irsaliyeyle birkaç kalem götürür. Kalem = malzeme + miktar. | İrsaliye kalemin değil, seferin belgesidir. Tek kalemli model şefe beş kalemi tek tek onaylatırdı. |
| **Durum üçtür:** Yolda → Teslim alındı, bir de İptal. | Kontrol Bekliyor / Tamamlandı / Kısmi İade aynı eksenin farklı adlarıydı. |
| **Dışarı verilende tek soru: "geri gelecek mi?"** Satıldı / Ödünç / Destek üçlüsü kalktı. İşaretliyse beklenen iadelere düşer. | İki müteahhidin anlaşması para, iş karşılığı, hatır ya da karışık olur — yazılım bunu bilemez, fatura da kesmez. Sistemin bilmesi gereken tek şey stoğu değil **takibi** ilgilendirendir: mal geri gelecek mi? Anlaşma açıklamaya yazılır ("iş karşılığı, Mehmet Usta"). |
| **İrsaliye fotoğrafı sevkiyatın parçasıdır**, eklentisi değil: formda kendi adımı vardır. | Kamyon çıkarken çekilmezse bir daha çekilmez. |
| **Kayıt silinmez**, iptal edilir, nedeni zorunludur, izi kalır. Düğmeler rol adına değil izne göre görünür. | İlke 6. |

### Nereden → nereye

Kullanıcı bu tabloyu görmez; iki ucu seçer, sistem adını koyar.

| Nereden | Nereye | Ekranda yazan |
|---|---|---|
| Tedarikçi | Ana Depo | Geldi |
| Ana Depo | Şantiyem | Şantiyeye gönderildi |
| Ana Depo | Dış müteahhit | Dışarı verildi |
| Şantiyem | Başka şantiyem | Transfer |
| Dış müteahhit | Ana Depo | İade |

### Telefon: iş yapılan yer

Telefon tarama ekranı değildir; depo sorumlusu depoda ayakta, şef şantiyede kamyonun yanındadır. Açılışta sayı kartı
yoktur — ilk ekranda **yapılacak iş** durur.

```
Depo sorumlusu                          Şef
┌──────────────────────────┐            ┌──────────────────────────┐
│  [ + Sevkiyat çıkar ]    │            │  Sana gelen              │
│                          │            │  ┌────────────────────┐  │
│  Yolda (3)               │            │  │ Ana Depo → buraya  │  │
│  ┌────────────────────┐  │            │  │ Çimento +2 kalem   │  │
│  │ Çamburnu Plaza     │  │            │  │  [ Teslim aldım ]  │  │
│  │ Çimento +2 kalem   │  │            │  └────────────────────┘  │
│  └────────────────────┘  │            │                          │
│  Dışarıda (2)            │            │  Son sevkiyatlar         │
└──────────────────────────┘            └──────────────────────────┘
```

| Parça | Karar |
|---|---|
| Sevkiyat formu | Tam ekran, **numaralı üç bölüm** tek sayfada (sihirbaz değil: gizli adım kalmaz, her şey görünür): **1 · Nereye gidiyor?** şantiye listesi, "Başka firmaya", "Depoya mal geldi"; dış firmaysa "geri gelecek mi?" anahtarı · **2 · Ne, ne kadar?** malzeme + miktar, "bir şey daha ekle" ile çoğalır, `van-swipe-cell` ile silinir; seçilen malzemenin altında "Depoda: 300 Torba" · **3 · İrsaliye** `van-uploader` ile kameradan. Altta tek düğme: Gönder. |
| Teslim alma | Şefin ekranında tek düğme, tüm sevkiyatı kapatır. Eksik geldiyse kalem miktarı düzeltilir, fark açıklamaya yazılır. |
| Yolculuk | `van-steps`: Depodan çıktı → Yolda → Teslim alındı; tarih ve kişi adıyla. |
| Dışarıda | Geri gelecek diye işaretlenmiş ve henüz dönmemiş sevkiyatlar; satırda "40 gündür dönmedi" yazar. Ayrıntıda tek düğme: **İade geldi**. |

### Masaüstü: bakılan yer

Tablo, süzgeç ve Excel burada anlamlıdır. Başlıkta rol rozeti yoktur, üstte sayı kartı yoktur, **sekme yoktur** —
tek liste vardır.

```
Malzemeler                                      [Excel] [+ Sevkiyat]
 3 sevkiyat yolda · 2 malzeme 40 gündür dışarıda          ← yalnızca eyleme dönüşürse
[🔍 Ara]  [Son 30 gün ▾]  [Durum ▾]
 Tarih · Nereye · Kalemler · Durum · ⋯
```

| Parça | Karar |
|---|---|
| Üst şerit | Sayı kartı yerine tek satır, yalnızca **eyleme dönüşen** bilgi: yoldakiler ve geciken iadeler. Yapacak bir şey yoksa şerit hiç görünmez (İlke 3). |
| Süzgeç | Üçe indi: arama, tarih, durum. Adreste durur (`?durum=yolda&ara=…`). Tür çipleri kalktı — tür artık kullanıcı kavramı değil. |
| Tablo | Dört kolon: Tarih · Nereye · Kalemler ("Çimento +2 kalem") · Durum. `el-table`; satıra tıklayınca sağdan `el-drawer`. |
| Sevkiyat ayrıntısı | `el-steps` yolculuk, `el-descriptions` künye, kalem tablosu, irsaliye görseli, `el-timeline` değişmez geçmiş (kim oluşturdu, kim teslim aldı, kim iptal etti). |
| Excel | Tek kitap, iki sayfa: Sevkiyatlar (ekrandaki süzgeçlerle) ve Dışarıdakiler. |
| Saha | Şantiyeye gelen ya da şantiyeden çıkan sevkiyat o şantiyenin Saha akışına referans gönderi olarak düşer; dokununca sevkiyat açılır, iptal edilirse kart "İptal" der. Transfer iki şantiyeye de düşer. |

**Roller.** Patron ve **Depo sorumlusu** sevkiyat çıkarır, düzeltir, iptal eder. Şef teslim alır. Çalışan malzemeyi
görmez. Depo sorumlusu yoklamada sayılmaz; uygulamayı açınca doğrudan Malzemeler'e düşer. Patron onu Katılımcılar'dan
atar.

**Sonraki turlara bırakılanlar:** stok ekranı (sayı hesaplanır ve formda görünür, ama listesi yoktur), kritik eşik
ve sayım düzeltmesi, şantiyede harcama kaydı, şantiyeden şantiyeye transfer, kısmi iade, çoklu birim ve dönüşüm,
barkod / QR, kritik stok bildirimi, satın alma ve tedarikçi fiyatları, hakediş ve muhasebe bağlantısı, araç ve
şoför kaydı.

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

**Üç rol (28 Eylül).** Bağlantıyla gelen herkes **çalışandır**; patron Katılımcılar'dan birini **şef** yapar, şef
her sabah yoklamayı alır (bkz. Yoklama). Rol, kişinin uygulamada ne yapabildiğini söyler: herkes her şantiyeyi
görür ve yazar; şef ayrıca yoklama alır, patron ayrıca kişileri yönetir. Katılımcılarda yalnızca Patron ve Şef
etiketi yazar (WhatsApp'ta yalnızca yöneticinin etiketi olduğu gibi; kişilerin çoğu çalışandır). O güne kadar
bağlantıyla gelip şef yazılmış herkes çalışan yapıldı (V16): patron gerçek şefleri kendisi seçer.

**Kimsenin durumu yazmaz.** "Henüz girmedi", "son görülme", "linki açmadı" bizim teknik derdimizdir, dayının
değil. Biri giremezse gerçek hayattaki gibi arar, patron ona giriş linki gönderir.

| İş | Nerede, nasıl |
|---|---|
| Yeni kişi | Şantiyeler listesinin başındaki **＋ → Kişi ekle** (şantiye bilgisindeki Katılımcılar'da da "＋ Kişi ekle" durur): bağlantı, "WhatsApp'ta paylaş" ve "Kopyala". WhatsApp grup ya da kişi seçtirerek açılır. Bağlantıyı açan "Şantiye ekibine katıl · Kızılkan İnşaat" görür, **adını ve numarasını kendisi yazar**, Katıl'a basar, şantiyeler listesine düşer; her şantiyenin akışına "Mahmut davet bağlantısıyla katıldı" yazılır. Patron hiç numara yazmaz. 25 Eylül'de bağlantı şantiye bilgisinin içinden listenin ＋'sına da çıkarıldı: kişi eklemek bir şantiyenin değil, firmanın işidir. |
| Bağlantı | Firma başına tek, **süresiz**, çok kullanımlık (WhatsApp grup bağlantısı gibi). Katılan kişinin erişimi de süresizdir; oturum her açışta yenilenir. Yanlış ellere geçerse **Bağlantıyı sıfırla**: eskisi çalışmaz, katılmış olanlar içeride kalır. |
| Zaten içerideki | Bu telefonda firmadan biri zaten içerideyse bağlantı doğrudan şantiyelere götürür. |
| Kişiye dokununca (patron) | Ara · Giriş linki gönder (telefonunu değiştirirse ya da "giremiyorum" derse; WhatsApp doğrudan onun sohbetinde açılır) · Düzenle (ad ve numara) · sahip olmadığı iki rol (**Patron yap** · **Şef yap** · **Çalışan yap**; onay penceresi rolün ne getirdiğini söyler) · **Firmadan çıkar**. Kendi satırında yalnızca "Adımı ve numaramı düzenle" (patronun numarası buradan girilir; şeflerin 📞 listesinde görünmesi için). |
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

| | Patron | Şef | Depo Sorumlusu | Çalışan |
|---|---|---|---|---|
| 1 | Şantiyeler | Şantiyeler | Şantiyeler | Şantiyeler |
| 2 | Yoklama | Yoklama | Malzemeler | Puantajım |
| 3 | Malzemeler | Malzemeler | Ben | Ben |
| 4 | Ben | Ben | | |

Malzemeler menüde rol adına göre değil, malzemeyi görme iznine (`VIEW_MATERIALS`) göre durur; depo sorumlusu
uygulamayı açınca doğrudan Malzemeler'e düşer (28 Eylül).

Yoklama patronun ve şefin menüsündedir (28 Eylül): şef her sabah alır, patron ay sonunda puantajı görür. Çalışan
yoklamada sayılır; onun menüsünde yerine kendi ayı Puantajım vardır. Kimse ötekinin adresine giremez: çalışan
/yoklama'ya, patron ya da şef /puantajim'e giderse şantiyelerine döner.

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

**Personel listesi ve şantiye şantiye yoklama (27 Eylül'de arayüzden kaldırıldı).** Uygulamayı kullanmayan
işçi ve ustaların şantiyeye bağlı listesi, şefin herkesi tek tek işaretlediği yoklama penceresi ve şantiyenin
yoklama geçmişi arayüzden çıktı. O günün gerekçesi: yoklamada firmanın kişileri sayılacak, çalışan kendi
telefonundan katılacaktı. Backend'e dokunulmadı: `site_workers`, `attendances`, `attendance_entries` ve uçları
verisiyle yerinde duruyor.

**Sohbette yoklama mesajı ve "Yoklamaya Katıl" (28 Eylül'de kaldırıldı).** 27 Eylül'deki yoklama (Musa): sohbete
günün yoklama mesajı atılıyor, çalışan kendi telefonundan katılıyor, katılmayanı patron işaretliyordu. Gerekçe:
patron sahada değildir, kimin gelmediğini bilemez; bilen şeftir. Düğmeye evden de basılır, telefonu olmayan usta
sayılamaz, patron ekibi "katılmadı" görünürdü. Atılmış yoklama mesajları "silindi" izine döndü (V18); ＋'daki
Yoklama, kart, menü kuralları ve kodu kaldırıldı. `member_attendance` verisiyle yerinde duruyor.

**Bildirimler.** Push'un tek tetikleyicisi sorun bildirimiydi; sorun arayüzden kalkınca bildirim de
fiilen sessizleşti. Ana ekrandaki "bildirim al" hatırlatması kaldırıldı, anahtar "Ben"de kaldı. Neyin
bildirim göndereceği (ör. akşam 17:00'de rapor göndermemiş şefe hatırlatma) ayrıca kararlaştırılacak.
25 Eylül'den beri Saha'daki "Sorun bildir" yine bu bildirimi tetikler (sorun kuyruğu ve "Çözüldü" geri gelmedi).

## Sonraki turda konuşulacaklar

- **Görevler** (Musa): şantiye bilgisinde duruyor; WhatsApp'ta karşılığı olmayan yeni bir kavram (İlke 1),
  kalıp kalmayacağı konuşulacak.
- İlk açılış: sıfır şantiye, sıfır kişiyken patronun ilk on dakikası.
- **Yoklama, sonraya bırakılanlar:** yevmiye tutarı (gün × ücret, yalnızca patrona), sabah hatırlatması
  (işaretlenmeyen varken şefe), çalışana "Bugün Geldi olarak yazıldın" bildirimi (bildirimler HTTPS ister).
