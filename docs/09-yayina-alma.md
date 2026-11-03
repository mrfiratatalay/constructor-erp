# 09 · Yayına alma

## Tek komutla kurulum

Projeyi inceleyen birinin Java, Node ya da PostgreSQL kurmasını istemedim. Tek gereken Docker:

```bash
git clone https://github.com/mrfiratatalay/constructor-erp.git && cd constructor-erp
./scripts/start.sh
```

Betik veritabanını, backend'i ve arayüzü derleyip başlatıyor ve hepsi hazır olana kadar bekliyor. İlk çalıştırmada bir
firma, bir patron hesabı ve bir platform yöneticisi kendiliğinden kuruluyor. Ağa yalnızca arayüz açılıyor; veritabanı ve
API yalnızca o bilgisayardan erişilebiliyor.

| Betik | Ne yapar |
|---|---|
| `./scripts/start.sh` | Her şeyi derler ve başlatır |
| `./scripts/stop.sh` | Durdurur; veritabanı ve medya dosyaları kalır |
| `./scripts/logs.sh [servis]` | Kayıtları akıtır |
| `./scripts/reset.sh` | Her şeyi siler, sıfırdan kurmak için |

## Üretim: Vercel + Render

İlk canlı kurulum ücretsiz katmanlarla yapıldı:

```text
tarayıcı ──► Vercel: arayüz
               └─ /api/* ──► Render: backend (Docker, prod profili) ──► Render PostgreSQL
```

Burada iki sorunu çözmem gerekti.

**1. Çerez ve köken.** Oturum çerezi `SameSite=Strict` ve backend başka kökenden gelen yazma isteklerini reddediyor.
Arayüz `vercel.app`'te, API `onrender.com`'da olsaydı ikisi de bozulurdu. Çözüm: Vercel `/api` isteklerini Render'a
iletiyor (vekil). Tarayıcı için arayüz ve API aynı adreste.

**2. Doğrudan erişim.** Render'daki backend'in de herkese açık bir adresi var. Biri Vercel'i atlayıp doğrudan oraya
istek atarsa deneme sınırları ve köken denetimi anlamını yitirir. Çözüm `ProxyGate`: Vercel her isteğe yalnızca ikisinin
bildiği bir sır ekliyor. Backend bu sırrı taşımayan isteğe `404` dönüyor. Karşılaştırma sabit sürede yapılıyor; böylece
cevap süresinden sırrın kaç harfinin doğru olduğu anlaşılamıyor. Kişinin gerçek adresi de Vercel'in bildirdiği başlıktan
okunuyor, yoksa bütün kullanıcılar tek bir deneme kotasını paylaşırdı.

Bunlara ek olarak backend `prod` profiliyle açılırken ayarlarını denetliyor ve eksik ya da güvensiz bir ayar varsa hiç
açılmıyor (bkz. [04 · Güvenlik](04-guvenlik.md)).

## Ücretsiz katmanın gerçeği

Kurulum çalıştı ama ücretsiz katmanın sınırları bir portföy projesi için ağırdı:

- Render servisi 15 dakika istek almayınca uyuyor; ilk istek yaklaşık bir dakika bekliyor.
- Dosya sistemi her deploy ve yeniden başlatmada siliniyor; yüklenen fotoğraflar gidiyor.
- Ücretsiz PostgreSQL'in süresi 30 gün sonra doluyor ve veritabanı siliniyor.

Projemi incelemek isteyen bir İK uzmanının karşısına ya bir dakikalık bekleme ya da boş bir sayfa çıkıyordu. Yeni mezun
biri olarak her ay sunucu parası ödemek de bir seçenek değildi.

## Çözüm: tarayıcıda çalışan canlı demo

Sorunu şöyle düşündüm: projeyi inceleyen kişinin ihtiyacı gerçek bir sunucu değil, **ürünün her ekranını gerçek gibi
kullanabilmek**. Bunu sunucusuz sağlayabilirsem demo hep açık, anında yüklenen ve bedava olur.

```text
Gerçek kurulum:  Arayüz  →  Backend  →  PostgreSQL
Canlı demo:      Arayüz  →  Sahte backend (tarayıcının içinde, örnek verilerle)
```

**Tek kapı.** Arayüzün backend'e gönderdiği bütün istekler tek bir fonksiyondan geçiyor (`core/api/http.ts`). Demo
derlemesinde axios'un ağ katmanını (adapter) tarayıcıdaki sahte backend'le değiştirdim. Bileşenler, composable'lar ve
sayfalar backend'in gerçek mi sahte mi olduğunu bilmiyor: **ekranların veri çeken kodunda hiçbir değişiklik yok**.
Demonun arayüze eklediği tek şey kendi giriş sayfası ve küçük bir "Demo" menüsü. Hata durumları da gerçek gibi
çalışıyor: sahte backend `401` dönerse arayüz giriş ekranına, `WORKSPACE_LOCKED` dönerse kilit ekranına geçiyor.

**Gerçek kurallar.** Sahte backend gerçek backend'deki kuralları taklit ediyor: rol izinleri, paket modülleri,
firmaların birbirinin verisini görmemesi, şefin yalnızca bugünün yoklamasını alabilmesi, sevkiyat türünün iki uçtan
hesaplanması, iş kaleminin durumunun hesaplanması. Bu kuralları yazarken gerçek backend'in Java kodunu kaynak olarak
kullandım.

**Örnek veri.** Kurgusal bir firma (Atalay Yapı, Trabzon), dört şantiye, sekiz kişi, iki aylık puantaj, sevkiyatlar,
iş kalemleri ve platform tarafında altı örnek firma. Tarihler sabit değil, bugüne göre yazılıyor: demo hangi gün
açılırsa açılsın şantiyeler canlı görünüyor. Fotoğraflar gerçek bir şantiyeden değil, kodla kurulmuş üç boyutlu
sahnelerden (three.js) çekildi; telif ya da kişisel veri sorunu yok.

**Kalıcılık.** Yapılan her değişiklik tarayıcının deposuna (localStorage) yazılıyor. Sayfa yenilense de demo kaldığı
yerden sürüyor; "Demoyu sıfırla" her şeyi ilk haline döndürüyor.

**Giriş kanalı.** [iskeleerp.vercel.app/demo](https://iskeleerp.vercel.app/demo) sayfasında beş rol kartı var:
Patron, Şantiye şefi, Depo sorumlusu, Çalışan ve Platform yöneticisi. Her kart rolü bir cümleyle anlatıyor ve ilk bakılacak üç şeyi öneriyor. Bir tıkla, şifresiz giriliyor.
Uygulamanın içindeki "Demo" düğmesiyle rol değiştirilebiliyor; telefon ve bilgisayar arayüzü arasında geçilebiliyor.

**Paketten ayrı.** Demo, Vite'ın derleme kipiyle açılıyor (`--mode demo`). Burada bir şey öğrendim: bayrağı tek bir
dosyada tanımlayıp her yerden import edince derleyici kullanılmayan demo parçalarını yine de pakete koyuyordu; gerçek
derleme 7,2 MB'tı. Demo parçalarını yükleyen her yerde koşulu (`import.meta.env.MODE === 'demo'`) o dosyanın içinde
yazınca derleyici koşulun hep yanlış olduğunu derleme anında gördü ve sahte backend, örnek veri, fotoğraflar ve demo
menüleri gerçek pakete hiç girmedi. Gerçek derleme 3,4 MB'a indi. Bunu derlenmiş dosyalarda örnek verinin izini
arayarak doğruladım.

Demonun sınırlarını da dürüstçe yazıyorum: bildirim gönderilmiyor, video ve ses dönüştürülmüyor (dosya olduğu gibi
gösteriliyor), Excel düğmeleri canlı veriden değil hazır bir örnek dosyadan iniyor ve iki ayrı tarayıcı birbirinin
yaptığını görmüyor.

### Demoyu yayına almak

| Vercel ayarı | Değer |
|---|---|
| Root Directory | `frontend` |
| Ortam değişkeni | `VITE_DEMO=true` (Production): `vercel.ts` derlemeyi `--mode demo` ile yapar, vekili kurmaz |
| `API_ORIGIN`, `PROXY_SECRET` | Gerekmez |

Kendi bilgisayarında denemek için: `cd frontend && npm run dev:demo`, sonra http://localhost:5173/demo. Gerçek kuruluma
dönmek için Vercel'de `VITE_DEMO` kaldırılır, `API_ORIGIN` ve `PROXY_SECRET` yeniden verilir.

## Sonraki adım: VPS

Gerçek bir müşteri için plan, aynı Docker imajlarını bir VPS'te `prod` profiliyle çalıştırmak. Veritabanı adresi tek bir
değişkenle (`DB_URL`) veriliyor; önde nginx olduğu için `PROXY_SECRET` gerekmiyor. Kod tarafında hazırlık tamam.
