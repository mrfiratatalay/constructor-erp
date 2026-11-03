# 06 · Backend

## Özellik bazlı paketler

Backend'i katmana göre değil (`controllers/`, `services/` …), özelliğe göre böldüm:

```text
com.atalay.santiye
├── common/       ortak: hata yönetimi, web ayarları, üretim denetimi
├── tenant/       firma ayrımı: bağlam, RLS'li bağlantı, açılış denetimi
├── auth/         oturum, giriş, izinler
├── site/         SiteController, SiteService, SiteRepository, Site, dto/
├── puantaj/      …
├── material/     …
└── …             toplam 24 özellik paketi
```

Bir özelliği anlamak isteyen tek bir klasörü açıyor. Bir özelliği silmek gerekirse tek bir klasör gidiyor.

Paketin içinde katman atlanmıyor: Controller yalnızca HTTP'yi karşılıyor, Service iş kuralını uyguluyor, Repository
veriye erişiyor. Controller dışarıya hiçbir zaman veritabanı nesnesi (entity) döndürmüyor, yalnızca DTO (`record`)
döndürüyor. Böylece tabloya eklenen bir kolon kendiliğinden API'ye sızmıyor.

## Veriye erişim

İki yol birlikte kullanılıyor:

- **JPA**, tek bir kaydı oluşturmak, okumak ve güncellemek için.
- **JdbcClient ile doğrudan SQL**, liste, özet ve rapor gibi okuma ağırlıklı sorgular için: platform özetindeki
  sayılar, sevkiyat listesi, stok hesabı ("Depoda: 300 Torba"). Birkaç tabloyu birleştirip toplayan bir sorguyu SQL
  olarak yazmak, onu JPA'ya anlatmaya çalışmaktan hem daha okunur hem daha hızlı.

Aynı anda gelen iki isteğin birbirini ezebileceği yerlerde satır kilidi (`SELECT … FOR UPDATE`) kullanılıyor:
tek kullanımlık linkler, firmaya göre sayılan sevkiyat numaraları ve aynı kişinin aynı gününe aynı anda gelen iki
yoklama işareti.

## Veritabanı şeması: Flyway

Şema yalnızca numaralı SQL dosyalarıyla değişiyor (`V1__…sql` … `V32__…sql`). Hibernate'in tabloları kendiliğinden
oluşturmasına izin yok (`ddl-auto: validate`); kod ile şema uyuşmazsa uygulama açılmıyor. Yayınlanmış bir migration bir
daha düzenlenmiyor, değişiklik için yenisi yazılıyor.

Ekip çalışmasında bunun bir tuzağını yaşadık. İki dal aynı anda `V21` numaralı farklı migration'lar ekledi. Dosya adları
farklı olduğu için Git bunu çakışma saymadı ama Flyway aynı numarayı görünce dururdu. Birleştirirken numaralardan birini
kaydırarak çözdük. O günden beri "Git çakışma demiyor" ile "çakışma yok" aynı şey değil.

### Türkçe sıralama hatası

Bir gün adların sıralamasında bir tuhaflık fark ettik: Çimento, Şükrü, Özkan İnşaat gibi Ç, Ş, Ö, Ü ya da İ ile başlayan
her ad listenin en sonuna düşüyordu. Sebebi veritabanının Alpine imajında çalışmasıydı: Alpine'in C kütüphanesi (musl)
yerel sıralama kurallarını bilmiyor ve `order by name` harflere değil baytlara göre sıralıyordu. Çözüm, PostgreSQL ile
birlikte gelen ICU'nun Türkçe kuralını (`tr-x-icu`) ad kolonlarına bağlamak oldu (V31).

## Medya hattı

Şantiyeden fotoğraf, video, sesli not ve PDF geliyor. Telefonların çektiği videolar her cihazda oynamayabiliyor ve büyük
oluyor. Hattın adımları şöyle:

1. Dosya geliyor ve hemen kaydediliyor; gönderi ekranda "işleniyor" olarak görünüyor.
2. Dönüşüm kuyruğa giriyor. **Aynı anda en fazla iki dönüşüm** yapılıyor: video kodlamak işlemciyi yoruyor ve sunucunun
   bu sırada diğer isteklere cevap vermeye devam etmesi gerekiyor.
3. ffmpeg videoyu her cihazda oynayan biçime çeviriyor (H.264 + AAC, indirilirken oynamaya başlayan MP4).
4. **Konum dahil bütün meta veriler siliniyor.** Bir fotoğrafın içindeki GPS bilgisi, şantiyenin ya da çekenin evinin
   adresini ele verebilir.
5. Sonuç `READY` ya da `FAILED` olarak yazılıyor.

Sunucu bir dönüşümün ortasında kapanırsa, açılışta yarım kalan medyalar bulunup yeniden kuyruğa alınıyor. Dosyalar
diskte firmanın kendi klasöründe duruyor (`{firma}/{medya}/…`).

## Bildirimler: kütüphanesiz Web Push

Web Push'ta normalde bildirimin içeriği şifrelenerek gönderilir (RFC 8291). Bunun için ya ciddi bir kriptografi kodu
yazmak ya da bir kütüphane eklemek gerekir.

Biz başka bir yol seçtik: sunucu telefona **içeriksiz bir "dürtme"** gönderiyor. Telefondaki service worker dürtülünce
bildirimin içeriğini kullanıcının kendi oturumuyla sunucudan okuyor ve gösteriyor. Böylece yalnızca "bu bildirimi
gönderen benim" diyen kısa ömürlü imzalı bir belge (VAPID JWT, ES256) gerekiyor; onu Java'nın kendi kriptografi
kütüphanesiyle birkaç satırda ürettik. Ek bağımlılık yok, şifreleme kodu yok, içerik de hiçbir zaman üçüncü bir
sunucudan geçmiyor.

Bir de iOS'tan öğrendiğimiz bir ayrıntı var: iOS her dürtmede bir bildirim gösterilmesini bekliyor. İnternet yoksa ve
içerik okunamazsa bile genel bir bildirim gösteriliyor.

## Zamanlanmış işler

Her akşam 18:00'de (İstanbul saatiyle) patrona "bugün haber gelmeyen şantiyeler" özeti gidiyor. Şantiye sorumlularına
ayrı bir hatırlatma yok. Bunu bilerek kaldırdım: herkes her şantiyede olduğu için "o şantiyenin adamı" diye biri yok ve
her çalışana her sessiz şantiye için bildirim gitmesi gürültüden başka bir şey olmazdı.

## Excel dökümleri

Patronun ay sonunda ihtiyacı olan şey çoğu zaman bir ekran değil, bir Excel dosyası. Puantaj, İlerleme ve sevkiyatlar
Excel'e dökülebiliyor (fastexcel). Dökümler ekrandaki hesapların aynısını kullanıyor ve yalnızca oturumdaki firmanın
verisini içeriyor.

## Hatalar

Kullanıcıya gösterilecek hatalar tek bir sınıftan (`ApiException`) çıkıyor. Spring bu sınıfı kendiliğinden standart
hata biçimine (RFC 9457) çeviriyor; ayrı bir hata yakalayıcı yazmadık. Mesajlar Türkçe, çünkü doğrudan arayüzde
gösteriliyor: "Şifre en çok 72 karakter olabilir; Türkçe harfler (ç, ğ, ı, ö, ş, ü) iki karakter sayılır."

## Testler

Backend testleri sahte bir veritabanında değil, Testcontainers ile her test çalıştırmasında açılan **gerçek bir
PostgreSQL'de** koşuyor. RLS, Türkçe sıralama ve satır kilidi gibi davranışlar yalnızca gerçek veritabanında test
edilebiliyor; bellekteki bir veritabanı bunları hiç bilmez.

```bash
cd backend && ./mvnw verify    # Checkstyle (kod kuralları) + bütün testler
```
