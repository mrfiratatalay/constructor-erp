# Kızılkan Şantiye — Ekran Tasarımı Kararları

22 Eylül 2026'da kararlaştırıldı, aynı gün dördüncü turda sadeleştirildi; 23 Eylül'de Şantiyeler modülü
ayrıntı ayrıntı yeniden kararlaştırıldı (telefon önce: patron şantiyelere telefondan bakar), 24 Eylül'de Ekip. Ekran düzeniyle
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
| Sıralama | Sabitlenenler üstte (son sabitlenen önde), sonra akışında en son bir şey olan (mesaj ya da sistem satırı). |
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
| Başlık | Şantiye fotoğrafı, ad, altında katılımcıların ilk adları ve "Sen". Başlığa dokununca bilgi açılır; sağda 📞 (telefonu olan ilk katılımcı) ve ⋮. |
| Sistem satırları | "Patron şantiyeyi kurdu", "Patron, Musa'yı ekledi", "Patron, Ali'yi çıkardı", "Patron seni ekledi". Yapanı bilinmeyen eski kayıtta "Musa eklendi". |
| Gönderme çubuğu | `[＋] [yazı] 📷 🎤` (iPhone WhatsApp). ＋: Fotoğraf ve video · Belge (PDF). 📷 doğrudan kamera. Yazı varken 📷 ve 🎤 yerine ➤. Masaüstünde `[＋] [yazı 😊] 🎤`. |
| Sesli not | Basılı tut, bırak → gider. Basılıyken yukarı kaydırınca kilitlenir: 🗑 ya da ➤. Dinlerken 1× / 1,5× / 2×. |
| Fotoğraflar | Baloncuk boyunda (ekranın ~3/4'ü, en çok 320px). Çok fotoğraf 2×2 albüm; dörtten fazlasında "+N". Dokununca tam ekran. |
| Mesaj menüsü | Uzun bas (masaüstünde ⋯): Yanıtla, Kopyala, İlet, Sabitle, Bilgi (yalnızca kendi mesajında), Düzelt, Sil. |
| Yanıtla | Çubuğun üstünde alıntı (✕ ile vazgeç); baloncukta alıntı şeridi, dokununca o mesaja gidilir. |
| İlet | Şantiye seçilir; mesaj iletenin adıyla, "İletildi" etiketiyle gider, dosyaları kopyalanır. |
| Sabit mesaj | Herkes sabitler, şantiye başına en fazla üç, kaldırılana kadar durur; yalnızca şantiyenin içinde (listeye yansımaz). |
| Bilgi | Kim, ne zaman gördü; kim henüz görmedi. |
| Boş şantiye | Patron "Davet linki gönder: Ahmet" düğmelerini görür; ilk mesaj gelince kaybolur. |
| Alt sekmeler | Şantiyenin içinde herkes için gizlenir (WhatsApp'ta sohbetin içi gibi). |

**"En yeni üstte" kararı geri alındı (4. tur).** Gerekçesi "bu bir sohbet değil, defter"di; ama kabuğu
WhatsApp yapıp içeriyi ters akıtmak, alışkanlığı tam da en çok kullanılan yerde bozuyordu. Şantiye günü
kronolojiktir: sabah demir geldi, öğlen beton döküldü. Hikâye baştan okunur.

## Şantiye bilgisi (WhatsApp'taki grup bilgisi)

Başlığa dokununca: telefonda alttan açılır, masaüstünde akışın sağında panel olur (akış kararmaz).

| Parça | Karar |
|---|---|
| Fotoğraf | En üstte büyük; patron değiştirir ya da kaldırır. |
| Künye | Ad, "Şantiye · N katılımcı", adres (dokununca harita), patronda Düzenle (ad, adres, tamamlandı). |
| Medya ve belgeler | "Medya ve belgeler · N ›" ve son fotoğrafların şeridi. İçeride Medya ve Belgeler sekmeleri, aylara ayrılmış; şantiyenin bütün geçmişi. |
| Görevler | Görevler satırı (Musa'nın özelliği; ürün kararı Musa'yla konuşulacak). |
| Katılımcılar | "Katılımcılar · N"; en üstte "Sen", her kişinin yanında firmadaki rolü (Patron / Şef), numarası okunur biçimde (`0552 813 78 50`). Patron bir kişiye dokununca: Ara, Şantiyeden çıkar. |

"Sorumlu" kelimesi kullanılmaz: bir şantiyede birden çok kişi olur ve hepsi aynı türden üyedir. Kişi
şantiyenin **katılımcısıdır**, firmadaki rolü **Şef**'tir.

## Ekran 3 — Şantiye kurma (WhatsApp'ta grup kurma)

Listenin başlığındaki ＋ (yalnızca patron), WhatsApp'taki gibi iki adım:

1. **Katılımcılar:** ekipten işaretle ya da "＋ Yeni kişi" (ad soyad + telefon). Kimseyi seçmeden geçmek serbest.
2. **Fotoğraf ve ad:** yuvarlak fotoğraf (isteğe bağlı), şantiye adı (zorunlu), adres (isteğe bağlı).

Oluşturunca şantiyenin içine düşülür; akışın başında "Patron şantiyeyi kurdu", "Patron, Musa'yı ekledi"
satırları ve "Davet linki gönder" düğmeleri hazır durur.

## Ekran 4 — Ekip (WhatsApp'taki Kişiler)

24 Eylül'de kararlaştırıldı. Önce ayrıntılı bir sürüm konuşuldu (davet durumu, "Patron yap", pasifler listesi,
"(Sen)" satırı); toplamı on kavrama çıkınca sadeleştirildi. Kök neden: WhatsApp'ta "hesap açmak" yoktur;
giriş linki, katıldı mı, erişimi kapatmak gibi yönetici işleri ekrana sızıyordu. Soru her seferinde:
**"Neyi hiç yapmasak?"**

> **"Ekip, adamlarının listesi. ＋ ile eklersin, WhatsApp'tan linkini atarsın; ayrılanı çıkarırsın."**

Dört kavram: **kişi, şantiye, giriş linki, çıkarmak.** Ekip'i yalnızca patron görür.

| Parça | Karar |
|---|---|
| Liste | Baş harfli yuvarlak, ad, altında şantiyeleri ("Namık Kemal, Kartal B Blok"). Alfabetik. Etiket yok, patronun kendisi yok, çıkarılanlar yok. |
| Kişi bilgisi | Telefonda tam sayfa (`/ekip/:id`, geri hareketi listeye döner), masaüstünde sağ panel. Yuvarlak, ad, numara, "son görülme …" ya da "Henüz girmedi". [📞 Ara] [🔗 Giriş linki gönder] (henüz girmemişte link düğmesi öne çıkar). Şantiyeleri: yalnızca bakmak ve gitmek için. En altta kırmızı "Ekipten çıkar". Sağ üstte Düzenle. |
| Ekleme / düzenleme | Yalnızca ad soyad ve telefon, ikisi de zorunlu. Eklenen herkes şeftir (rol seçimi yok; firmanın tek patronu var). Ekle'ye basınca giriş linki WhatsApp'ta o numaranın sohbetinde, mesaj yazılmış açılır. Şantiye kurarken ve katılımcı eklerken açılan "Yeni kişi" formu da aynı iki alandır. |
| Şantiyeye ekleme | Yalnızca şantiyenin içinde (katılımcılar). Ekip'te şantiye seçimi yok. |
| Ekipten çıkarmak | Uygulamaya giremez, bütün şantiyelerden çıkar ("Patron, Musa'yı çıkardı"); yazdıkları şantiyelerde kalır. Aynı numara yeniden eklenirse eski kaydı geri açılır. |
| Numara | Ekipte tekildir ("Bu numara zaten ekipte: Ahmet Yılmaz"); "0532…", "+90 532…" aynı numaradır. |
| İsim | Kaydederken Türkçe kurallarla düzeltilir: "FIRAT ATALAY" → "Fırat Atalay". Bilerek karışık yazılmış ad (ör. "McAllister") olduğu gibi kalır. |
| Kişi bilgisine kapı | Ekip listesi ve şantiye bilgisindeki katılımcılar (patron dokununca "Kişi bilgisi"). |

Genel bir "WhatsApp'ta yaz" düğmesi yok: uygulama şantiye konuşmaları WhatsApp'ta kaybolmasın diye var.
WhatsApp yalnızca işe yaradığı yerde çıkar: giriş linkini göndermek.

## Masaüstü: solda liste, sağda şantiye (WhatsApp Masaüstü)

| Parça | Karar |
|---|---|
| Sol şerit | İnce ikon şeridi: 🏗 Şantiyeler, 👥 Ekip (üstüne gelince adı), en altta kişinin kendisi (Hesabım). Seçili öğe baret sarısı zeminde lacivert. |
| Liste | Telefondaki satırın aynısı; başlıkta firma adı ve ＋, altında arama. Satırın üstüne gelince ⌄: Sabitle. |
| Sağ taraf | Seçili şantiye; adres `/santiyeler/:id`, bağlantı paylaşılabilir. Hiçbiri seçili değilken sade karşılama (kimse istemeden okunmuş sayılmaz). |
| Bilgi ve arama | Akışın sağında panel; ikisi aynı yeri paylaşır. |

## Ekran genişlikleri

Kabuk açılışta bir kez seçilir; kabuğun içi her genişliğe kendiliğinden uyar.

| Ekran | Kabuk | Düzen |
|---|---|---|
| Telefon (≤ 768px) | Mobil (Vant) | Tam genişlik |
| Dokunmatik tablet (≤ 1024px) | Mobil | Sayfa, başlık, gönderme çubuğu ve alttan açılan pencereler 640px'lik ortalı sütunda |
| Bilgisayar, dar pencere | Masaüstü (Element Plus) | Sol şerit hep ince (72px); liste 280-360px arasında incelir |
| Bilgisayar, geniş | Masaüstü | Liste 360px, akış 760px'te ortalı; bilgi paneli 320-400px |

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

Ekip yönetimi telefonda "Ben" altında, masaüstünde sol şeritte 👥. Şantiye ayarları ayrı bir ekran değildir:
ekleme listedeki ＋, düzenleme şantiye bilgisinde (başlığa dokununca).

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

## Sonraki turda konuşulacaklar

- **Görevler** (Musa): şantiye bilgisinde duruyor; WhatsApp'ta karşılığı olmayan yeni bir kavram (İlke 1),
  kalıp kalmayacağı konuşulacak.
- İlk açılış: sıfır şantiye, sıfır kişiyken patronun ilk on dakikası.
