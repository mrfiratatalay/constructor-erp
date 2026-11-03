# 03 · Firma ayrımı (multi-tenant)

## Problem

Uygulama önce tek bir firma için yazılmıştı. Birden çok firmaya satmaya karar verdiğimizde en önemli soru şuydu:

> Bir firmanın verisi başka bir firmaya **hiçbir yoldan** görünmemeli. Bir geliştirici bir sorguda firma filtresini
> unutursa ne olur?

"Dikkatli oluruz" bir cevap değil. Yüzlerce sorgu var ve her yeni modülle artıyor. Benim istediğim, unutmanın bile veri
sızdıramayacağı bir yapıydı.

## Karar 1: Kimlik ile üyelik ayrıldı

Eskiden `users` tablosunda `company_id` ve `role` vardı; yani bir kişi yalnızca bir firmada olabiliyordu. Bunu ikiye
ayırdık:

- `users` yalnızca kimliği tutuyor: ad, telefon, e-posta, şifre.
- `company_memberships` kişinin hangi firmada hangi rolde olduğunu tutuyor.

Böylece bir kişi birden çok firmada çalışabiliyor. Hangi firmada çalıştığı oturumda duruyor ve sunucu her istekte
üyeliği yeniden doğruluyor.

## Karar 2: Firma kimliği istemciden gelmez

İş uçlarının hiçbirinin gövdesinde `companyId` alanı yok. Firma her zaman oturumdan, sunucu tarafında çözülüyor. İstekte
başka bir firmanın kimliğini göndermenin bir anlamı yok, çünkü sunucu ona hiç bakmıyor.

## Karar 3: İki katmanlı koruma

**Birinci katman, uygulama.** Servisler her sorguyu oturumdaki firmayla süzüyor. Başka firmanın kaydı istenirse `404`
dönüyor; "böyle bir kayıt var ama senin değil" bilgisini bile vermiyor.

**İkinci katman, veritabanı.** Firmaya ait her tabloda PostgreSQL'in satır seviyesinde güvenliği (Row-Level Security)
açık. Her istekte veritabanı bağlantısına o anki firmanın kimliği yazılıyor ve PostgreSQL başka firmanın satırını ne
okutuyor ne yazdırıyor:

```sql
-- Yeni bir tabloyu korumak tek satır: select enable_company_isolation('tablo_adi');
create policy company_isolation on sites
  using (current_company_id() is null or company_id = current_company_id())
  with check (current_company_id() is null or company_id = current_company_id());
```

Servis katmanında bir sorgu filtreyi unutsa bile veritabanı başka firmanın satırını döndürmüyor. İki katmanın ikisi
birden hata yapmadıkça veri sızmıyor.

## Bu işin iki tuzağı

**Bağlantı havuzu.** Veritabanı bağlantıları istekler arasında paylaşılıyor. Bir önceki isteğin firması bağlantıda
kalırsa sonraki istek yanlış firmanın verisini görür. Bunun için `TenantScopedDataSource` firmayı havuzdan **her alışta**
yeniden yazıyor; firma yoksa değeri boşaltıyor.

**Süper kullanıcı.** PostgreSQL'de süper kullanıcı RLS'e hiç takılmaz. Docker'daki varsayılan kullanıcı da süper
kullanıcı. Yani kurulum yanlışsa koruma sessizce devre dışı kalır, testler yeşil görünür ama hiçbir şey korunmaz. Bu
yüzden uygulama, firma isteklerinde yetkisiz bir role (`constructor_tenant`) geçiyor; böylece koruma her kurulumda
çalışıyor.

## Karar 4: Unutulan koruma uygulamayı açmaz

Kuralı bir belgeye yazmak yetmez, çünkü unutulabilir. Ben kuralı koda çevirdim. Uygulama açılırken `TenantIsolationAudit`
veritabanını tarıyor: `company_id` kolonu olup RLS'i açık olmayan bir tablo bulursa uygulama **başlamıyor**.

```text
Firma izolasyonu (RLS) olmayan tablolar: [yeni_tablo].
Migration'a select enable_company_isolation('tablo'); ekleyin.
```

Yeni bir modül yazan biri RLS'i unutursa bunu üretimde değil, kendi bilgisayarında, ilk çalıştırmada öğreniyor.

## Gözden kaçabilecek bir sızıntı: numaralar

Sevkiyatların "SV-000123" gibi okunur numaraları var. Tüm firmalar tek bir ortak sırayı kullansaydı, bir firma kendi
numaralarındaki boşluklardan diğer firmaların ne kadar iş yaptığını tahmin edebilirdi. Bu yüzden her firmanın her sayacı
ayrı satırda duruyor. Sayma işi satır kilidiyle yapılıyor, böylece aynı anda gelen iki kayıt aynı numarayı alamıyor.

## Abonelik ve modüller

Firmanın neyi kullanabileceğini abonelik belirliyor:

```text
plans (paketler) → plan_features (paketin açtığı modüller) → subscriptions (dönemler) → payments (ödemeler)
```

- Backend'deki uçlar `@RequiresFeature("materials")` ile, arayüzdeki adresler ve menü öğeleri `feature` alanıyla
  korunuyor. Paketinde malzeme olmayan firma o menüyü görmüyor, adresi elle yazsa bile açamıyor.
- Firma askıya alınırsa ya da geçerli bir aboneliği yoksa çalışma alanı kilitleniyor. Veri silinmiyor; firma yeniden
  açılınca her şey yerinde.
- Ödeme altyapısı (POS) bilerek yok. Satış başvuruyla başlıyor, ödeme elden ya da havaleyle geliyor ve platform
  yönetiminde kaydediliyor. Sahte bir ödeme ekranı göstermek yerine gerçek satış sürecini modelledik.

## Platform yönetimi ayrı bir dünya

Platform yöneticisi (`SUPER_ADMIN`) "en yetkili patron" değil; tamamen ayrı bir rol. Firma ekranlarına girmiyor, yalnızca
platform uçlarından ve yalnızca gerektiği kadar veri okuyor. Firmayı askıya almak, paket değiştirmek, ödeme kaydetmek
gibi kritik işlemlerin hepsi işlem geçmişine (audit log) yazılıyor.

Yeni bir firmanın kurulumu tek kullanımlık bir linkle oluyor. Link tahmin edilemeyecek kadar uzun ve süreli;
veritabanında yalnızca özeti (hash) duruyor. Yenisi üretilince eskisi iptal oluyor.

## Yeni modül eklerken

Bütün bunlar 14 maddelik bir kontrol listesine dönüştü: sahiplik, RLS, oluşturma, okuma, güncelleme, yetki, modül hakkı,
dışa aktarma, dosya yolu, önbellek anahtarı, arka plan işi, menü, işlem geçmişi ve çapraz firma denemesi. Listenin
tamamı [MIMARI-SAAS.md](MIMARI-SAAS.md)'de.
