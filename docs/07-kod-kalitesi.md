# 07 · Kod kalitesi, ekip ve yapay zekâ

## İlk gün yazılan anayasa

Projenin ilk commit'inde kod kadar önemli bir dosya vardı: [ANAYASA.md](../ANAYASA.md). Kod yazan herkesin, insan ya da
yapay zekâ, uyduğu kurallar. En önemlileri:

| Kural | Sınır | Neden |
|---|---|---|
| Dosya boyutu | En fazla 200 satır | Bir dosyayı baştan sona okuyup aklında tutabilmelisin |
| Fonksiyon boyutu | En fazla 30 satır | Uzun fonksiyon birden çok iş yapıyordur |
| Parametre sayısı | En fazla 4 | Fazlası bir nesneye toplanır, çağıran ne verdiğini görür |
| İç içe blok | En fazla 3 seviye | Derinleşen kod erken `return` ile düzleştirilir |
| Tek sorumluluk | — | Ne yaptığını "ve" demeden söyleyemiyorsan böl |
| Üç Kuralı | — | Aynı kod ikinci kez yazılınca fark edilir, üçüncüde ortak hale gelir |
| Yorumlar | — | Kod *ne* yaptığını anlatır, yorum *neden* öyle yapıldığını |
| Bağımlılıklar | — | Yeni kütüphane yalnızca ihtiyaç duyulduğu an eklenir |

Üç Kuralı'nı özellikle seviyorum. İlk tekrarda ortak bir fonksiyon yazmak cazip geliyor ama iki örnekten doğru
soyutlamayı çıkarmak zor. Yanlış soyutlama, tekrardan daha pahalıya patlıyor.

## Kural belgede kalırsa çiğnenir

Bir kuralı belgeye yazmak bir şeyi garanti etmiyor; yoğun bir günde biri onu unutur. Bu yüzden anayasanın ölçülebilen
her maddesini derlemeye bağladım:

- **Arayüzde ESLint:** dosya ve fonksiyon boyutu, parametre sayısı, iç içe derinlik, karmaşıklık. Bunlara ek olarak
  mimari sınırlar: `core/`'dan Vant import etmek, bir atomdan sayfa import etmek ya da masaüstünde Vant kullanmak hata.
- **Backend'de Checkstyle:** aynı boyut kuralları; ihlal olursa `./mvnw verify` kırılıyor.

```text
src/core/sites/useSites.ts
  3:1  error  'vant' import is restricted from being used by a pattern.
              Mimari sınır ihlali: ANAYASA.md Madde 4  no-restricted-imports
```

Hata mesajı hangi kuralın neden çiğnendiğini söylüyor. Kuralı bilmeyen biri bile mesajdan ne yapması gerektiğini
öğreniyor.

Aynı düşünceyi veritabanına da uyguladım: firmaya ait bir tabloda RLS unutulursa uygulama hiç açılmıyor
(bkz. [03 · Firma ayrımı](03-firma-ayrimi.md)). Benim için iyi bir kuralın ölçüsü şu: unutulduğunda kimseye
hatırlatılmasına gerek kalmamalı.

## Kontroller

| Ne | Komut | İçerik |
|---|---|---|
| Backend | `cd backend && ./mvnw verify` | Checkstyle + gerçek PostgreSQL'de testler (Testcontainers) |
| Arayüz | `cd frontend && npm run check` | ESLint (anayasa + mimari) + tip denetimi + unit testler (Vitest) |
| Uçtan uca | `cd frontend && npm run test:e2e` | Playwright: telefon, tablet ve masaüstü ekranında gerçek akışlar |

Kendime koyduğum bir kural daha var: "geçti" demeden önce kontrol komutunu çalıştır ve çıktısını oku. Kırmızıyken iş
bitmiş sayılmıyor.

## Ekip olarak çalışma

- Her iş kendi dalında yapılıyor (`feature/malzeme-sevkiyat`, `security/guvenlik-denetimi` …) ve ana dala birleştirme
  commit'iyle giriyor. Böylece geçmişte her özelliğin nerede başlayıp nerede bittiği görünüyor.
- Commit mesajları Türkçe ve neyin değil **neden**in hikâyesini anlatıyor. Örneğin malzeme modülünü sadeleştirdiğim
  commit, modülün neden bir depo yönetim sistemine dönüştüğünü ve neyin neden kaldırıldığını adım adım yazıyor.
- Ürün kararları kod yazılmadan önce konuşuluyor ve [TASARIM.md](TASARIM.md)'ye yazılıyor. Musa'nın bir dalını
  birleştirmeden önce kendi bilgisayarımda, veritabanının bir kopyasında çalıştırıp deniyordum; böylece benim verim
  bozulmuyordu.

## Yapay zekâ ile çalışma

Kodun önemli bir kısmını yapay zekâ (Claude Code) ile birlikte yazdık. Bunu saklamıyorum, çünkü bence asıl soru
"yapay zekâ kullandın mı?" değil, "**onu nasıl kontrol altında tuttun?**".

Yapay zekâ çok hızlı kod yazıyor ama başıboş bırakılınca üç şey oluyor: dosyalar uzuyor, aynı mantık farklı yerlerde
tekrar yazılıyor ve kimsenin istemediği özellikler ekleniyor. Benim cevabım şu oldu:

1. **Kurallar insan ve yapay zekâ için aynı.** Anayasa ikisine de uygulanıyor ve derleme ikisini de durduruyor.
   Yapay zekâ bir kuralı unutabilir, derleyici unutmaz.
2. **Ne yapılacağına ben karar veriyorum.** Yapay zekâ bir öneri getiriyor, ben gerekçesini soruyorum, beğenmezsem geri
   çeviriyorum. Örneğin yoklama modülünün ilk sürümü çalışıyordu ama hikâyesi içime sinmedi; baştan, ay sonu puantajı
   üzerine kurduk. Kimsenin istemediği bir "geçmiş kayıtlar" paneli eklendiğinde de kaldırttım.
3. **Her şeyi kendim deniyorum.** Ekranları tarayıcıda, telefon ve masaüstü boyutunda kendim kullanıyorum. Kod
   incelemesi yetmiyor; ürünü kullanmadan iyi olup olmadığını bilemezsin.
4. **Yapay zekâya talimatlar da repoda.** [CLAUDE.md](../CLAUDE.md) onun nasıl çalışacağını söylüyor: büyük kararlardan
   önce konuşmak, her adımda kararı ve nedenini açıklamak, kanıt göstermeden "bitti" dememek.

Bu projede öğrendiğim en önemli şey belki de bu: yapay zekâ ile hızlı kod yazmak kolay, zor olan o hızın içinde ürünün
ve kodun tutarlı kalması. Bunu sağlayan şey iyi niyet değil, otomatik denetlenen kurallar ve net kararlar oldu.
