# Yoklama modülü için görsel referanslar

Fırat 28 Eylül 2026'da bu örnekleri paylaştı: yoklama modülünün bunlar kadar göze hoş görünmesi isteniyor.
İkisi de gerçek bir ürün değil, konsept tasarım (Tuester ve Sage). Birebir kopyalanmayacaklar. Aşağıda
neyin neden güzel göründüğü, bizim ilkelerimize (TASARIM.md) göre neyi alıp neyi almadığımız ve
bunların **CSS yazmadan** Element Plus ve Vant ile nasıl kurulacağı var.

| Dosya | Ne |
|---|---|
| `01-tuester-aylik-cetvel.webp` | Tuester: kişi × gün aylık cetvel, düz görünüm |
| `02-tuester-aylik-cetvel-egik.webp` | Aynı ekran, eğik sunum |
| `03-tuester-tablet.webp` | Aynı ekran tablette: cetvel sağa taşıyor |
| `04-sage-haftalik-acik.webp` | Sage: özet kartları + haftalık görünüm, açık tema |
| `05-sage-haftalik-koyu.webp` | Aynı ekran, koyu tema |

## 1. Tuester: aylık cetvel

**Ekranda ne var:**
- Sol menü açık gri. Seçili öğe ("Time and Attendance") beyaz kart içinde, mor yazıyla duruyor.
- Başlığın altında sekmeler var: Timesheets · **Attendance** · Manual Time. Seçili sekmenin altı çizili.
- Araç satırında "This Month 📅", "+ Add Filter", sağda arama ve sütun seçici var.
- Açıklama çipleri: ✓ Attended (yeşil) · ✕ Absent (kırmızı) · ○ Below Threshold (sarı halka) ·
  ⚡ Currently Working · ● Time off (gri). Bu çipler hem renklerin açıklaması hem de filtre olarak çalışıyor.
- Cetvelin satırında seçim kutusu, avatar ve kalın isim var. Sütunlar günler (17 → 01), ilk gün sütununun önünde
  ‹ oku duruyor. Başlık satırının zemini açık gri.
- **Hücre:** ince çerçeveli, köşeleri yuvarlak, beyaz küçük bir kutu. Ortasında dolu renkli daire içinde beyaz ikon
  var (yeşil ✓, kırmızı ✕, gri nokta). 23 numaralı sütunun tamamı gri: haftalık tatil günü.
- Altta sayfalama var: "Showing 1 to 8 of 50 entries".

**Neden hoş görünüyor:** Zemin beyaz, çizgiler ince, her yerde boşluk bol. Tek vurgu rengi mor. Renk yalnızca
durum için kullanılıyor, yeşil, kırmızı ve gri dışında renk yok. Hücreler ızgarada tam hizalı, göz ritmi hemen
yakalıyor. Bir ayın tamamı tek bakışta okunuyor.

**Zayıf yanı:** Hücrede yazı yok, yalnızca ikon var. Anlamı açıklama çipleri taşıyor. Tablette cetvel ekrana
sığmıyor ve sağa taşıyor (03).

## 2. Sage: özet kartları + haftalık görünüm

**Ekranda ne var:**
- Başlık "Employee Attendance", altında gri bir alt başlık, sağda mavi "Download" düğmesi.
- **Dört özet kartı** var: Present Today 40 / "124 People Remaining", Late Entry 26, On Leave 04 /
  "Approved Leave", Absent 01 / "Without Informing". Her kartta çerçeveli kutu içinde bir ikon, büyük bir sayı ve
  gri bir açıklama satırı bulunuyor.
- Araç satırında arama, "Filter 03" ve tarih seçici var. Etkin filtreler × ile kaldırılabilen çipler olarak görünüyor.
- Tabloda satırlar kişiler; avatar, kalın isim ve gri ikinci satırda görev yazıyor. Sütunlar haftanın günleri.
- **Hücre:** sol üstte günün numarası, altında bir etiket. Etiketin zemini açık renk tonunda, çerçevesi ince, yazısı
  koyu ve başında ikon var: "✓ 8 Hours" yeşil, "ⓘ 4h 36m" turuncu (eksik saat), "☺ Leave" mor, "⊗ Absent" kırmızı.
  Bugünün sütununun zemini hafif gri, etiketinde "Active" yazıyor. Gelecek günler çapraz taralı.
- Koyu tema (05) aynı düzeni koruyor, etiketler koyu zeminde koyu tonlara dönüyor.

**Neden hoş görünüyor:** Etiketler hem renkli hem yazılı, göz rengi yakalıyor, akıl yazıyı okuyor. Pastel tonlar
yorucu değil. Kişi satırı, görev bilgisi sayesinde insan gibi duruyor. Kartlar sayfanın en üstünde durumu tek
cümleyle özetliyor.

**Zayıf yanı:** Bir hafta ekrana sığıyor ama bir ayın tamamı sığmaz. Saate dayalı etiketler ("4h 36m") giriş ve
çıkış saati tutmayı gerektiriyor.

## İkisinden çıkan güzellik kuralları

1. **Tek vurgu rengi.** Marka rengi yalnızca seçili menü, seçili sekme ve ana düğme için kullanılıyor.
2. **Renk yalnızca durum için.** Durum renkleri beş taneyi geçmiyor ve her birinin tek bir anlamı var.
3. **Açık zemin, ince çizgi, bol boşluk.** Kalın kenarlık yok, gölge çok hafif.
4. **Başlık + gri alt başlık.** Her bölümün ne olduğu bir satırla söyleniyor.
5. **Kişi satırı:** avatar, kalın isim ve gri ikinci satır.
6. **Hizalı ızgara:** hücreler aynı boyda, etiketler aynı hizada.
7. **Açıklama her zaman görünür:** renklerin anlamı ekranda yazıyor.
8. **Geçerli olmayan gün ayrışıyor** (tatil, gelecek gün): boş ya da soluk.

## Bizim modüle göre ne alıyoruz

| Öğe | Karar | Neden |
|---|---|---|
| Kişi × gün aylık cetvel (Tuester) | **Al**: Puantaj sekmesi | Puantaj cetvelinin ta kendisi |
| Yazılı, ikonlu, açık tonlu etiket (Sage) | **Al**: bugün ve haftalık görünüm | Anlamı yazı taşıyor (İlke 2) |
| Yalnızca ikonlu hücre (Tuester) | **Yalnızca ay cetvelinde** | 31 sütuna yazı sığmaz. İkonların şekli farklı (✓ ✕ ½ İ), açıklama çipleri görünür, üstüne gelince yazı çıkar |
| Durum renkleri | **Al** | Geldi yeşil · Gelmedi kırmızı · Yarım gün sarı · İzinli mavi · İşaretlenmedi gri |
| Satır seçim kutuları | **Al**: toplu işaretleme | Şef 8 kişiyi seçip tek hamlede "Geldi" der |
| Özet kartları (Sage) | **Yalnızca Bugün ekranında** | "İşaretlenmedi 3" eyleme dönüşür. Raporda sayı kartı yok (İlke 4) |
| Açıklama çipleri filtre olarak | **Al** | Hem renkleri açıklıyor hem "yalnızca gelmeyenler" filtresi oluyor |
| Kişi satırında görev (Sage) | **Al**: "Demirci" gibi | Ekiplerde iş kolu, kişide görevi |
| Saat, geç kalma, eşik, "şu an çalışıyor" | **Alma** | Giriş-çıkış saati tutmuyoruz (basit sürüm) |
| Sayfalama | **Alma** | 20-50 kişi tek sayfaya sığar |
| Taralı gelecek gün | **Alma** | CSS ister. Gelecek gün boş kalır |
| İllüstrasyon avatar | **Baş harf avatarı** | `shared/atoms/UserAvatar` hazır. Uygulaması olmayan kişi için de çalışır |
| Koyu tema | **Sonra** | İki kütüphanede de hazır. Şimdilik açık tema |
| Hoş geldin başlığı, deneme kartı, bildirim ikonları | **Alma** | Süs. Eyleme dönüşmüyor |

## CSS yazmadan karşılıkları

İkonlar projede zaten olan `lucide-vue-next`'ten gelir, yeni kütüphane eklenmez (Madde 8).

| Görseldeki parça | Masaüstü (Element Plus 2.14) | Telefon (Vant 4.10) |
|---|---|---|
| Sekmeler | `el-tabs` | `van-tabs` |
| Özet kartları | `el-row` + `el-col` içinde `el-card shadow="never"` + `el-statistic` | `van-grid :column-num="4"` |
| Açıklama / filtre çipleri | `el-check-tag` (`type` ile renkli) | `van-tag` + `van-checkbox-group` |
| Sage etiketi | `el-tag effect="light"` + lucide ikonu | `van-tag` (`type`, gerekirse `plain`) |
| Tuester hücresi | `el-icon :color="var(--el-color-success)"` ile lucide ikonu | (telefonda ay cetveli yok) |
| Kişi × gün tablosu | `el-table`: ilk sütun `fixed`, `type="selection"`, `show-summary` | kişi başına `van-cell`: ad · toplam gün |
| Kişinin ayı | `el-drawer` + `el-calendar` (gün hücresinde `el-tag`) | `van-grid :column-num="7"` + her günde `van-tag` |
| Ay seçici | `el-date-picker type="month"` ya da ‹ › `el-button` | `van-nav-bar` içinde ‹ › |
| İndir | `el-button type="primary"` + ikon | Telefonda yok |

Renkler yalnızca bileşenlerin `type` değerinden gelir (success, danger, warning, primary, info). Kendi renk
kodumuzu yazmayız.
