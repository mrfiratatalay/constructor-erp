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
| `docker-compose.yml` | Yalnızca local PostgreSQL |

## Çalıştırma

Gerekenler: Docker, Node 24 (`.nvmrc`), Java 25.

| Ne | Komut | Adres |
|---|---|---|
| Veritabanı | `docker compose up -d` | `localhost:5432` |
| Backend | `cd backend && ./mvnw spring-boot:run` | http://localhost:8080/swagger-ui.html |
| Frontend | `cd frontend && npm install && npm run dev` | http://localhost:5173 |

## Kontrol

Her değişiklikten sonra ilgili kontrol çalıştırılır; kırmızıyken iş bitmiş sayılmaz.

| Ne | Komut | İçerik |
|---|---|---|
| Backend | `cd backend && ./mvnw verify` | Checkstyle (anayasa) + testler |
| Frontend | `cd frontend && npm run check` | ESLint (anayasa + mimari) + tip + unit test |
| Frontend uçtan uca | `cd frontend && npm run test:e2e` | Telefon ve masaüstü ekranında Playwright |
