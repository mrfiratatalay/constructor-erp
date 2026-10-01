# 03 — Mimari ve kod kalitesi denetimi

## Genel durum

Kod tabanı başlangıçta güçlüydü: Anayasa'nın boyut sınırları (dosya 200, fonksiyon 30 satır) ESLint ve Checkstyle ile
derlemede denetleniyor; en büyük elle yazılmış dosya 198 satır. Katmanlar temiz (sayfa → organizma → molekül → atom;
`core` UI kütüphanesi kullanmıyor; Controller → Service → Repository). Bu yüzden iş dosya bölmekten çok, gerçek
uygulamada görünen kusurları kök nedeninden düzeltmek ve tekrar eden kalıpları birleştirmek oldu.

| Denetim | Sonuç |
|---|---|
| > 300 satır elle yazılmış dosya | Yok (en büyük 198). Bu çalışmada sınırı aşan tek dosya `MobilePage.vue` (208) oldu, `BrandTitle` ayrılarak 188'e indi. |
| `console.*`, `debugger`, `any`, boş `catch`, unutulmuş TODO | Yok |
| Dizinle anahtarlanan düzenlenebilir liste | 2 yer (sevkiyat kalemleri, iki kabuk) → kararlı anahtar (D-39). Salt okunur ödeme listesi zararsız, kaldı. |
| Kullanılmayan kod | `SitePin` ve `SiteVisit`'in kullanılmayan kurucuları; `components.d.ts`'teki 10 bayat bileşen kaydı → temizlendi |
| Bileşen API uyumu (Vant 4.10.2, Element Plus 2.14.6) | `vue-tsc` geçici olarak `strictTemplates` ile koşuldu: 4 geçersiz özellik bulundu ve düzeltildi (D-06, D-07, D-08, D-09); bir geçersiz hazır resim adı (D-19). Kurulu sürümlerin kaynak kodu `node_modules`'tan doğrulandı; sürüm yükseltilmedi. |

## Eklenen ortak parçalar (Üç Kuralı)

| Parça | Nerede | Neyi birleştirdi |
|---|---|---|
| `desktop/confirmAction.ts`, `mobile/confirmAction.ts` | Onay pencereleri | 17 ayrı `ElMessageBox.confirm` / `showConfirmDialog` çağrısı; yıkıcı işte kırmızı onay tek kural |
| `desktop/molecules/LinkFailed.vue`, `mobile/molecules/LinkFailed.vue` | Kurulum, davet, katılma | Geçersiz bağlantı ekranı ve çıkış düğmesi |
| `mobile/molecules/BrandTitle.vue` | Lacivert ana başlık | Logo + tek satır ad (MobilePage'den ayrıldı) |
| `core/billing/billingLabels.usageLevel` | Abonelik çubuğu | Masaüstü ve telefonun ayrı ayrı yazdığı %80 / %100 eşiği |
| `core/posts/useComposer.oneAtATime` | Gönderme | Çift gönderim kilidi |
| `core/admin/useTenantActions.isBusy` | Platform işlemleri | Ödeme, dönem, firma düzenleme kilitleri |
| `common/text/TurkishOrder` (backend) | Bellekte sıralama | İki ayrı `Collator` tanımı + Türkçe olmayan bir sıralayıcı |
| `--layout-page-padding` (token) | Masaüstü tam sayfalar | 20/24/32 px karışık kenar boşlukları |
| Mobil tema kuralları | `van-empty`, `van-toast` | Beş sayfadaki boş durum ikonu, bütün uzun hata mesajları |

## Eşzamanlılık (backend)

Gerçek tarayıcı akışında görülen bir 500 hatası, aynı kalıbın sistematik taranmasına götürdü: "önce bak, yoksa ekle"
(read-then-insert). Eşzamanlı isteklerle denendi:

| Uç | Önce | Düzeltme | Sonra |
|---|---|---|---|
| `PUT /puantaj/days/{day}/entries/{id}` | 2 eşzamanlı istekte 500 | Kadro satırı `select … for update` | 8/8 200 |
| `PUT /sites/{id}/pin` | 6'da 5 × 500 | `insert … on conflict do nothing` | 6/6 204 |
| `POST /sites/{id}/visits` | 6'da 5 × 500 | Atomik ilk ekleme + kilitli güncelleme | 6/6 200 |
| `PUT/DELETE /posts/{id}/field`, `PUT /posts/{id}/pin` | 6/6 200 | — (zaten güvenli) | — |

## Güvenlik ve firma izolasyonu

İki firma (Kızılkan İnşaat, Yıldız Yapı) ve dört rolle doğrudan API üzerinden denendi:

- B firmasının patronu A'nın şantiye, gönderi, sevkiyat, görev, ilerleme, işçi, kütüphane ve medya kayıtlarına
  erişemiyor (hepsi 404; varlık bile belli edilmiyor). Düzenleme ve silme denemeleri de 404.
- Excel dökümleri (sevkiyat, puantaj) yalnızca kendi firmasının verisini içeriyor.
- Çalışan: malzeme, sevkiyat, ilerleme, puantaj dökümü, kişi yönetimi ve platform uçlarına 403. Şantiye açabilmesi
  ve katılma bağlantısını görebilmesi bilinçli kararlar (kodda gerekçesiyle yazılı); bağlantıyı sıfırlamak patronda.
- Firma patronu platform uçlarına 403; oturumsuz medya isteği 401.
- Paket koruması: Starter'a alınan firmada malzeme ve ilerleme uçları 403 (`FEATURE`), arayüzde rotalar ana sayfaya
  yönleniyor; plan sınırı (`PLAN_LIMIT`) sunucuda uygulanıyor.

## Öneriler (ürün sahibinin kararı)

1. **Alt tablolarda `company_id` ve RLS (Anayasa Madde 9).** `material_shipment_lines`, `material_shipment_events`,
   `material_field_posts`, `site_events`, `site_pins`, `site_visits`, `notifications`, `attendance_entries`
   tablolarında `company_id` yok; izolasyon ana tablo (RLS'li) ve uygulama kontrolü üzerinden sağlanıyor ve testlerde
   sızıntı görülmedi. Ancak açılıştaki `TenantIsolationAudit` yalnızca `company_id` kolonu olan tabloları denetlediği
   için bu tablolar ikinci savunma katmanının dışında. Önerim: kolonu ekleyip doldurmak ve `enable_company_isolation`
   ile korumak. Sekiz tabloluk bir şema değişikliği olduğu için bu çalışmada yapılmadı.
2. **Terim:** "link" ve "bağlantı" yan yana kullanılıyor ("Giriş linki", "Kurulum bağlantısı", "Bu kurulum linki
   geçersiz"). Tek terime karar verilirse metinler bir commit'te birleştirilebilir.
3. **Uçtan uca testler:** dört test ürünün sonraki bilinçli değişikliklerinin gerisinde (bkz. 02, A-01).
