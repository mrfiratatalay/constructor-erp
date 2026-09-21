# Kızılkan Şantiye — Proje Anayasası

Bu dosya projenin temel kurallarıdır. Kod yazan herkes (insan ya da yapay zekâ) buna uyar.
Kurallar yalnızca proje sahibinin kararıyla değişir ve değişiklik bu dosyada yapılır.

## Madde 1 — Dosya ve fonksiyon boyutu

| Ölçü | Hedef | Üst sınır |
|---|---|---|
| Dosya | 150 satır | **200 satır** |
| Fonksiyon / metot | 15 satır | **30 satır** |
| Parametre sayısı | 2-3 | **4** (fazlası bir nesneye toplanır) |
| İç içe blok derinliği | 2 | **3** (derinleşen kod erken `return` ile düzleştirilir) |

Sınırı aşan dosya bölünür; istisna yoktur. Bu sınırlar otomatik denetlenir:
frontend'de ESLint, backend'de Checkstyle. İhlal eden kod build'den geçmez.

## Madde 2 — Tek sorumluluk

Her dosya, sınıf ve fonksiyon tek bir iş yapar. Ne yaptığını "ve" bağlacı kullanmadan
söyleyemiyorsan bölünmelidir.

- Vue bileşeni görüntüden sorumludur. İş mantığı ve veri çekme `core/` altındadır.
- Backend'de Controller yalnızca HTTP'yi karşılar, Service iş kuralını uygular,
  Repository veriye erişir. Katman atlanmaz.

## Madde 3 — Tekrar etme (Üç Kuralı)

Aynı şey ikinci kez yazıldığında fark edilir, **üçüncüde** ortak fonksiyon, bileşen ya da
sınıf olur. İlk tekrarda değil, çünkü iki örnekten doğru soyutlamayı çıkarmak zordur ve
yanlış soyutlama, tekrardan daha pahalıdır.

Ortak kodun yeri: frontend'de `core/` (mantık) ya da `shared/` (görünüm), backend'de `common/`.

## Madde 4 — Frontend: atomik tasarım

Bileşenler beş katmandır. Bir katman **yalnızca kendinden alttaki** katmanları import eder.

| Katman | Tanım | Örnek |
|---|---|---|
| `atoms/` | En küçük parça. İş mantığı yok, yalnızca props ve event. | `StatusTag`, `UserAvatar` |
| `molecules/` | Birkaç atomun birlikte yaptığı tek küçük iş. | `PostMeta` (avatar + isim + zaman) |
| `organisms/` | Ekranın kendi içinde bütün bir bölümü. `core` composable'larını kullanabilir. | `PostCard`, `UpdateForm` |
| `templates/` | Sayfa iskeleti. Veri yok, yalnızca yerleşim ve slot. | `MobileShell`, `FeedTemplate` |
| `pages/` | Route'a bağlı sayfa. Veriyi composable'dan alır, alt katmanlara dağıtır. | `TodayPage`, `SiteFeedPage` |

```
frontend/src/
├── app/       açılış: platform seçimi, router, eklentiler
├── core/      ortak beyin: api, auth, stores, composables, utils. .vue ve UI kütüphanesi YOK
├── shared/    kütüphanesiz ortak bileşenler (atoms, molecules, organisms) + styles
├── mobile/    yalnızca Vant   — atoms … pages + routes.ts
└── desktop/   yalnızca Element Plus — atoms … pages + routes.ts
```

- `core` ve `shared` hiçbir UI kütüphanesini import etmez. `mobile` Element Plus'ı,
  `desktop` Vant'ı asla kullanmaz. Klasör dışına yapılan import'lar `@/` ile yazılır.
- Kendi bileşenlerimiz her zaman açıkça import edilir; kodu okuyan nereden geldiğini görür.

## Madde 5 — Backend: özellik bazlı paketler

```
com.atalay.santiye
├── common/       ortak: hata yönetimi, temel sınıflar, ayarlar
└── <özellik>/    ör. site/ → SiteController, SiteService, SiteRepository, Site, dto/
```

- Controller entity döndürmez; dışarıya yalnızca DTO (`record`) çıkar.
- Veritabanı şeması yalnızca Flyway migration'ı ile değişir (`ddl-auto: validate`).
  Yayınlanmış bir migration düzenlenmez, yenisi yazılır.
- Şifre ve anahtarlar koda ve repoya girmez; ortam değişkeninden okunur.

## Madde 6 — İsimlendirme

- Kod İngilizce, arayüz Türkçe. İngilizce karşılığı olmayan alan terimleri olduğu gibi
  kalır: `hakedis`, `puantaj`.
- İsim ne yaptığını söyler: `data`, `temp`, `handle2` gibi isimler yasaktır.
- Frontend: bileşen dosyası = bileşen adı (PascalCase, en az iki kelime: `BrandLogo.vue`);
  TypeScript dosyası camelCase (`choosePlatform.ts`); composable `useX`; dosya başına tek bileşen.

## Madde 7 — Yorumlar

Kod *ne* yaptığını kendisi anlatır; yorum *neden* böyle yapıldığını anlatır.
Kodu tekrar eden yorum yazılmaz.

## Madde 8 — Bağımlılıklar

Yeni bir kütüphane yalnızca ihtiyaç duyulduğu anda eklenir, "belki lazım olur" diye eklenmez.
