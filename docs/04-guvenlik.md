# 04 · Güvenlik

Güvenliği tek bir özellik olarak değil, her katmanda verilen küçük kararların toplamı olarak düşündüm. Bu sayfada en
önemlilerini ve her birinin neden öyle olduğunu anlatıyorum. Firmalar arası ayrım ayrı bir konu olduğu için
[03 · Firma ayrımı](03-firma-ayrimi.md)'nda.

## Oturum: neden JWT değil?

Oturumu sunucuda tutuyoruz; tarayıcıda yalnızca rastgele bir token taşıyan bir çerez var.

JWT'yi düşündüm ama bu ürünün bir ihtiyacı onu eledi: **patron birini firmadan çıkardığında o kişinin oturumu hemen
kapanmalı.** JWT süresi dolana kadar geçerli kalır; geri almak için yine sunucuda bir kara liste tutmak gerekir. Sunucu
taraflı oturumda kişiyi çıkarmak, oturum satırını kapatmak demek. Arayüz bir sonraki istekte `401` alıyor ve kişiyi giriş
ekranına gönderiyor.

Çerezin ayarları:

| Ayar | Ne sağlar |
|---|---|
| `HttpOnly` | JavaScript çerezi okuyamaz; sayfaya bir kod sızsa bile oturumu çalamaz |
| `SameSite=Strict` | Başka bir siteden gelen istek çerezi taşımaz |
| `Secure` (üretimde) | Çerez yalnızca HTTPS üzerinden gider |

Token 32 baytlık rastgele bir değer ve veritabanına yalnızca SHA-256 özeti yazılıyor. Veritabanı bir gün sızsa bile
içindeki değerlerle kimsenin oturumu açılamıyor. Davet, giriş ve kurulum linkleri de aynı yöntemle saklanıyor.

## Giriş yolları

Bu ürünün kullanıcılarının çoğu e-posta ve şifreyle uğraşmaz. Bu yüzden üç giriş yolu var:

- **Patron** e-posta ve şifreyle giriyor.
- **Saha ekibi** firmanın katılma bağlantısıyla geliyor: patron bağlantıyı WhatsApp grubuna atıyor, açan kişi adını ve
  telefonunu yazıp katılıyor.
- **Başka bir telefondan giriş** için patron, kişiye tek kullanımlık bir giriş linki gönderiyor.

Tek kullanımlık linklerde bir yarış durumu (race condition) vardı: aynı link aynı anda iki kez açılırsa ikisi de
geçebilirdi. Linki doğrularken satırı `SELECT … FOR UPDATE` ile kilitliyoruz; ikinci istek ilkinin bitmesini bekliyor ve
linki kullanılmış buluyor.

## İstek sahteciliği (CSRF)

`SameSite=Strict` çoğu saldırıyı durduruyor ama tarayıcının gözünde "site", alan adının kendisi. Aynı alan adının başka
bir alt adresi (örneğin ele geçirilmiş bir tanıtım sayfası) çerezi taşıyan bir istek atabilir. JSON isteklerini
tarayıcının CORS ön kontrolü durduruyor; fotoğraf ve belge yüklemeleri ise ön kontrolsüz gidiyor.

Çözüm tarayıcının kendisinin yazdığı ve sayfadaki kodun değiştiremediği `Sec-Fetch-Site` başlığı. `CrossOriginWriteFilter`
başka bir kökenden gelen yazma isteğini (POST, PUT, PATCH, DELETE) reddediyor.

## Deneme sınırları

| Nerede | Sınır |
|---|---|
| Şifreyle giriş | Aynı adresten 15 dakikada 20, aynı e-postaya 15 dakikada 10 hatalı deneme |
| Katılma bağlantısıyla hesap açma | Adres başına sınır |
| Başvuru formu | Adres başına sınır |

Burada ince bir nokta var: başarılı bir giriş e-postanın sayacını sıfırlıyor (bir kez yanlış yazan beklemesin) ama
adresin sayacını sıfırlamıyor. Sıfırlasaydı saldırgan arada kendi hesabıyla girerek sınıra hiç takılmazdı.

Sınırların çalışması için kişinin gerçek adresini doğru okumak gerekiyor. Uygulama Vercel'in arkasındayken bütün
istekler Vercel'in birkaç adresinden geliyor gibi görünüyor; doğru okunmasa tüm kullanıcılar tek bir kotayı paylaşırdı.
Bu yüzden adres, vekilin bildirdiği başlıktan okunuyor (ayrıntısı [09 · Yayına alma](09-yayina-alma.md)'da).

## Girdi sınırları

- İstek gövdesi ve metin alanları sınırlı. Oturum gerektirmeyen uçlara dev bir gövde gönderip sunucunun belleğini
  tüketmek mümkün değil.
- Şifreler bcrypt ile saklanıyor. bcrypt en fazla 72 bayt kabul ediyor ve Türkçe harfler (ç, ğ, ı, ö, ş, ü) ikişer
  bayt. Kurulumda uzun bir şifre yazan patron eskiden sunucu hatası görüyordu; artık ne yapması gerektiğini söyleyen bir
  uyarı görüyor.
- Başvuru formu yalnızca sitede gerçekten var olan paketleri kabul ediyor.

## Tarayıcı başlıkları

Arayüz sayfaları güvenlik başlıklarıyla sunuluyor: içerik güvenlik politikası (CSP: yalnızca kendi adresimizden betik),
çerçeve içinde açılma yasağı (`X-Frame-Options: DENY`), `nosniff` ve sıkı bir `Referrer-Policy`. Aynı başlıklar hem
Docker'daki nginx'te hem Vercel'de yazılı; biri değişince öteki de değişiyor.

Docker kurulumunda dış ağa yalnızca arayüz açık. Veritabanı ve API yalnızca o bilgisayardan erişilebiliyor.

## Yanlış ayarla açılmayan sunucu

Üretimde en tehlikeli hatalardan biri, geliştirme ayarlarıyla canlıya çıkmak. Backend `prod` profiliyle açılırken
`ProductionSettingsAudit` şunları denetliyor; biri bile eksikse sunucu **açılmıyor**:

- Oturum çerezi `Secure` mi?
- API dokümanı (Swagger) kapalı mı?
- Flyway'in veritabanını silen `clean` komutu kapalı mı?
- Davet linklerinin adresi gerçek bir HTTPS adresi mi?
- Medya klasörü kalıcı ve yazılabilir mi?
- İlk yönetici hesabının e-postası gerçek mi (`.local` değil), şifresi en az 16 karakter mi?

Hata mesajı ne yapılacağını da söylüyor: "APP_BASE_URL yalnızca HTTPS frontend adresi olmalı; yol veya sonuna /
eklemeyin."

## Güvenlik denetimi

Üretime çıkmadan önce Musa'yla birlikte bütün uygulamayı bir saldırgan gözüyle taradık. Bu sayfadaki maddelerin çoğu o
denetimden çıktı; 27 düzeltme ana dala girdi.

Bilerek sonraya bıraktıklarımız da var: şifre değiştirme ekranı ve "tüm cihazlardan çıkış" henüz yok. Bunları
yapılacaklar listesinde tutuyorum.
