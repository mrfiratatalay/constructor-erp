# Kızılkan Şantiye — Ekran Tasarımı Kararları

22 Eylül 2026'da kararlaştırıldı, aynı gün dördüncü turda sadeleştirildi; 23 Eylül'de Şantiyeler modülü
ayrıntı ayrıntı yeniden kararlaştırıldı (telefon önce: patron şantiyelere telefondan bakar), 24-25 Eylül'de kişiler, 28 Eylül'de yoklama ve roller. Ekran düzeniyle
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
| Gönderme çubuğu | `[＋] [yazı] 📷 🎤` (iPhone WhatsApp). ＋: Fotoğraf ve video · Belge (PDF) · 📋 Görev (patron ve şefte) · ✅ İş Teslim Et (bkz. Görev kartı, İş teslimi). 📷 doğrudan kamera. Yazı varken 📷 ve 🎤 yerine ➤. Masaüstünde `[＋] [yazı 😊] 🎤`. |
| Sesli not | Basılı tut, bırak → gider. Basılıyken yukarı kaydırınca kilitlenir: 🗑 ya da ➤. Dinlerken 1× / 1,5× / 2×. |
| Fotoğraflar | Baloncuk boyunda (ekranın ~3/4'ü, en çok 320px). Çok fotoğraf 2×2 albüm; dörtten fazlasında "+N". Dokununca tam ekran. |
| Mesaj menüsü | Uzun bas (masaüstünde ⋯): Yanıtla, Kopyala, İlet, Sabitle, Sahaya ekle (bkz. Saha sekmesi), Bilgi (yalnızca kendi mesajında), Düzelt, Sil. İş teslimi ve şefin cevabında yalnızca Yanıtla, Sabitle, Bilgi ve (fotoğraflı teslimde) Sahaya ekle. |
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
| Özet | Dört kart: Geldi (yarım gün altında yazar), Gelmedi, İzinli, İşaretlenmedi; sıfıra inen "İşaretlenmedi" "Bugünün yoklaması tamam" der. Raporda sayı kartı yoktur (İlke 4). |
| Renk açıklaması | Çipler hem açıklama hem süzgeç: "İşaretlenmedi"ye basınca yalnızca kalanlar görünür. Yanında arama (ad, görev, ekip başı). |
| Satır | Avatar, kalın ad, altında gri görev (ekipte "Ekip başı · Hasan Usta"). Son beş gün yalnızca okunur (şef dünü görerek işaretler); bugünün sütununda seçenekler açıktadır, **tek tıkla** işaretlenir. ⋯: Mesai ve not · İşaretlemeyi kaldır. |
| Toplu işaretleme | Satırlar seçilince süzgecin yerine "5 satır seçildi" çubuğu gelir: Geldi · Yarım gün · Gelmedi · İzinli (seçimde ekip varsa yalnızca Geldi · Gelmedi). Notlar yerinde kalır. |
| Telefonda | Dört renkli sayı, arama, Personel ve Taşeron ekipler. Satıra dokununca alttan seçim (tek dokunuş); ayrıca "Mesai ve not", "İşaretlemeyi kaldır", "Ayın takvimi". Sağ üstte **Seç** toplu işaretlemeyi açar (altta renkli düğmeler), **＋** kişi ya da ekip ekler. |

**Puantaj sekmesi, ay sonu.** Ay seçici (gelecek ay yok; ay adreste `?ay=2026-09`, sekme `?sekme=puantaj`),
işaretlerin açıklaması, patrona **Excel indir**. Personel cetveli: satırda kişi, sütunda ayın günleri, hücrede
✓ ½ ✕ İ (mesaiyle "✓+2"); sağda sabit **Çalıştığı gün** (yarım gün yarım sayılır, yevmiye buna göre) ve
**Mesai**; en altta ayın toplamı. Taşeron ekipler cetvelinde **Geldiği gün**. Telefonda cetvel yerine liste:
"Ali Usta · 22,5 gün", altında mesai, yarım gün, gelmedi, izinli.

**Kişinin ya da ekibin ayı.** Ada dokununca: masaüstünde sağdan panel (liste yerinde kalır), telefonda ayrı sayfa
(`/yoklama/kisi/:entryId`). Toplamlar, takvim (her günde renkli işaret), güne dokununca ayrıntı: durum (büyük
düğmeler), mesai, not ve "Kaydedildi · 08:17 · Patron" izi. Uygulaması olmayan kişi ya da ekip buradan düzeltilir
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

**Görünüş.** Masaüstü yalnızca Element Plus, telefon yalnızca Vant bileşenleriyle kurulur; bu modülde elle CSS
yazılmaz. Renk yalnızca bileşenin kendi tonundan gelir: Geldi yeşil, Yarım gün sarı, Gelmedi kırmızı, İzinli
mavi (marka rengi; telefonda çerçeveli), İşaretlenmedi gri. Etiketin içinde her zaman yazı ya da ayrı şekilli bir
işaret vardır, anlam yalnızca renge kalmaz (İlke 2).

## Görev kartı (görev sohbette verilir, sohbette izlenir)

28 Eylül'de kararlaştırıldı (Musa). Şef görevi WhatsApp'ta yazar gibi verir: **ne, kim, ne zaman.** Görev sohbete
kart olarak düşer; teslim, eksik ve onay o kartın altına yanıt olarak dizilir. Yeni ekran yoktur: görev şantiye
bilgisindeki mevcut Görevler'in aynısıdır, sohbet yalnızca onun ikinci kapısıdır.

```
Şef: ＋ → 📋 Görev                  Sohbette (görev kartı)            Çalışanda aynı kart
┌──────────────────────────────┐   ┌───────────────────────────┐   ┌───────────────────────────┐
│ 📋 Görev                   ✕ │   │ 📋 GÖREV                   │   │ 📋 GÖREV                   │
│ Ne yapılacak?                │   │ Kalıp sökülecek           │   │ Kalıp sökülecek           │
│ [Kalıp sökülecek          ]  │   │ 👤 Ali Usta                │   │ 👤 Ali Usta                │
│ Kim yapacak?                 │   │ 🕐 Yarın                   │   │ 🕐 Yarın                   │
│ [Ali Usta               › ]  │   │ Bekliyor                  │   │ Bekliyor                  │
│ Ne zaman?                    │   └───────────────────────────┘   │ [ ✅ İŞİ TESLİM ET ]       │
│ (Bugün) (Yarın) (Tarih seç)  │                                   └───────────────────────────┘
│ [      📋 Görevi ver      ]  │
└──────────────────────────────┘
```

| Parça | Karar |
|---|---|
| Nereden | Sohbetin ＋'sı, yalnızca patron ve şefte: Fotoğraf ve video · Belge (PDF) · **📋 Görev** · ✅ İş Teslim Et. Şantiye bilgisindeki Görevler'den açılan görev de aynı kartı düşürür: iki kapı, tek görev. Çalışanın ＋'sında 📋 Görev yoktur (Görevler sayfasının kuralı değişmedi). |
| Pencere | Yalnızca üç soru: **Ne yapılacak?** · **Kim yapacak?** (şantiyenin şefleri ve çalışanları; veren kendini "Ben" diye seçebilir) · **Ne zaman?** (Bugün · Yarın · Tarih seç). Öncelik ve not sorulmaz (Normal, boş); gerekirse Görevler'den düzenlenir. Telefonda kişi listesi ＋ menüsü gibi alttan açılır, "Tarih seç" tarih çarkını açar; geçmiş gün seçilemez. |
| Kart | Görev açılınca sohbete "📋 Görev: Kalıp sökülecek" mesajı düşer (liste önizlemesi ve arama bu yazıyı kullanır), baloncukta kart yazar: 📋 GÖREV, iş, 👤 kim, 🕐 ne zaman (Bugün, Yarın, "3 gün gecikti", "12 Eki"; iş bitince yazılmaz) ve durum. |
| Durum | Zincir ilerledikçe kart kendiliğinden değişir: **Bekliyor** → teslimde **Kontrol bekliyor** → eksikte **Eksik var** → onayda **Tamamlandı**. Kart 15 sn'de bir tazelenir, kendi yaptığın değişiklikte hemen. |
| Teslim | İşin sorumlusu teslim edilebilir işte kartta büyük **✅ İŞİ TESLİM ET**'i görür; teslim penceresi iş seçili açılır (bkz. İş teslimi). Teslim mesajı görev kartının yanıtı, şefin cevabı teslimin yanıtı olarak düşer: tek zincir. |
| Yazı | Görev mesajının yazısı görevden gelir: düzeltilmez, iletilmez (görev düzenlenir). Görev silinirse baloncukta kartın yerine mesajın yazısı kalır. |

## İş teslimi (işim bitti → fotoğraf → teslim)

28 Eylül'de kararlaştırıldı (Musa). Usta işini bitirince uzun rapor yazmaz: **işi seçer, fotoğraf çeker, teslim
eder.** Şef fotoğrafa bakar, yalnızca iki şey der: **Onayla** ya da **Eksik var**. Yeni bir iş sistemi değildir:
şantiye bilgisindeki mevcut görevin bir adımıdır; şefin ayrı bir ekranı da yoktur, sohbet onun ekranıdır.

```
Çalışan: görev kartında ✅ İŞİ TESLİM ET  Sohbette (teslim mesajı)            Şefin cevabı (yanıt olarak)
┌──────────────────────────────┐      ┌───────────────────────────┐      ┌──────────────────────────────┐
│ ✅ İş Teslim Et            ✕ │      │ ↳ Mehmet: 📋 Görev: …      │      │ ↳ Ali: İş teslim edildi: …   │
│ 1. Hangi iş?                 │      │ [foto] [foto]             │      │ ❌ İŞ TAMAMLANMADI            │
│ (•) ⚡ 3. Kat Elektrik        │      │ ✅ İŞ TESLİM EDİLDİ        │      │ Eksik: Buradaki kablo eksik  │
│ ( ) 🚿 Banyo tesisatı  Eksik │      │ ⚡ 3. Kat Elektrik         │      │ 📍 B Blok · ⚡ 3. Kat El.     │
│ 2. 📷 İşin fotoğrafı          │      │ 👤 Ali Usta · 📷 2 fotoğraf│      │ [foto, üstünde 🔴]            │
│ [foto ✕] [📷 Fotoğraf çek]   │      │ Kontrol bekliyor          │      │ [ ✅ İŞİ TESLİM ET ] (ustada) │
│ [   ✅ İŞİ TESLİM ET      ]  │      │ [ İNCELE ]   (şefte)      │      └──────────────────────────────┘
└──────────────────────────────┘      └───────────────────────────┘
```

| Parça | Karar |
|---|---|
| Nereden | Görev kartındaki **✅ İŞİ TESLİM ET** (bkz. Görev kartı) ya da sohbetin ＋'sındaki **✅ İş Teslim Et**. Eksik dönen işin kartındaki "✅ İŞİ TESLİM ET" de aynı pencereyi açar; karttan açılınca iş seçili gelir. |
| Hangi iş | Bu şantiyede kişiye verilmiş, bitmemiş ve kontrolde olmayan görevler; eksiği dönen en üstte ("Eksik var" etiketli). Tek açık iş varsa seçili gelir. Hiç yoksa "Sana verilmiş açık iş yok." |
| Simge | Görevin simgesi başlığından okunur (banyo/tesisat 🚿, elektrik/kablo ⚡, duvar/tuğla 🧱, boya/badana 🎨, diğerleri 📋): kullanıcıya tür seçtirilmez, görevde "tür" alanı yoktur (Saha'daki simgeler gibi). |
| Fotoğraf | 1-4 fotoğraf, yalnızca fotoğraf. Seçilince küçültülür (sohbetteki fotoğraflar gibi). Yazı istenmez: mesajın yazısını ("✅ İş teslim edildi: 3. Kat Elektrik") sunucu koyar; liste önizlemesi ve arama onu kullanır, baloncukta kart yazar. |
| Kim | Teslimi yalnızca görevin sorumlusu yapar. İnceleyen şef ya da patron; kimse kendi teslimini onaylamaz. |
| Durum | Görev teslim edilince **Kontrolde**, eksik dönünce **Eksik var**, onaylanınca **Tamamlandı**. İkisi görev penceresinde elle seçilmez; görev listesinde etiket olarak görünür. |
| İNCELE | Şefte teslim kartının düğmesi: fotoğraflar büyük (dokununca tam ekran), altta yalnızca **✅ ONAYLA** ve **❌ EKSİK VAR**. |
| Eksik var | Aynı pencerede "Neresi eksik?": fotoğraf seçilir, üstüne dokunulur, **🔴 nokta** oraya konur (isteğe bağlı; yeniden dokununca yer değiştirir), kısa not zorunlu ("Buradaki kablo eksik"), **GÖNDER**. Nokta fotoğrafa oranla saklanır: her ekranda aynı yere düşer. |
| Cevap | Teslim mesajı görev kartının, şefin cevabı teslim mesajının yanıtı olarak düşer: onayda "✅ TAMAMLANDI · Onaylayan", eksikte "❌ İŞ TAMAMLANMADI · Eksik: …" ve noktalı fotoğraf. Usta bildirimi ve okunmadı rozetini sohbetten alır, yeniden teslimi kartın düğmesiyle yapar. Görev kartının durumu da birlikte değişir. |
| Kayıt | Her teslim ayrı saklanır: kim ne zaman teslim etti, fotoğrafları, kim ne zaman inceledi, eksik notu ve nokta. İş kaç kez gidip gelse de geçmişi kalır; onaylanınca görevin tamamlanma tarihi dolar. |
| Kanıt | Teslim mesajı ve şefin cevabı silinmez, düzeltilmez, iletilmez, kopyalanmaz; yanıtlanır ve sabitlenir, fotoğraflı teslim Saha'ya eklenebilir. |
| Tazelenme | Kart kendini tazeler: fotoğraf sunucuda işlenirken 4 sn'de bir, sonra 15 sn'de bir (sohbetin akışı gibi). Ayrıntı gelene kadar baloncukta mesajın kendi yazısı durur. |

Bilerek yapılmayanlar: ayrı bir "kontrol bekleyen işler" ekranı, filtre, grafik; ikiden fazla inceleme seçeneği;
görevlere kat/blok alanı (yer, şantiyenin adı ve görevin başlığıyla söylenir: "B Blok · 3. Kat Elektrik").

## Şantiye bilgisi (WhatsApp'taki grup bilgisi)

Başlığa dokununca: telefonda alttan açılır, masaüstünde akışın sağında panel olur (akış kararmaz).

| Parça | Karar |
|---|---|
| Fotoğraf | En üstte büyük; patron değiştirir ya da kaldırır. |
| Künye | Ad, "Şantiye · N katılımcı", adres (dokununca harita), patronda Düzenle (ad, adres, tamamlandı). |
| Medya ve belgeler | "Medya ve belgeler · N ›" ve son fotoğrafların şeridi. İçeride Medya ve Belgeler sekmeleri, aylara ayrılmış; şantiyenin bütün geçmişi. |
| Görevler | Görevler satırı (Musa'nın özelliği; ürün kararı Musa'yla konuşulacak). Buradan açılan görev de sohbete görev kartı düşürür; görevin sorumlusu işi karttan fotoğrafla teslim eder, şef onaylar ya da eksiğini gösterir (bkz. Görev kartı, İş teslimi). |
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

| | Patron | Şef | Çalışan |
|---|---|---|---|
| 1 | Şantiyeler | Şantiyeler | Şantiyeler |
| 2 | Yoklama | Yoklama | Puantajım |
| 3 | Ben | Ben | Ben |

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
  kalıp kalmayacağı konuşulacak. 28 Eylül'den beri görev sohbetin ＋'sından da verilir ve sohbette kart olarak
  izlenir (bkz. Görev kartı); Görevler satırının ayrıca gerekip gerekmediği bu konuşmanın parçası.
- İlk açılış: sıfır şantiye, sıfır kişiyken patronun ilk on dakikası.
- **Yoklama, sonraya bırakılanlar:** yevmiye tutarı (gün × ücret, yalnızca patrona), sabah hatırlatması
  (işaretlenmeyen varken şefe), çalışana "Bugün Geldi olarak yazıldın" bildirimi (bildirimler HTTPS ister).
