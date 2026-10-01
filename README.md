# Constructor ERP

Müteahhitlerin şantiyelerini WhatsApp grupları yerine tek yerden yönettiği, çok firmalı (multi-tenant) SaaS ERP.
Telefonda sade bir saha arayüzü, bilgisayarda yönetim paneli. İlk müşterisi Kızılkan İnşaat'tır.

Kod yazmadan önce **[ANAYASA.md](ANAYASA.md)** okunur: boyut sınırları, atomik tasarım ve
katman kuralları oradadır ve otomatik denetlenir. Firma ayrımı (tenant), abonelik ve platform yönetiminin
nasıl çalıştığı ve yeni bir modül eklerken izlenecek liste **[MIMARI-SAAS.md](MIMARI-SAAS.md)**'dedir.

## Yüzeyler

| Kim | Nerede | Ne yapar |
|---|---|---|
| Ziyaretçi | `/`, `/fiyatlar`, `/basvuru` | Ürünü tanır, paketleri karşılaştırır, başvurur (ödeme altyapısı yok, satış başvuruyla başlar) |
| Satın alan firma | `/kurulum/:token` | Platformun gönderdiği tek kullanımlık linkle firmasını kurar: bilgiler, logo, patron hesabı, ilk şantiye |
| Firma (patron, şef, çalışan) | `/santiyeler`, `/yoklama`, `/malzemeler`, `/firma` | Kendi çalışma alanı; yalnızca kendi verisini görür, paketi hangi modülleri açıyorsa onları |
| Constructor ERP ekibi | `/platform-admin` | Firmalar, abonelik ve ödemeler, kurulum linkleri, başvurular, paketler, işlem geçmişi |

## Yapı

| Klasör | Teknoloji |
|---|---|
| `frontend/` | Vue 3, TypeScript, Vite. Mobil: Vant, masaüstü: Element Plus |
| `backend/` | Java 25, Spring Boot 4, PostgreSQL 18, Flyway |
| `docker/`, `docker-compose.yml`, `scripts/` | Kurulum: veritabanı, backend, arayüz |

## Çalıştırma — her şey Docker'da

Tek gereken **Docker**'dır (Docker Desktop ya da Docker Engine). Java, Node, PostgreSQL kurmaya gerek yok.

```bash
git clone <depo-adresi> && cd atalay-santiye
./scripts/start.sh
```

İlk çalıştırma backend ve arayüzü derler, birkaç dakika sürer. Bitince:

| Ne | Adres |
|---|---|
| Arayüz | http://localhost:5173 |
| API dokümanı | http://localhost:8080/swagger-ui.html |
| Firma girişi (Kızılkan patronu) | `patron@kizilkan.local` / `patron123` |
| Platform yönetimi | `admin@constructor-erp.local` / `admin123` → `/platform-admin` |

| Betik | Ne yapar |
|---|---|
| `./scripts/start.sh` | Her şeyi derler ve başlatır, hazır olana kadar bekler |
| `./scripts/stop.sh` | Durdurur; veritabanı ve medya dosyaları kalır |
| `./scripts/logs.sh [servis]` | Kayıtları akıtır (`api`, `web`, `postgres`) |
| `./scripts/reset.sh` | **Her şeyi siler** (veritabanı + medya), sıfırdan kurmak için |

Ayarlar (portlar, ilk firma, platform yöneticisi, şifreler) `.env` ile değiştirilir: `cp .env.example .env`.
Dosya yoksa `.env.example`'daki değerlerin aynısı varsayılan olarak geçerlidir.
Ağa yalnızca arayüz (5173) açılır; veritabanı (5432) ve API (8080) yalnızca bu bilgisayardan erişilir.

Windows PowerShell'de betikler yerine doğrudan:

```powershell
docker compose --profile app up -d --build --wait   # başlat
docker compose --profile app down                   # durdur
```

### Geliştirme kipi

Kod yazarken backend ve arayüz Docker dışında çalışır: yeniden başlatma hızlı, hata ayıklama kolay.
Gerekenler: Docker, Node 24 (`.nvmrc`), Java 25.

| Ne | Komut | Adres |
|---|---|---|
| Veritabanı | `docker compose up -d` (profilsiz: yalnızca PostgreSQL) | `localhost:5432` |
| Backend | `cd backend && ./mvnw spring-boot:run` | http://localhost:8080/swagger-ui.html |
| Frontend | `cd frontend && npm install && npm run dev` | http://localhost:5173 |

İki kip aynı portları kullanır: geliştirmeye geçmeden önce `./scripts/stop.sh`.
Backend'in varsayılan profili yoktur: profilsiz açılan sunucu hazır hesap kurmaz, çerezi `Secure` yapar, API dokümanını
kapatır. `./mvnw spring-boot:run`, testler ve Docker `local` profilini kendiliğinden verir; IDE'den çalıştırırken
etkin profil olarak `local` yazılır.
Docker kipinin medya dosyaları kendi biriminde durur, geliştirme kipininkiler `backend/.data/media` altında.

## Kontrol

Her değişiklikten sonra ilgili kontrol çalıştırılır; kırmızıyken iş bitmiş sayılmaz.

| Ne | Komut | İçerik |
|---|---|---|
| Backend | `cd backend && ./mvnw verify` | Checkstyle (anayasa) + testler |
| Frontend | `cd frontend && npm run check` | ESLint (anayasa + mimari) + tip + unit test |
| Frontend uçtan uca | `cd frontend && npm run test:e2e` | Telefon ve masaüstü ekranında Playwright |

## Üretim: Vercel (arayüz) + Render (backend, veritabanı)

```text
tarayıcı ──► Vercel: arayüz (https://…vercel.app)
               └─ /api/* ──► Render: backend (Docker, prod profili) ──► Render PostgreSQL
```

- Arayüz ve API tarayıcıya aynı adreste görünür: Vercel `/api` isteklerini Render'a iletir (`frontend/vercel.ts`). Oturum
  çerezi (SameSite=Strict) ve backend'in köken denetimi bunu ister.
- Vercel her isteğe `PROXY_SECRET`'ı ekler; backend bu sırrı taşımayan isteği reddeder ve kişinin adresini Vercel'den
  okur (`ProxyGate`). Render adresine doğrudan gelen istek 404 alır.
- Backend `prod` profiliyle açılır; açılışta ayarlar denetlenir (`ProductionSettingsAudit`), eksik ya da güvensiz ayarla
  sunucu açılmaz. Render tarafını `render.yaml` kurar (Render → New → Blueprint).

| Render (backend) | Değer |
|---|---|
| `APP_BASE_URL` | Vercel adresi, sonunda `/` olmadan: `https://…vercel.app` (davet ve kurulum linkleri) |
| `PLATFORM_ADMIN_NAME`, `PLATFORM_ADMIN_EMAIL`, `PLATFORM_ADMIN_PASSWORD` | İlk süper yönetici: gerçek e-posta, şifre en az 16 karakter |
| `PUSH_SUBJECT` | `mailto:` + gerçek bir e-posta (bildirim servisleri sorun olursa buraya yazar) |
| `PROXY_SECRET` | Render üretir; aynısı Vercel'e yazılır |
| `DB_*`, `MEDIA_ROOT`, `JAVA_TOOL_OPTIONS`, `TZ` | `render.yaml` doldurur |

| Vercel (arayüz; Production ve Preview) | Değer |
|---|---|
| `API_ORIGIN` | Render servisinin adresi: `https://…onrender.com` |
| `PROXY_SECRET` | Render'daki değerin aynısı |
| `VITE_SALES_PHONE`, `VITE_SALES_EMAIL` | İsteğe bağlı: tanıtım sitesindeki iletişim |

Vercel'de proje kökü (Root Directory) `frontend` olur; geri kalanını `vercel.ts` söyler.

Ücretsiz planın sınırları: Render servisi 15 dakika istek almazsa uyur, ilk istek yaklaşık bir dakika bekler. Dosya
sistemi her deploy, uyku ve yeniden başlatmada silinir (yüklenen fotoğraf, video, belge, logo gider). Veritabanı 1 GB'tır,
yedeği yoktur ve 30 gün sonra sona erer. VPS'e geçerken aynı Docker imajları `prod` profiliyle çalışır; veritabanı adresi
tek değişkenle (`DB_URL`) verilir, `PROXY_SECRET` verilmez (önde nginx vardır).
