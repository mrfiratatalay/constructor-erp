# Kızılkan Şantiye — Malzeme Tasarımı

TASARIM.md'nin bir bölümüdür; o dosya 300 satırı geçtiği için ayrı durur. İlkeler ve genel kararlar TASARIM.md'dedir.

## Malzemeler (firmanın sevkiyat defteri)

28 Eylül'de kararlaştırıldı, **29 Eylül'de baştan yazıldı.** İlk tur bir depo yönetim sistemine dönüşmüştü: 7 hareket
türü, 8 durum, 4 sayı kartı, 13 süzgeç, başlıkta "(Rol: Depo Sorumlusu)" rozeti, ayrı bir Stok sekmesi. Dokümanın kendi
ilkelerini çiğniyordu (İlke 4: eyleme dönüşmeyen sayı gösterilmez). Bu turda modül tek bir işe indirildi.

Malzeme firmanındır, şantiyenin değil: Kızılkan'ın **bir ana deposu** vardır. Depo sorumlusu deponun başında durur;
malzemeyi kendi şantiyelerine ya da başka bir müteahhide gönderir. Menüde Şantiyeler ve Yoklama'nın yanında kendi
maddesidir.

> **"Bu ekran stok tutmaz, sevkiyat tutar: ne çıktı, nereye gitti, geri gelecek mi."**

**Bu modülü ilkokul mezunu insanlar kullanır.** Ölçüt budur: ekranda öğrenilmesi gereken bir kavram varsa yanlıştır.
WhatsApp'ta süzgeç, sekme ve sayı kartı yoktur; bir liste ile bir düğme vardır. Malzeme ekranı da odur.

### Stok ekranı yoktur

Modülün konusu stok değil **sevkiyat**: patronun sorusu "depoda kaç torba çimento var" değil, "şu malzeme nereye
gitti, karşılığı ne oldu, geri gelecek mi".

Stok yine de hesaplanır (giren eksi çıkan) ama **ekranı yoktur**: sayı yalnızca sevkiyat çıkarılırken seçilen
malzemenin altında tek satır olarak görünür — "Depoda: 300 Torba". Depo sorumlusunun onu merak ettiği tek an,
gönderirken olan andır. Ortada duran bir stok tablosu ise bir sevkiyat yazılmayı unutulduğu anda yalan söyler ve
kavga çıkarır; kenarda duran sayı yalnızca yardım eder.

| Kalkan | Neden |
|---|---|
| **Stok sekmesi**, kritik/tükendi durumu, kritik eşik (`min_stock`), lokasyon kırılımı | Ayrı ekran, öğrenilecek kavram demektir; "Depoda: 300 Torba" cümlesini herkes anlar. |
| **Sayım Düzeltmesi** ve **şantiyede harcama** hareketleri | İkisi de yalnızca stok sayısını değiştirmek için vardı. |
| **"Stok eksiye düşmez"** kilidi, "Kullanılabilir: 900 Torba" uyarısı | Sayılmayan stok engel de koyamaz. Depo sorumlusu ne gönderdiğini kendi bilir. |
| **Sayı kartları** (Toplam Malzeme / Bu Ay / Dışarı Verilen / Beklenen İade) | İlke 4. |

**Kalan:** sevkiyatın kendisi, **dışarıdakiler** (bu stok değil, takiptir) ve malzeme kartı — ama kart sadeleşir:
**ad + birim.** Kategori alanı sahada birim gibi dolduruluyordu ("Çimento · CUVAL"), kritik eşik ise stok ekranı
olmadan anlamsız.

### Tek kavram: sevkiyat

Bir sevkiyat bir kamyondur: tek hedef, tek irsaliye, içinde birden çok kalem.

| Karar | Neden |
|---|---|
| **Kullanıcı "hareket türü" seçmez.** Tek soru: *nereye?* Türü sunucu iki uçtan hesaplar, ekran yalnızca sonucu yazar ("Şantiyeye gönderildi"). | Depo sorumlusu "bu bir TO_SITE hareketidir" diye düşünmez; "bu çimento A şantiyesine gidiyor" diye düşünür. Altı kutu tek soruya iner ve form kendiliğinden sadeleşir. |
| **Sevkiyat çok kalemlidir.** Bir kamyon çıkar, tek irsaliyeyle birkaç kalem götürür. Kalem = malzeme + miktar. | İrsaliye kalemin değil, seferin belgesidir. |
| **Teslim alma adımı yoktur.** Sevkiyat çıktığında yazılır ve biter. Durum ikidir: **kayıtlı** ve **iptal**. | Kamyonun vardığını ayrıca onaylatmak bu firmanın çalışma şekline uymayan bir bürokrasi. Kimse o düğmeye basmayınca kayıtlar sonsuza kadar "Yolda" kalır ve ekran yalan söyler. Aralarındaki bürokrasi basittir; defter de öyle olmalı. |
| **Dışarı verilende tek soru: "geri gelecek mi?"** Satıldı / Ödünç / Destek üçlüsü kalktı. İşaretliyse "dışarıda" sayılır. | İki müteahhidin anlaşması para, **iş karşılığı**, hatır ya da karışık olur — yazılım bunu bilemez ve fatura da kesmez; nitekim üçlü liste ilk gerçek örnekte yetmedi. Sistemin bilmesi gereken tek şey takibi ilgilendirendir: mal geri gelecek mi? Anlaşma açıklamaya yazılır ("iş karşılığı, Mehmet Usta"). |
| **Listede olmayan malzeme akışı durdurmaz.** Seçici arar; bulamazsa yazılan ad doğrudan yeni malzemeye dönüşür, birim hazır düğmelerden tek dokunuşla gelir. | Sahadaki en sık durum, gönderilecek malzemenin kartının henüz olmamasıdır. Ayrı bir malzeme ekranına gitmek gerekirse kayıt hiç girilmez. Bu yüzden **şef de kart açabilir**: sevkiyat girebilen biri malzeme adında tıkanmamalı. |
| **İrsaliye fotoğrafı sevkiyatın parçasıdır**, eklentisi değil: formda kendi adımı vardır. | Kamyon çıkarken çekilmezse bir daha çekilmez. |
| **Kayıt silinmez**, iptal edilir, nedeni zorunludur, izi kalır. Düğmeler rol adına değil izne göre görünür. | İlke 6. |

### Tek soru: nereye?

Kullanıcı bu tabloyu görmez; formun ilk sorusuna tek bir cevap verir, adını sunucu koyar.

| Kullanıcı ne diyor | Sistemin kaydettiği | Ekranda yazan |
|---|---|---|
| *(şantiye adı)* | Ana Depo → şantiye | Şantiyeye gönderildi |
| "Başka firmaya" | Ana Depo → firma | Dışarı verildi |
| "Depoya mal geldi" | firma → Ana Depo | Depoya geldi |
| **"İade geldi"** düğmesi | firma → Ana Depo, çıkışa bağlı | İade geldi |

**İade çıkışın kendisinden başlar.** Boş formdan girilseydi yanlış firmaya ya da yanlış malzemeye bağlanırdı;
"İade geldi" düğmesi malzemeyi, firmayı ve dönüş yerini çıkıştan alır. İade düşünce çıkış artık "dışarıda"
sayılmaz.

### Telefon: iş yapılan yer

Telefon tarama ekranı değildir; depo sorumlusu depoda ayakta durur. Açılışta sayı kartı ve sekme yoktur — ilk
ekranda **yapılacak iş** durur, altında tek liste.

```
┌──────────────────────────┐
│  [ + Sevkiyat çıkar ]    │
│  🔍 Malzeme ya da firma  │
│                          │
│  Dışarıda (2)            │  ← yalnızca varsa
│  ┌────────────────────┐  │
│  │ Ana Depo → M. Usta │  │
│  │ Kalıp 50 Adet ·    │  │
│  │ 40 gündür dönmedi  │  │
│  └────────────────────┘  │
│  Sevkiyatlar             │
└──────────────────────────┘
```

| Parça | Karar |
|---|---|
| Sevkiyat formu | Tam ekran, **numaralı üç bölüm** tek sayfada (sihirbaz değil: gizli adım kalmaz, her şey görünür): **1 · Nereye gidiyor?** şantiye listesi, "Başka firmaya", "Depoya mal geldi"; dış firmaysa "geri gelecek mi?" anahtarı. Hedef seçilince bölüm tek satıra iner, çünkü dokuz şantiyeli firmada form uzar. · **2 · Ne, ne kadar?** kalem başına malzeme + miktar, "bir şey daha ekle" ile çoğalır, `van-swipe-cell` ile silinir · **3 · İrsaliye** `van-uploader` ile kameradan. Altta tek düğme: Gönder. |
| Malzeme seçici | Tam ekran, üstte arama. Yazılan ad listede yoksa **"Listede yok"** bölümü açılır: birim hazır düğmelerden seçilir (Torba, Adet, Ton, Kg, m³, Metre, Paket, Kutu) ya da elle yazılır, `"Kireç" ekle ve seç` ile kart açılır ve satıra yerleşir. Form kaybolmaz. |
| Stok satırı | Seçilen malzemenin altında "Depoda: 300 Torba" — **yalnızca sayı sıfırdan büyükse.** Yeni açılan malzemenin ya da girişi yazılmamış malın sayısı sıfırdır; "Depoda: 0" depo boş demek değildir, kayıt yok demektir ve okuyanı yanıltır (İlke 3). Bilmediğimiz şeyi yazmayız. |
| Satır | Nereden nereye, altında kalemler ("Çimento 300 Torba, +2 kalem"). Normal sevkiyat **rozet almaz**; yalnızca iptal ve dışarıda kalan işaretlenir (İlke 3). |
| Dışarıda | Geri gelecek diye işaretlenmiş ve henüz dönmemiş sevkiyatlar, en üstte; satırda "40 gündür dönmedi" yazar. Ayrıntıda tek düğme: **İade geldi**. Bugün verilene gün yazılmaz. |

### Masaüstü: bakılan yer

Tablo, arama ve Excel burada anlamlıdır. Başlıkta rol rozeti yoktur, üstte sayı kartı yoktur, **sekme yoktur** —
tek liste vardır.

```
Malzemeler                                      [Excel] [+ Sevkiyat]
 ⚠ 2 malzeme dışarıda, geri bekleniyor                   ← yalnızca eyleme dönüşürse
[🔍 Malzeme, firma ya da açıklama ara]
 Tarih · Nereye · Kalemler
```

| Parça | Karar |
|---|---|
| Üst şerit | Sayı kartı yerine tek satır, yalnızca **eyleme dönüşen** bilgi: geri beklenen malzeme. Yapacak bir şey yoksa şerit hiç görünmez (İlke 3). |
| Süzgeç | Tek arama kaldı. Tür çipleri ile tarih, lokasyon ve durum süzgeçleri kalktı — tür artık kullanıcı kavramı değil, durum da ikiye indi. |
| Tablo | Üç kolon: Tarih · Nereye · Kalemler ("Çimento 300 Torba, +2 kalem"). İptal edilen satırın yolu üstü çizili yazılır; dışarıda kalanda "40 gündür dönmedi" durur. `el-table`; satıra tıklayınca sağdan `el-drawer`. |
| Sevkiyat ayrıntısı | `el-descriptions` künye, kalem tablosu, irsaliye bağlantıları, `el-timeline` değişmez geçmiş (kim çıkardı, kim iptal etti, iade ne zaman geldi). Altta duruma ve izne göre: İade geldi, İptal et. |
| Yeni malzeme | Seçicinin altındaki "+ Listede yok, yeni malzeme ekle" küçük bir pencere açar: ad + birim; eklenince satıra yerleşir. |
| Excel | Tek kitap, tek sayfa: Sevkiyatlar, her kalem bir satır (Excel süzsün ve toplasın diye). |
| Saha | Şantiyeye gelen ya da şantiyeden çıkan sevkiyat o şantiyenin Saha akışına referans gönderi olarak düşer; dokununca sevkiyat açılır, iptal edilirse kart "İptal" der. Transfer iki şantiyeye de düşer. |

**Roller.** Patron ve **Depo sorumlusu** her şeyi yapar. Şef sevkiyatı görür, kendi şantiyesinden çıkarır, malzeme
kartı açar ve döküm alır; iptal patron ile depo sorumlusundadır. Çalışan malzemeyi görmez. Depo sorumlusu yoklamada
sayılmaz; uygulamayı açınca doğrudan Malzemeler'e düşer. Patron onu Katılımcılar'dan atar.

**Sonraki turlara bırakılanlar:** stok ekranı (sayı hesaplanır ve formda görünür, ama listesi yoktur), kritik eşik
ve sayım düzeltmesi, şantiyede harcama kaydı, şantiyeden şantiyeye transfer, kısmi iade, çoklu birim ve dönüşüm,
barkod / QR, kritik stok bildirimi, satın alma ve tedarikçi fiyatları, hakediş ve muhasebe bağlantısı, araç ve
şoför kaydı.
