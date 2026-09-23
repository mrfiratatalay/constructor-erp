# Kızılkan Şantiye — Ekran Tasarımı Kararları

22 Eylül 2026'da kararlaştırıldı, aynı gün dördüncü turda sadeleştirildi. Ekran düzeniyle ilgili bir
tercih yapılacağı zaman önce buraya bakılır. Kurallar değil, kararlardır; gerekçesiyle birlikte değişir.

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
ekranda durmaz. Bir şantiyenin en son ne zaman konuştuğunu **satırdaki saat** zaten söyler
("Dün 17:40", "12 Eyl"); ikinci kez etiketle söylemek gürültüdür.

**4. Eyleme dönüşmeyen sayı gösterilmez.** "Bugün 34 fotoğraf" ile patron hiçbir şey yapmaz.

**5. Bir gönderi şantiyesine aittir.** Gönderme her zaman şantiyenin içinde olur; ayrı bir gönderme
ekranı ve şantiye seçici yoktur.

**6. Defter iz bırakmadan değişmez.** Gönderi silinebilir ve düzeltilebilir, ama yerinde "silindi" ya da
"düzenlendi" izi kalır.

## Ekran 1 — Şantiyeler (WhatsApp'ın sohbet listesi)

Patronda "Şantiyeler", şefte "Şantiyem". Tek şantiyesi olan listeyi hiç görmez, doğrudan o şantiyenin
sayfasına düşer.

**Başlık:** ince lacivert (blueprint) şerit; firma adı ve patronda ＋. Özet cümlesi, tarih ve bildirim
hatırlatması yok.

**Satır tek tiptir:**

```
┌────────────────────────────────────────┐
│ Bahçelievler Konutları          07:42  │  ad · son haberin saati
│ Ahmet: Beton pompası gecikti         ③ │  önizleme · okunmadı rozeti
└────────────────────────────────────────┘
```

| Parça | Karar |
|---|---|
| Sıralama | Son haber gelen üstte (WhatsApp). Rol, sorun ya da sessizlik sıralamaya karışmaz. |
| Önizleme | Son gönderinin ilk satırı: `Ahmet: "Demir gelmedi…"`. Patron çoğu gün içeri girmeden cevabını alır. |
| Gönderi yoksa | Sorumlunun adı yazılır; sorumlu da yoksa satır susar (İlke 3). |
| Okunmadı rozeti | Marka lacivertidir. Kırmızı hiçbir yerde kullanılmaz. |
| Tamamlananlar | Listenin sonunda "Tamamlanan N şantiye ›". |

Kaldırılanlar ve nedenleri: **yoğunluk kademeleri** (geniş/orta/dar satır) — önemi genişlikle anlatmak
öğrenilmesi gereken bir şifreydi; **satırdaki fotoğraf şeridi** — fotoğrafların yeri akış; **durum
etiketleri** ("2 açık sorun", "Dünden beri haber yok", "Bugün henüz haber yok") ve **üstteki özet
cümlesi** — İlke 2 ve 3.

## Ekran 2 — Şantiye sayfası (WhatsApp'ta bir grubun içi)

En çok açılan ekran.

```
┌──────────────────────────────────────┐
│ ‹  BAHÇELİEVLER KONUTLARI     📞  ⓘ │  ad + altında sorumlu
├──────────────────────────────────────┤
│      · Şantiye oluşturuldu ·         │  sistem satırları (gri)
│      · Sorumlu: Ahmet Yılmaz ·       │
│             — DÜN —                  │
│  [ gönderi ]                         │  en eski üstte
│  ─── buradan aşağısı yeni ───        │
│            — BUGÜN —                 │
│  [ gönderi ]                         │  en yeni EN ALTTA
├──────────────────────────────────────┤
│  📷 │ Bir not yaz…          │  🎤   │
└──────────────────────────────────────┘
```

| Parça | Karar |
|---|---|
| **Akış yönü** | **En eski üstte, en yenisi altta; sayfa açılınca dibe iner.** Yukarı kaydırınca geçmiş yüklenir ve ekran zıplamaz (eklenen yükseklik kadar aşağı kaydırılır). |
| Künye | Ayrı kart değil, başlığın kendisi: şantiye adı, altında sorumlu; sağda 📞 ve ⓘ. Sorumlu yoksa alt satır hiç yazılmaz. |
| Akışın başı | WhatsApp'taki "grup oluşturuldu" satırlarının karşılığı: `· Şantiye oluşturuldu ·`, `· Sorumlu: Ahmet Yılmaz ·`. Yalnızca bütün geçmiş yüklendiğinde görünür. |
| Boş şantiye | Sistem satırları durur; patron aynı yerde **"Davet linki gönder: Ahmet"** düğmesini görür. İlk gönderi gelince düğme kendiliğinden kaybolur. |
| Yeni ayracı | Önceki bakıştan sonra gelenlerin **üstüne** ince çizgi: "Buradan aşağısı yeni". |
| Gönderme | Sayfanın altında sabit çubuk: 📷 kamera/galeri → önizleme, yazı doğrudan çubuğa, 🎤 basılı tut. Yazı varken 🎤 yerine ➤. |
| Alt sekmeler | Bu sayfada gizlenir (WhatsApp'ta sohbetin içi gibi); tek şantiyeli şefte kalır. |

**"En yeni üstte" kararı geri alındı (4. tur).** Gerekçesi "bu bir sohbet değil, defter"di; ama kabuğu
WhatsApp yapıp içeriyi ters akıtmak, alışkanlığı tam da en çok kullanılan yerde bozuyordu. Şantiye günü
kronolojiktir: sabah demir geldi, öğlen beton döküldü. Hikâye baştan okunur.

## Ekran 3 — Şantiye kurma (WhatsApp'ta grup kurma)

Listenin başlığındaki ＋ (yalnızca patron):

1. **Tek pencere:** Şantiye adı (zorunlu) · Adres (isteğe bağlı) · **Sorumlu**: ekipten seç / yeni kişi
   ekle (ad soyad + telefon) / sonra atarım.
2. **Kaydedince şantiyenin içine düşülür** — WhatsApp'ta grup kurunca içine düştüğün gibi.
3. Orada sistem satırları ve **"Davet linki gönder"** düğmesi hazır durur: link WhatsApp'tan gider,
   şef şifresiz girer.

Sorumlu ataması burada yapılabilir, çünkü patronu "önce Ekip'e git, kişiyi ekle, sonra geri dön"
yolculuğuna çıkarmak tek bir iş için üç ekran demekti.

## Masaüstü: solda liste, sağda şantiye (WhatsApp Masaüstü)

| Parça | Karar |
|---|---|
| Sol menü | `el-menu` `collapse`: tek günlük öğe (🏗 Şantiyeler) ve altında Yönetim grubunda 👥 Ekip. Seçili öğe baret sarısı zeminde lacivert yazı. |
| Liste | Mobildeki satırın aynısı: ad · saat · önizleme · okunmadı rozeti. Kart, ızgara, fotoğraf yok. |
| Sağ panel | Seçili şantiyenin akışı; adres `/santiyeler/:id`, bağlantı paylaşılabilir, geri tuşu çalışır. Akış yönü ve "Daha eski gönderiler" düğmesi mobildekiyle aynı mantıkta (düğme yukarıda). |
| Künye | Başlıkta şantiye · sorumlu · 📞; adres ve bu haftanın fotoğrafları ⓘ çekmecesinde. |
| Hesabım | Sol alttaki kullanıcı düğmesinin açtığı panel; ayrı sayfa yok. |

## Ekran genişlikleri

Kabuk açılışta bir kez seçilir; kabuğun içi her genişliğe kendiliğinden uyar.

| Ekran | Kabuk | Düzen |
|---|---|---|
| Telefon (≤ 768px) | Mobil (Vant) | Tam genişlik |
| Dokunmatik tablet (≤ 1024px) | Mobil | Sayfa, başlık, gönderme çubuğu ve alttan açılan pencereler 640px'lik ortalı sütunda |
| Bilgisayar, dar pencere (< 1200px) | Masaüstü (Element Plus) | Sol menü ikonlara iner (açmak geçicidir); liste 280-360px arasında incelir |
| Bilgisayar, geniş | Masaüstü | Menü tercih neyse o; liste 360px, akış 760px'te ortalı |

- Eşikler tek yerdedir: `core/platform/breakpoints.ts`. CSS'e kırılım noktası yazılmaz; genişlikler
  `tokens.css`'teki `--layout-*` ölçüleriyle (tavanlı `max-width`, `clamp`) verilir.
- Ekran yüksekliği `100dvh`: tablette tarayıcı çubuğu açılınca gönderme çubuğu ekranın altında kaybolmaz.
- "Mobil/masaüstü görünüme geç" tercihi eşikten önce gelir. Tablet döndürülünce kabuk değişmez: kabuk
  değişimi sayfayı yeniler, yarım yazılmış not kaybolurdu.

## Navigasyon

| | Patron | Şef |
|---|---|---|
| 1 | Şantiyeler | Şantiyem (doğrudan kendi akışı) |
| 2 | Ben | Ben |

Ekip yönetimi "Ben" altında, masaüstünde sol menüdeki "Yönetim" grubunda. Şantiye ayarları ayrı bir ekran
değildir: ekleme listedeki ＋, düzenleme şantiyenin ⓘ çekmecesinde.

## Gönderi silme ve düzeltme

| Kural | Karar |
|---|---|
| Kim silebilir | Yazar kendi gönderisini, patron her gönderiyi |
| Kim düzeltebilir | Yalnızca yazar: başkasının ağzından yazılmaz |
| Ne düzeltilir | Yalnızca yazı. Fotoğraf yanlışsa gönderi silinip yeniden atılır. |
| İz | "Bu gönderi silindi · Patron · 22 Eylül 14:20"; düzeltilende saatin altında "düzenlendi" (İlke 6) |
| Silinen içerik | Yazı ve dosyalar gerçekten silinir; satır iz olarak kalır. |
| Nasıl | Mobilde uzun basınca alttan menü, masaüstünde kartın köşesinde `⋯` |

## Askıya alınanlar

**Sorunlar modülü (4. turda arayüzden kaldırıldı).** Menü, sorun kuyruğu, çözülenler arşivi, kırmızı
etiketler, "sorun olarak işaretle" anahtarı ve "Çözüldü" düğmeleri arayüzden çıktı. Gerekçe: aynı gönderi
iki ayrı yerde iki ayrı kılıkta yaşıyordu ve ekranın öğrenilmesi gereken kavram sayısını ikiye katlıyordu.
Sorunun takibi ileride **başka bir kılıkta** ele alınacak (konuşulan seçenek: grubun içinde sabitlenmiş
mesaj + listede kırmızı önizleme). Backend'e dokunulmadı: `posts.issue`, çözüm kaydı, bildirim ve uçlar
yerinde duruyor, veri kaybı yok.

**Bildirimler.** Push'un tek tetikleyicisi sorun bildirimiydi; sorun arayüzden kalkınca bildirim de
fiilen sessizleşti. Ana ekrandaki "bildirim al" hatırlatması kaldırıldı, anahtar "Ben"de kaldı. Neyin
bildirim göndereceği (ör. akşam 17:00'de rapor göndermemiş şefe hatırlatma) ayrıca kararlaştırılacak.

## Sonraki turda konuşulacaklar

- **Gönderi kartı mı, baloncuk mu?** Şu an gönderiler beyaz kart (avatar · ad · saat · yazı · fotoğraf).
  WhatsApp'ta mesaj baloncuktur ve kendi mesajın sağda durur. Fotoğraf raporlarının geniş okunması için
  kart tercih edildi; tanıdıklık istenirse baloncuğa çevrilir.
- Gönderinin "gidiyor" hâli: çevrimdışı kuyrukta bekleyen gönderi şu an ayrı bir liste; WhatsApp'ta
  akışın içinde soluk mesaj + ⏳ olarak durur.
- İlk açılış: sıfır şantiye, sıfır kişiyken patronun ilk on dakikası.
