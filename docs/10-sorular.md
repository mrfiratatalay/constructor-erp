# 10 · Sorular ve cevaplarım

Bu projeyi anlatırken en çok sorulan soruları ve benim cevaplarımı buraya topladım. Ayrıntılar ilgili belgelerde.

---

### Projeyi kısaca anlatır mısın?

Constructor ERP, müteahhitlerin şantiyelerini WhatsApp grupları yerine tek yerden yönettiği, çok firmalı bir SaaS ürünü.
Şantiye bir sohbet grubu gibi çalışıyor; yanında yoklama ve puantaj, malzeme sevkiyatı, taşeron ilerlemesi ve görevler
var. Telefonda sade bir saha arayüzü, bilgisayarda yönetim paneli var. Arka tarafta Spring Boot ve PostgreSQL var;
firmalar arası ayrımı veritabanı seviyesinde de garanti altına aldım.

### Neden mikroservis değil de tek uygulama?

İki kişilik bir ekip, tek bir veritabanı ve tek bir iş alanı vardı. Mikroservisler bize dağıtık işlem, ağ hataları ve
ayrı dağıtım dertleri getirirdi; karşılığında bir şey kazandırmazdı. Onun yerine monoliti özellik bazlı paketlerle
içeriden böldüm. Bir modülü ileride ayırmak gerekirse sınırlar zaten belli.

### Firmaların verisini nasıl ayırdın? Servis katmanında süzmek yetmez miydi?

Yetmezdi, çünkü yüzlerce sorgunun her birinde filtreyi hatırlamak gerekiyor ve bir gün biri unutur. İki katman
kurdum: servisler firmaya göre süzüyor, PostgreSQL de satır seviyesinde güvenlikle (RLS) başka firmanın satırını hiç
döndürmüyor. Bir tabloya RLS eklemeyi unutmak da mümkün değil, çünkü uygulama açılırken bunu denetliyor ve korumasız
tablo bulursa başlamıyor. Ayrıntısı [03 · Firma ayrımı](03-firma-ayrimi.md)'nda.

### Bu işin bir tuzağı oldu mu?

İki tane. Birincisi bağlantı havuzu: bir önceki isteğin firması bağlantıda kalmasın diye firmayı her bağlantı alışında
yeniden yazıyorum. İkincisi süper kullanıcı: PostgreSQL'de süper kullanıcı RLS'e takılmaz ve Docker'daki varsayılan
kullanıcı süper kullanıcı. Yani koruma sessizce devre dışı kalabilirdi. Firma isteklerinde yetkisiz bir role geçerek
bunu çözdüm.

### Oturumu neden JWT ile değil sunucuda tuttun?

Ürünün bir ihtiyacı yüzünden: patron birini firmadan çıkardığında o kişinin oturumu anında kapanmalı. JWT süresi dolana
kadar geçerli kalır, geri almak için yine sunucuda bir liste tutmak gerekir. Çerez HttpOnly ve SameSite=Strict;
veritabanında token'ın kendisi değil yalnızca SHA-256 özeti duruyor.

### CSRF'e karşı ne yaptın?

SameSite=Strict çerez çoğu saldırıyı durduruyor ama aynı alan adının başka bir alt adresinden gelen isteği durdurmuyor.
Fotoğraf yüklemeleri de tarayıcının ön kontrolüne (preflight) takılmıyor. Bunun için tarayıcının yazdığı ve sayfadaki
kodun değiştiremediği `Sec-Fetch-Site` başlığına bakıp başka kökenden gelen yazma isteklerini reddediyorum.

### Neden iki ayrı arayüz kütüphanesi? Bakımı zor olmaz mı?

Telefondaki şef ile bilgisayardaki patronun ihtiyacı çok farklı; tek bir duyarlı tasarım ikisini de iyi yapamıyordu.
Bakımı kolaylaştıran şey, iş mantığının ikisinde ortak olması. `core/` klasörü UI kütüphanesi import edemiyor ve bunu
ESLint denetliyor. Kabuklar yalnızca görüntüden sorumlu, bir kural bir kez yazılıyor.

### Dosyalara 200 satır sınırı koymak bürokrasi değil mi?

Bence tersine, inceleme maliyetini düşürüyor. Küçük bir dosyayı baştan sona okuyup aklında tutabiliyorsun. Özellikle
yapay zekâ ile çalışırken bu sınır çok işe yaradı: yapay zekâ uzun dosya yazmaya eğilimli ve sınır, ona da sorumlulukları
bölmeyi zorunlu kılıyor. Kural derlemeye bağlı olduğu için kimse kimseye hatırlatmak zorunda kalmıyor.

### Kodu sen mi yazdın? Yapay zekâ kullandın mı?

Projeyi ekip arkadaşım Musa ile birlikte geliştirdik ve kodun önemli bir kısmını yapay zekâ (Claude Code) ile birlikte
yazdık; bunu GitHub'daki geçmişte de görebilirsiniz. Benim rolüm ne yapılacağına ve nedenine karar vermek, kuralları
koymak, her değişikliği tarayıcıda deneyip kabul ya da reddetmek, dalları birleştirmek ve ürünü yayına almaktı. Bence
asıl beceri yapay zekâyı kontrol altında tutmaktı; bunun için anayasa yazdım ve derlemeye bağladım. Ayrıntısı
[07 · Kod kalitesi](07-kod-kalitesi.md)'nde.

### Yaşadığın en ilginç hata neydi?

Türkçe sıralama. Ç, Ş, Ö, Ü ya da İ ile başlayan bütün adlar listenin en sonuna düşüyordu. Sebebi, veritabanının
Alpine imajında çalışması ve Alpine'in C kütüphanesinin (musl) yerel sıralama kurallarını bilmemesiydi. `order by name`
harflere değil baytlara göre sıralıyordu. PostgreSQL ile gelen ICU'nun Türkçe kuralını kolonlara bağlayarak çözdük.

### Yanlış verdiğin bir karar oldu mu?

Birkaç tane. En belirgini kişi modeli: kişileri şantiyelere tek tek davet ettiriyordum. Gerçek hayatta herkes her
şantiyeye gidiyordu ve model gerçeğe uymuyordu. Firmanın tek bir katılma bağlantısına geçtim. Malzeme modülünün bir depo
yönetim sistemine dönüşmesine izin vermem de bir hataydı; sonradan sadeleştirdim ve backend 3.600 satırdan 2.300
satıra indi. Bu kararların hepsi [08 · Ürün kararları](08-urun-kararlari.md)'nda.

### Ekip olarak nasıl çalıştınız?

Her iş kendi dalında yapıldı ve ana dala birleştirme commit'iyle girdi. Ürün kararlarını kod yazmadan önce konuşup
belgeye yazdık. Bir keresinde iki dal aynı numaralı Flyway migration'ı ekledi. Git bunu çakışma saymadı ama Flyway
açılışta dururdu; birleştirirken birini yeniden numaralandırdık.

### Test stratejin nedir?

Backend testleri Testcontainers ile gerçek bir PostgreSQL'de koşuyor, çünkü RLS, Türkçe sıralama ve satır kilidi
bellekteki bir veritabanında test edilemez. Arayüzde iş mantığının birim testleri (Vitest) ve telefon, tablet ve
masaüstü ekranında uçtan uca testler (Playwright) var. Anayasa da bir test gibi çalışıyor: ihlal eden kod derlenmiyor.

### Canlı demo nasıl çalışıyor?

Ücretsiz sunucuların uyuması ve veritabanının süresinin dolması yüzünden tarayıcının içinde çalışan bir sahte backend
yazdım. Arayüzün bütün istekleri tek bir fonksiyondan geçtiği için, demo derlemesinde axios'un ağ katmanını değiştirmek
yetti; ekranların koduna dokunmadım. Sahte backend gerçek backend'in kurallarını taklit ediyor ve tarayıcıda
saklanıyor. Ayrıntısı [09 · Yayına alma](09-yayina-alma.md)'da.

### 1.000 firma olsa ne değişirdi?

Oturumlar veritabanında durduğu için backend'in birden çok kopyası bir yük dengeleyicinin arkasında çalışabilir. Ama
bunun için önce üç şeyi değiştirirdim, çünkü üçü de şu an tek sunucuya bağlı:

- Medya dosyaları sunucunun diskinde duruyor; bunları bir nesne deposuna (S3 benzeri) taşırdım.
- Video dönüştürme kuyruğu bellekte; ayrı bir işçiye (worker) alırdım.
- Giriş deneme sayaçları da bellekte; her kopya kendi sayacını tutmasın diye ortak bir depoya (Redis gibi) taşırdım.

Firma ayrımı zaten veritabanında olduğu için o tarafta bir değişiklik gerekmezdi.

### Baştan yapsan neyi farklı yapardın?

Ürün kararlarını daha erken, gerçek kullanıcıyla doğrulardım. Birkaç modülü ancak yazdıktan sonra "bu gerçeğe uymuyor"
diyerek baştan yaptım. Uçtan uca testleri de daha erken kurardım. İyi ki yaptığım şey ise anayasayı ilk gün yazıp
derlemeye bağlamak oldu; proje büyüdükçe en çok o işe yaradı.
