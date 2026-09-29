# Kızılkan Şantiye

Müteahhitlerin birden fazla şantiyeyi WhatsApp yerine tek yerden takip ettiği web uygulaması.
Telefonda sade bir saha arayüzü, bilgisayarda yönetim paneli.

Kod yazmadan önce **[ANAYASA.md](ANAYASA.md)** okunur: boyut sınırları, atomik tasarım ve
katman kuralları oradadır ve otomatik denetlenir.

## Yapı

| Klasör | Teknoloji |
|---|---|
| `frontend/` | Vue 3, TypeScript, Vite. Mobil: Vant, masaüstü: Element Plus |
| `backend/` | Java 25, Spring Boot 4, PostgreSQL 18, Flyway |
| `docker/`, `docker-compose.yml`, `scripts/` | Kurulum: veritabanı, backend, arayüz |
| `marketing/video/` | Reklam videoları: uygulamanın gerçek ekranları, Remotion ile ([plan](marketing/video/PLAN.md)) |

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
| İlk giriş | `patron@kizilkan.local` / `patron123` |

| Betik | Ne yapar |
|---|---|
| `./scripts/start.sh` | Her şeyi derler ve başlatır, hazır olana kadar bekler |
| `./scripts/stop.sh` | Durdurur; veritabanı ve medya dosyaları kalır |
| `./scripts/logs.sh [servis]` | Kayıtları akıtır (`api`, `web`, `postgres`) |
| `./scripts/reset.sh` | **Her şeyi siler** (veritabanı + medya), sıfırdan kurmak için |

Ayarlar (portlar, ilk yönetici, şifreler) `.env` ile değiştirilir: `cp .env.example .env`.
Dosya yoksa `.env.example`'daki değerlerin aynısı varsayılan olarak geçerlidir.

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
Docker kipinin medya dosyaları kendi biriminde durur, geliştirme kipininkiler `backend/.data/media` altında.

## Kontrol

Her değişiklikten sonra ilgili kontrol çalıştırılır; kırmızıyken iş bitmiş sayılmaz.

| Ne | Komut | İçerik |
|---|---|---|
| Backend | `cd backend && ./mvnw verify` | Checkstyle (anayasa) + testler |
| Frontend | `cd frontend && npm run check` | ESLint (anayasa + mimari) + tip + unit test |
| Frontend uçtan uca | `cd frontend && npm run test:e2e` | Telefon ve masaüstü ekranında Playwright |
