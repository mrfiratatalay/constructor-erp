# 08 · Ürün kararları

Bu sayfada karşılaştığım sorunları ve verdiğim kararları tek tek anlatıyorum. Her kararın bir bedeli var; onu da
yazdım, çünkü bedelini bilmediğim bir karar bence karar değil.

---

## 1. Şantiye bir WhatsApp grubudur

**Sorun.** Dört tasarım turundan sonra ürünün ne olduğu belirsizleşti. Ekranlar eklenip çıkarılıyordu ve ben bile
uygulamayı kullanmak istemiyordum.

**Düşünce.** Kullanıcılarım zaten her gün WhatsApp kullanıyor. Onlara yeni bir uygulama öğretmek yerine, bildikleri bir
şeyin üzerine kurabilirdim.

**Karar.** Şantiye listesi WhatsApp'ın sohbet listesi gibi: en son mesaj en üstte, kendi mesajın "Sen: …" diye
önizleniyor, saat "13:05 · Dün · Salı · 12.09.2026" biçiminde. Mesajlarda tikler var (🕓 gönderilmedi, ✓ gönderildi,
mavi ✓✓ herkes gördü). Sabitleme en fazla 3, uzun basınca açılıyor. Biten şantiyeler listenin altında toplanıyor.

**Bedeli.** WhatsApp'ta olmayan bir şeyi eklemek her seferinde "bu modele nasıl oturur?" sorusunu gerektiriyor. Bu bir
kısıt ama iyi bir kısıt.

---

## 2. Şantiye başına davet yerine tek bağlantı

**Sorun.** İlk modelde kişiler şantiyelere tek tek davet ediliyordu. Kurmak da yönetmek de yorucuydu.

**Düşünce.** Gerçek hayata baktım: dört kişilik bir patron ekibi ve sürekli değişen işçiler var. Herkes her şantiyeye
gidiyor; "A şantiyesinde 3 kişi, B'de 5 kişi" diye bir dağılım yok. Model gerçeğe uymuyordu.

**Karar.** Firmanın **tek bir katılma bağlantısı** var. Patron bağlantıyı WhatsApp grubuna atıyor; açan kişi adını ve
telefonunu yazıp çalışan olarak katılıyor ve bütün şantiyeleri görüyor. Patron dilediğinde bağlantıyı yeniliyor ya da
birini firmadan çıkarıyor. Birden çok patron olabiliyor.

**Bedeli.** Bağlantı yanlış birinin eline geçebilir. Bunu bilerek kabul ettim: bağlantı yenilenebiliyor, kişi
çıkarılabiliyor ve bu kullanıcılar için sadelik, ince taneli kontrolden daha değerli.

---

## 3. Yoklama: "ay sonunda kime kaç gün?"

**Sorun.** Yoklamanın ilk sürümü çalışıyordu: sohbete bir yoklama mesajı düşüyor, çalışanlar "Katıldım"a basıyordu. Ama
hikâyesi içime sinmedi.

**Düşünce.** Yoklamanın asıl amacını sordum: ay sonunda kime kaç günlük para ödeneceği. Bu sorunun sahibi şef. Kendi
yoklamasını kendisi işaretleyen işçi bu soruyu cevaplamıyor.

**Karar.**
- Yoklama şantiyenin değil, **firmanın**. Şef her sabah tek bir listeyi işaretliyor.
- Firmanın kendi çalışanları kişi kişi, taşeron ekipler (demirci gibi) **ekip olarak** sayılıyor: "Ekip geldi mi?" Kaç
  kişiyle geldiği ekip başının işi.
- **İşaretlenmemiş, gelmedi demek değil.** Boş satır boş kalıyor; sistem kimseyi kendiliğinden "gelmedi" yapmıyor.
- Mesai bir durum değil, "Geldi"nin üstüne yazılan saat.
- Her işaret anında kaydediliyor. "Yoklamayı tamamla" düğmesi yok: tamamlanıp tamamlanmadığı listeden hesaplanabiliyor
  ve ikinci bir durum listeyle çelişebilirdi.
- Şef yalnızca bugünü, patron geçmiş günleri de düzeltebiliyor. Çalışan kendi ayını "Puantajım"da görüyor.

**Bedeli.** Çalışmış bir modülü baştan yazdık ve eski yoklama mesajlarını emekliye ayırdık. Ama modül artık gerçek bir
soruyu cevaplıyor ve ay sonunda Excel hazır.

---

## 4. Saha akışı ayrı bir tablo değil

**Sorun.** Şantiyenin günlük olay akışı için bir "Saha" sekmesi istedim: fotoğraflı, gün gün, en yeni üstte.

**Düşünce.** İlk akla gelen, saha güncellemeleri için ayrı bir tablo açmak. Ama o zaman listedeki son mesaj önizlemesi,
okunmamış sayısı ve arama bu kayıtları görmeyecekti; hepsini ikinci kez yazmak gerekecekti.

**Karar.** Saha güncellemesi **normal bir gönderi**, üzerinde yalnızca bir işaret var (`is_field_update`). Sohbette de
"📍 Saha" ya da "⚠ Sorun" etiketiyle görünüyor. Sohbetteki bir mesaj menüden "Sahaya ekle" ile akışa alınabiliyor.
Her fotoğrafı otomatik olarak sahaya eklemeyi düşündüm ama akışı çöple doldururdu; vazgeçtim.

**Bedeli.** Gönderi tablosu iki işi birden taşıyor. Karşılığında önizleme, okunmamış sayısı ve arama hiç değişmeden
çalışmaya devam etti.

---

## 5. Malzeme: depo yönetim sisteminden sevkiyat defterine

**Sorun.** Malzeme modülü yavaş yavaş bir depo yönetim sistemine dönüşmüştü: 7 hareket türü, 8 durum, 4 sayı kartı,
13 süzgeç, 9 kolonlu bir tablo. Bunu kullanacak kişi ilkokul mezunu bir depo sorumlusuydu ve öğrenmesi gereken kavram
sayısı işin kendisinden fazlaydı.

**Düşünce.** Gerçekte olan şeyi sordum: bir kamyon yükleniyor ve bir yere gidiyor.

**Karar.**
- Modülün konusu stok değil **sevkiyat**. Bir sevkiyat bir kamyon: tek hedef, tek irsaliye, içinde birden çok kalem.
- Kullanıcı "hareket türü" seçmiyor, tek bir soruya cevap veriyor: **nereye?** Türü sunucu hesaplıyor.
- "Teslim alındı" adımını kaldırdım. Kimse basmayınca kayıtlar sonsuza kadar "Yolda" kalıyordu; bu işin gerçeğine
  uymayan bir bürokrasiydi. Geriye iki durum kaldı: kayıtlı ve iptal.
- Ayrı bir stok ekranı yok. Ortada duran bir stok tablosu, tek bir kayıt unutulduğunda yalan söyler. Stok yalnızca
  sevkiyat girilirken malzemenin altında görünüyor: "Depoda: 300 Torba".
- Listede olmayan malzeme akışı tıkıyordu. Seçici artık arıyor; bulamazsa yazılan adı yeni bir malzemeye çeviriyor.

**Sonuç.** Modülün backend'i 94 dosya ve 3.622 satırdan 65 dosya ve 2.336 satıra indi. Bu projede en çok gurur
duyduğum commit bir şey eklediğim değil, bir şey çıkardığım commit.

---

## 6. İlerleme: şef yalnızca "bugün ne kadar"ı yazar

Bu modülü Musa tasarladı. Sevdiğim kararı şu: şef her gün yalnızca o gün yapılanı yazıyor, "+3,5 ton". Gerçekleşeni,
kalanı, yüzdeyi ve durumu (Devam ediyor, Bitmeye yakın, Gecikiyor, Tamamlandı) sistem hesaplıyor. Kullanıcıdan
hesaplanabilecek bir şeyi istemiyoruz.

Küçük ama önemli bir ayrıntı: miktar "3,5" diye yazılıyor. Tarayıcının sayı kutusu virgülü kabul etmiyor, telefonun
Türkçe klavyesinde ondalık tuşu ise virgül. Bu yüzden alan bir metin kutusu ve "3,5" de "3.5" de doğru anlaşılıyor.
Toplamı aşan bir giriş engellenmiyor, soruluyor: "Toplam gerçekleşme 123 ton olacak (toplam 120 ton). Devam edilsin mi?"

---

## 7. Ödeme ekranı yok

Tanıtım sitesinde sahte bir ödeme ekranı göstermek kolaydı. Ama bu sektörde satış bir telefonla, ödeme havaleyle oluyor.
"Paketi seç" bir başvuru formuna gidiyor, başvuru platform yönetiminde karşılanıyor ve ödeme elle kaydediliyor. Var
olmayan bir süreci taklit etmek yerine gerçek olanı modelledik.

---

## 8. Ücretsiz barındırmanın sınırı ve canlı demo

Ürünü canlıya aldıktan sonra ücretsiz katmanın gerçeğiyle karşılaştım: backend uyuyor, veritabanının süresi doluyor.
Projemi incelemek isteyen birinin karşısına ya boş bir sayfa ya da bir dakikalık bekleme çıkıyordu. Çözümü
[09 · Yayına alma](09-yayina-alma.md)'da anlattım.
