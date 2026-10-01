# Kızılkan Şantiye — Arayüz Düzeni Kararları

TASARIM.md'nin bir bölümüdür; o dosya 300 satırı geçtiği için ayrı durur. İlkeler ve genel kararlar TASARIM.md'dedir.

## Şantiye bilgisi (WhatsApp'taki grup bilgisi)

Başlığa dokununca: telefonda alttan açılır, masaüstünde akışın sağında panel olur (akış kararmaz).

| Parça | Karar |
|---|---|
| Fotoğraf | En üstte büyük; patron değiştirir ya da kaldırır. |
| Künye | Ad, "Şantiye · N katılımcı", adres (dokununca harita), patronda Düzenle (ad, adres, tamamlandı). |
| Medya ve belgeler | "Medya ve belgeler · N ›" ve son fotoğrafların şeridi. İçeride Medya ve Belgeler sekmeleri, aylara ayrılmış; şantiyenin bütün geçmişi. |
| Görevler | Görevler satırı (Musa'nın özelliği; ürün kararı Musa'yla konuşulacak). |
| Katılımcılar | "Katılımcılar · N": firmanın herkesi (her şantiyede aynı liste); en üstte "Sen", sonra patronlar, şefler ve depo sorumluları; yanında rolü (Patron / Şef / Depo sorumlusu) ve numarası (`0552 813 78 50`). Durum yazısı yok. Patronda "＋ Kişi ekle" (firmanın bağlantısı) ve kişiye dokununca menü (bkz. Kişiler). |

"Sorumlu" kelimesi kullanılmaz: şantiyenin "sorumlusu" yoktur, herkes her şantiyededir. Kişi şantiyenin
**katılımcısıdır**, firmadaki rolü **Patron**, **Şef** ya da **Depo sorumlusu**'dur.

## Ekran 3 — Şantiye kurma (WhatsApp'ta grup kurma)

Listenin başlığındaki ＋ (yalnızca patron), tek adım: yuvarlak fotoğraf (isteğe bağlı), şantiye adı
(zorunlu), adres (isteğe bağlı). Altında "Firmadaki herkes bu şantiyeyi görür ve yazabilir." yazar. Kişi
seçilmez. Oluşturunca şantiyenin içine düşülür; akışın başında "Patron şantiyeyi kurdu" yazar.

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
