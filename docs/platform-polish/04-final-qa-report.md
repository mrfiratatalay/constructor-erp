# 04 — Final QA raporu

Branch: `claude/serene-gauss-cs3nci` (güncel `main`'den, 83a730e). Tarih: 1 Ekim 2026.
Ortam: PostgreSQL 18 (Docker), backend Java 25 jar (`local` profil), Vite geliştirme sunucusu; Chromium (Playwright).

## Kapsam

| Ölçü | Değer |
|---|---|
| Rota tablosundaki adres | 25 + bilinmeyen adres yönlendirmesi (bkz. 01) |
| Modül | Tanıtım sitesi, giriş/davet/katılma/kurulum, Şantiyeler (Sohbet, Saha, İlerleme, Görevler), Yoklama ve Puantaj, Malzemeler, Firma ve abonelik, Hesabım, kilit ekranı, platform yönetimi (özet, firmalar, firma, başvurular, paketler, işlem geçmişi) |
| Rol | Ziyaretçi, patron, şef, çalışan, süper yönetici; iki firma (biri Starter paketinde) |
| Masaüstü 1440×900 | 41 ekran × her turda (ilk tur, düzeltme sonrası, final) |
| Telefon 390×844 | 41 ekran |
| Küçük ekran regresyonu | 1366×768 ve 360×800'de aynı 82 ekran |
| Elle sürülen akış | Giriş (yanlış şifre, boş, çift tıklama), kurulum sihirbazı, başvuru, yeni firma, ödeme, dönem uzatma, askıya alma, mesaj gönder/düzelt/sil, saha sorunu, sevkiyat (çok kalemli, iptal), yoklama işaretleme, görev, iş kalemi ve günlük giriş, plan sınırı, oturum düşmesi, görünüm geçişi |

## Kusurlar

| | Sayı |
|---|---|
| Bulunan ve düzeltilen | 41 (bkz. 02) |
| P0 | 0 |
| P1 | 4 — çift gönderilen mesaj, çift kaydedilen ödeme, iki eşzamanlı istekte 500 (yoklama, okundu) |
| P2 | 14 |
| P3 | 23 |
| Açık | 3, hepsi bilinçli (bkz. 02 "Açık kalanlar") |

## Kod kalitesi

- 300 satırı aşan elle yazılmış dosya yok; 200 sınırını aşan tek dosya (`MobilePage.vue`) bölündü.
- Eklenen ortak parçalar ve kaldırılan tekrarlar: bkz. 03. Onay pencereleri (17 çağrı), geçersiz bağlantı ekranı,
  marka başlığı, abonelik eşikleri, çift gönderim kilidi, Türkçe sıralayıcı, sayfa kenar boşluğu token'ı.
- Ölü kod: iki kullanılmayan kurucu, 10 bayat bileşen tip kaydı.
- Kütüphane sürümleri değişmedi (Element Plus 2.14.6, Vant 4.10.2); bileşen özellikleri kurulu sürümün kaynağından
  doğrulandı.

## Doğrulama

| Kontrol | Komut | Sonuç |
|---|---|---|
| Frontend lint + tip + birim | `npm run check` | Geçti (ESLint, oxlint, vue-tsc, 45/45 test) |
| Üretim derlemesi | `npm run build-only` | Geçti |
| Backend Checkstyle + testler | `./mvnw verify` (Testcontainers, PostgreSQL 18) | Geçti: 60/60, BUILD SUCCESS |
| Uçtan uca | `npx playwright test` (Android + masaüstü) | 20 geçti, 4 kırmızı — aynı 4 test `main`'de de kırmızı (bkz. 02, A-01) |
| Final ekran turu | 82 ekran (1440 + 390) | Sayfa düzeyinde yatay taşma 0, beklenmeyen konsol/ağ hatası 0 |
| Küçük ekran turu | 82 ekran (1366 + 360) | Sayfa düzeyinde yatay taşma 0 |

Görülen 4xx'lerin tamamı beklenen cevaplar: misafirin oturum yoklaması (401) ve geçersiz bağlantı denemeleri (400).

## UI/UX

- Masaüstü: uzun adlar (firma, kişi) tabloları ve başlıkları taşırmıyor; tablolar 1366 px'te kaydırmasız; sayfalar
  aynı kenar boşluğuyla başlıyor; onaylar ve başarı bildirimleri tek kalıpta.
- Telefon: Vant bileşenlerine verilen geçersiz özellikler düzeltildi (kapatma ✕, birim, belge bağlantısı, hata rengi,
  kırık resim); boş durumlar ortalı; uzun hata mesajları okunur; uzun firma adı başlıktaki ＋'yı örtmüyor.
- Erişilebilirlik: form hataları alanın altında ve Türkçe; ikon başlıkların `title`/`aria-label`'ı var; yıkıcı
  işlemler onaylı ve renkle birlikte yazıyla da belirtiliyor.

## Güvenlik

- Firma izolasyonu: A ↔ B arası bütün okuma/yazma denemeleri 404; dökümler yalnızca kendi verisi; medya firmaya göre.
- Rol yetkileri: çalışan, patron ve süper yönetici sınırları sunucuda uygulanıyor (403).
- Paket ve plan sınırları sunucuda (`FEATURE`, `PLAN_LIMIT`).
- Öneri: alt tablolara `company_id` + RLS (bkz. 03, Öneri 1).
