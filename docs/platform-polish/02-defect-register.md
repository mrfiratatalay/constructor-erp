# 02 — Kusur kaydı

Önem: P0 engelleyici · P1 kritik · P2 büyük · P3 cila. Tür: UI, UX, Fonksiyonel, Responsive, Erişilebilirlik, Mimari,
Güvenlik. Her satırın düzeltmesi tek bir commit'tir (branch geçmişinde aynı başlıkla). "Doğrulama" gerçek uygulamada,
tarayıcıda (Playwright, masaüstü 1440×900 / telefon 390×844) ya da doğrudan API ile yapıldı.

## Düzeltilenler

| ID | Modül | Yüzey | Tür | Önem | Gözlenen | Kök neden | Düzeltme | Doğrulama |
|---|---|---|---|---|---|---|---|---|
| D-01 | Platform özeti | Backend | Fonksiyonel | P2 | Kurulumu tamam ilk firma sürekli "1 kurulum bekliyor" | `BootstrapOwner` `completeSetup` çağırmıyordu | Kurulurken işaretleniyor; V30 eski kaydı düzeltiyor | API `pendingSetup: 0`, ekran |
| D-02 | Platform özeti | Her ikisi | UX | P3 | Tahsilat yokken eksen "₺0,5 / ₺1"; yüklenirken ve hatada boş sayfa | Grafik sıfır veride de çiziliyordu; isPending/isError kullanılmıyordu | Boş, yükleme ve hata durumları; uzun etiket kısaldı | Ekran |
| D-03 | Yoklama | Masaüstü | UI | P3 | Uzun ad satırı 5 satıra şişiriyor | `EntryName` adı sınırsız kırıyordu | En çok 2 satır, tamamı `title` | Ekran |
| D-04 | Davet, katılma | Her ikisi | UX | P2 | Geçersiz bağlantıda çıkmaz sokak (düğme yok) | Kurulumdaki çıkış düğmesi diğerlerinde yoktu | `LinkFailed` molekülü (3. tekrar) | Ekran ×6 |
| D-05 | Giriş | Masaüstü | UX | P3 | İngilizce "Please fill out this field"; düzeltilen alanda eski "hatalı" uyarısı | Yerel `required`; mutasyon hatası sıfırlanmıyordu | Element Plus kuralları, `clearError` | Akış |
| D-06 | Giriş | Telefon | UI | P3 | Hata turuncu; eski uyarı kalıyor | `van-notice-bar`'da `type` özelliği yok (Vant 4.10) | Renk token'ı, `clearError` | Akış |
| D-07 | Saha | Telefon | Fonksiyonel | P2 | "Sorun" etiketi kapatılamıyor | `closable` yazılmış, Vant'ta `closeable` | Doğru özellik | ✕ tıklandı, etiket kalktı |
| D-08 | Malzeme | Telefon | UI | P2 | Miktarın yanında birim yok | `van-field`'da `suffix` özelliği yok | `#button` yuvası | Ekran |
| D-09 | Malzeme | Telefon | UX | P2 | İrsaliye belgesi uygulamanın yerine açılıyor | `van-cell` `url` = `location.href`; `target` etkisiz | Hücre gerçek `<a target=_blank>` | Kod + DOM |
| D-10 | Boş durumlar | Telefon | UI | P3 | İkon sol üstte, yazıyla arası ~300 px | 160 px'lik resim kutusu | Temada tek kural (5 sayfa) | Ekran |
| D-11 | Malzeme | Telefon | UI | P3 | Başlık logosunda firma yerine "M" | Baş harfler başlıktan çıkıyordu | `logoName` | Ekran |
| D-12 | Malzeme | Masaüstü | Fonksiyonel | P2 | Çok kalemli sevkiyatta Sil düğmesi örtülü, birim yok | `el-input-number` 150 px, sütun 120 px | Genişlik %100, `#suffix` birimi | DOM ölçümü + ekran |
| D-13 | Platform / yeni firma | Masaüstü | UX | P3 | "Firma adı ve paket gerekli" (paket zaten seçili), üstte kayboluyor | Tek toast | Form kuralı, hatalı alana kaydırma | Akış |
| D-14 | Platform / ödeme | Masaüstü | UI | P3 | "Ödeme" başlığı altında yine "Ödeme" | Tekrar eden etiket | Etiket kalktı | Ekran |
| D-15 | Platform / abonelik | Masaüstü | UI | P3 | "2027-09-30 tarihinde bitiyor" | Ham ISO tarih | `fullDate`, boşluk | Ekran |
| D-16 | Şantiyeler | Masaüstü | Responsive | P2 | Uzun firma adı liste başlığını 3 satıra çıkarıp taşırıyor | Başlık kırılıyor, ızgara izi metne göre genişliyor | Tek satır + `minmax(0,1fr)` | Ekran |
| D-17 | Tüm ana ekranlar | Telefon | Responsive | P2 | Uzun firma adı lacivert başlıkta ＋'nın üstüne biniyor | Sınırsız genişlik | `BrandTitle` molekülü (MobilePage 200 satırı aşıyordu) | Ekran 390 / 360 |
| D-18 | Başvuru, kurulum | Her ikisi | UX | P3 | Düzeltilen alanın uyarısı kalıyor | Uyarı yalnızca gönderimde hesaplanıyordu | Açık uyarı her değişiklikte yeniden değerlendiriliyor | Akış |
| D-19 | Başvuru | Telefon | UI | P2 | Teşekkür ekranında kırık resim | `image="success"` Vant'ta yok, `<img src=success>` | Onay ikonu | Ekran |
| D-20 | Tanıtım | Telefon | UI | P3 | Kısa sayfada alt bilginin altında beyaz şerit | Sütun düzeni yok | Flex sütun, son bölüm uzar | Ekran |
| D-21 | Firma / abonelik | Her ikisi | UI | P3 | "5 / sınırsız" altında anlamsız çubuk; telefonda eşik rengi yok | Çubuk her durumda çiziliyordu | `limited` + ortak `usageLevel` | Ekran (Starter 3/3 kırmızı) |
| D-22 | Tüm hata mesajları | Telefon | UI | P2 | Uzun hata "ak / tif şantiye sını / rı" | Vant toast `break-all`, 88 px | Kelime bölünmez, kutu genişler | Ekran |
| D-23 | Sohbet, Saha | Telefon | Fonksiyonel | P1 | Gönder'e çift dokununca mesaj sunucuya 2 kez gidiyor | Kuyruk yazımı beklenirken form dolu; ikinci çağrı geçiyor | `oneAtATime` | 2 kopya → 1 |
| D-24 | Platform / ödeme, dönem | Her ikisi | Fonksiyonel | P1 | Çift tıklama 2 ödeme kaydediyor | Düğmelerde bekleme kilidi yok | `useTenantActions.isBusy` | Önce 2 POST, sonra 1 |
| D-25 | Platform / paketler | Masaüstü | UI | P3 | Düzenle düğmeleri farklı hizada | Kart boyları farklı | Kart aynı boy, alt kısım dipte | Ekran |
| D-26 | Platform tabloları | Masaüstü | UI | P3 | Uzun ad 3–4 satır, slug yarım | Kırpma yok | 2 satır / tek satır + ipucu | Ekran |
| D-27 | Yoklama | Backend | Fonksiyonel | P1 | Aynı anda iki işaret → 500 | Oku-yoksa-ekle yarışı (duplicate key) | Kadro satırı `for update`; toplu işarette sıralı kilit | 8 eşzamanlı istek: hepsi 200 |
| D-28 | Şantiye sabitleme | Backend | Fonksiyonel | P2 | Eşzamanlı sabitleme → 5×500 | Aynı yarış | `insert … on conflict do nothing` | 6 istek: hepsi 204 |
| D-29 | Okundu bilgisi | Backend | Fonksiyonel | P1 | Şantiyeyi iki sekmede açmak → 500 | Aynı yarış (her açılışta çağrılır) | İlk bakış atomik, var olan kilitli | 6 istek: hepsi 200, önceki an doğru |
| D-30 | Yoklama | Telefon | UX | P3 | Liste boşken "Seç" | Koşulsuz düğme | `!isEmpty` | Ekran |
| D-31 | Platform tabloları | Masaüstü | Responsive | P2 | 1366 px'te Kurulum sütunu kesik, Durum seçici örtülü | Sütun toplamı > içerik alanı | Genişlikler sıkılaştı | 1366 ve 1440 ekran |
| D-32 | Başvurular | Telefon | UI | P3 | "· ·" ve "? şantiye"; renk masaüstünden farklı | Boş alanlar birleştiriliyordu; renk elle | `joined`, ortak ton tablosu | Ekran |
| D-33 | İlerleme | Telefon | UI | P3 | Boş durum açıklaması sola yaslı | Hizalama yok | Ortalı | Ekran |
| D-34 | İlerleme | Her ikisi | UX | P3 | "Bugün güncellenen" ↔ "Son 24 saat" çelişkisi, iki satır | Metin | "Güncellenen" | Ekran |
| D-35 | İlerleme | Masaüstü | UI | P3 | Tek başına sağ üst bildirim kartı | `ElNotification` (40 dosyada `ElMessage`) | `ElMessage` | Akış |
| D-36 | Onay pencereleri | Her ikisi | UX | P2 | Yıkıcı onaylar kimi yerde kırmızı kimi yerde mavi | 17 ayrı çağrı | `confirmAction` (iki kabuk) | Ekran |
| D-37 | Malzeme | Masaüstü | Fonksiyonel | P3 | UTC batısında sevkiyat tarihi bir gün önce görünür | `new Date('YYYY-MM-DD')` UTC okur | `dayWithYear` | Ekran |
| D-38 | Masaüstü tam sayfalar | Masaüstü | UI | P3 | Sayfa değişince başlık yana kayıyor (20/24/32 px) | Ayrı ayrı dolgu | `--layout-page-padding` | Ekran |
| D-39 | Malzeme | Her ikisi | Fonksiyonel | P3 | Ortadan kalem silince satır durumu kayabilir | `:key="index"` | `newLine()` kararlı anahtar | 3 kalemden ortadaki silindi |
| D-40 | Bütün ad listeleri | Backend | UX | P2 | Ç, Ş, Ö, Ü, İ ile başlayan adlar listenin sonunda | Alpine/musl bayt sırası; Java'da Türkçe olmayan sıralayıcı | V31 `tr-x-icu`; `TurkishOrder` | SQL + API sırası |
| D-41 | Oturum | Her ikisi | UX | P3 | Oturum düşüp tekrar girince ana sayfaya dönülüyor | `next` taşınmıyordu | `next` = bulunulan adres | `/giris?next=/yoklama` → `/yoklama` |

## Açık kalanlar (bilinçli)

| ID | Konu | Neden açık |
|---|---|---|
| A-01 | 4 uçtan uca test (`auth.spec.ts` 2, `platformShell.spec.ts` 1; iki projede) | `main`'de de aynı şekilde kırmızı: testler ürünün sonraki bilinçli değişikliklerinin gerisinde kalmış (katılma mesajının metni, masaüstünde `/ben`'in panel olması, hesap düğmesinin adının "Hesabım" olması). Talimat gereği test koduna dokunulmadı. |
| A-02 | "Kurulum linki" / "Kurulum bağlantısı" | Terim kararı ürün sahibinin. İşlem geçmişindeki eski kayıtlar sabit metindir. |
| A-03 | iPhone / iPad (WebKit) e2e projeleri | Bu ortamda WebKit kurulu değil; Android ve masaüstü projeleri koşuldu. |
