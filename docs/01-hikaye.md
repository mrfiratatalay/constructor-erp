# 01 · Hikâye

## Problem

Türkiye'de müteahhitlerin çoğu şantiyelerini WhatsApp gruplarıyla yönetir. Her şantiyeye bir grup açılır; fotoğraflar,
"beton geldi", "demirci bugün yok", "vinç bozuldu" mesajları orada akar.

WhatsApp mesajlaşmak için harika ama bir şantiyeyi yönetmeye yetmiyor:

- **Fotoğraflar kayboluyor.** Üç hafta önce dökülen kolonun fotoğrafını bulmak için yüzlerce mesaj kaydırmak gerekiyor.
- **Sessiz şantiye fark edilmiyor.** Bugün hangi şantiyeden hiç haber gelmediğini kimse söylemiyor.
- **Puantaj kâğıtta duruyor.** Ay sonunda "kim kaç gün geldi, kim kaç saat mesai yaptı" sorusu defterden ve hafızadan
  toplanıyor.
- **Malzemenin izi yok.** Hangi kamyonun hangi şantiyeye kaç torba çimento götürdüğü ve irsaliyenin nerede olduğu belli
  değil.

Constructor ERP bu dört işi tek yerde topluyor, ama WhatsApp alışkanlığını bozmadan: uygulamada bir şantiye hâlâ bir
sohbet grubu gibi görünüyor.

## Kimin için?

Uygulamayı dört farklı kişi kullanıyor ve her biri bambaşka bir şey bekliyor:

| Kim | Gerçek hayatta | Uygulamadan beklediği |
|---|---|---|
| Patron | İşini telefondan yönetir, bilgisayarı pek açmaz | Bir bakışta hangi şantiyede ne olduğunu, kimin geldiğini, nereye ne gittiğini görmek |
| Şantiye şefi | Sahadadır, elinde telefon vardır | Yoklamayı ve günlük ilerlemeyi birkaç dokunuşla girmek |
| Depo sorumlusu | Kamyonları yükleyip gönderir | Bir sevkiyatı üç soruyla kaydetmek |
| Çalışan | Sahada çalışır | Fotoğraf atmak, sorun bildirmek, kendi puantajını görmek |

Hedef kullanıcım, müteahhit olan dayım gibi biri. Bir ekranı tasarlarken kendime hep şunu sordum: **"Bunu dayım
kullanabilir mi?"** Cevap hayırsa ekran ne kadar güzel görünürse görünsün yanlıştı.

İlk müşterimiz Kızılkan İnşaat. Uygulamayı önce yalnızca onlar için yazdık, sonra birden çok firmaya satılabilen bir
ürüne (SaaS) dönüştürdük.

## Ürün nasıl şekillendi?

İlk sürüm hızlı çıktı: şantiyeler, gönderiler, fotoğraflar, sorunlar. Çalışıyordu ama ben bile kullanamıyordum. Dört
tasarım turundan sonra ürünün hikâyesi bulanıklaşmıştı: Sorunlar ekranı eklenip kaldırılmış, Görevler eklenmişti ve her
ekran başka bir uygulamadan gelmiş gibi duruyordu.

Burada durdum ve tek bir zihinsel modele döndüm: **şantiye bir WhatsApp grubudur.** Liste en son mesaja göre sıralanır,
saat "13:05", "Dün", "Salı" diye yazılır, kendi mesajında tikler vardır, sabitleme ve arama WhatsApp'taki gibi çalışır.
Kullanıcının zaten bildiği bir şeyi ona yeniden öğretmemenin, eklediğim herhangi bir özellikten daha değerli olduğunu
gördüm.

Sonra her modülü tek tek ele aldım ve birini bitirmeden ötekine geçmedim. Bu kararların hikâyesi
[08 · Ürün kararları](08-urun-kararlari.md)'nda.

## Bugün ne yapıyor?

| Modül | Ne işe yarar |
|---|---|
| Şantiyeler | Her şantiye bir sohbet grubu: mesaj, fotoğraf, video, sesli not, belge. Sabitleme, iletme, "kim gördü" |
| Saha | Şantiyenin günlük olay akışı. Fotoğraf atmak kadar kolay; "Sorun bildir" patrona anında bildirim gönderir |
| İlerleme | Taşeronların gerçekleşen üretimi ("Demir İşleri · 58,5 / 120 ton"). Şef yalnızca "bugün ne kadar"ı yazar |
| Görevler | Şantiyeye özel yapılacaklar; sorumlusu ve termini ile |
| Yoklama ve puantaj | Şef her sabah kimin geldiğini işaretler, ay sonunda puantaj ve Excel hazırdır. Çalışan kendi ayını görür |
| Malzemeler | Sevkiyat defteri: hangi kamyon, nereden nereye, hangi malzemeden ne kadar, irsaliyesiyle |
| Firma | Logo, firma bilgileri, kişiler, katılma bağlantısı, abonelik |
| Platform yönetimi | Bizim ekibimiz için: firmalar, paketler, abonelik ve ödemeler, kurulum linkleri, başvurular, işlem geçmişi |

Bunların yanında bir tanıtım sitesi, paket karşılaştırma sayfası, başvuru formu ve satın alan firmanın kendi hesabını
kurduğu bir kurulum sihirbazı var.

## Ekip

Projeyi iki kişi geliştirdik: ben ve ekip arkadaşım **Musa Kusbey**. Ürünün yönü, kuralları (anayasa) ve modüllerin
çoğunun tasarım kararları benden çıktı. Görevler, yoklamanın ilk sürümü, İlerleme modülü, uçtan uca testler ve güvenlik
denetiminin büyük kısmı Musa'nın işi. Kodun önemli bir bölümünü yapay zekâ (Claude Code) ile birlikte yazdık; bunu nasıl
disiplin altında tuttuğumuzu [07 · Kod kalitesi](07-kod-kalitesi.md)'nde anlattım.
