# 05 · Arayüz

## Bir ürün, iki kullanım şekli

Patron uygulamayı çoğunlukla telefondan açıyor. Şef sahada, telefonda. Ama ay sonunda puantaja bakan, sevkiyat listesini
süzen, firmaları yöneten kişi bilgisayarın başında. Bu iki kullanım o kadar farklı ki tek bir "duyarlı (responsive)"
tasarımla ikisini de iyi yapmak mümkün değildi.

Bu yüzden arayüzde **iki kabuk** var:

| Kabuk | Kütüphane | Ne zaman |
|---|---|---|
| `mobile/` | Vant | Telefon ve dokunmatik tablet |
| `desktop/` | Element Plus | Bilgisayar |

Hangi kabuğun açılacağına açılışta, ekran genişliğine ve dokunmatik olup olmamasına bakarak karar veriliyor.
Kullanıcı isterse öbürüne geçebiliyor. Kabuklar dinamik olarak yükleniyor: telefon masaüstü kodunu hiç indirmiyor,
bilgisayar da Vant'ı.

```ts
// app/loadPlatform.ts
const loaders: Record<Platform, () => Promise<{ default: PlatformModule }>> = {
  mobile: () => import('@/mobile'),
  desktop: () => import('@/desktop'),
}
```

## Ortak beyin, ayrı yüzler

İki kabuk olunca en büyük risk, aynı iş mantığını iki kez yazmak. Bunu klasör sınırlarıyla çözdüm:

```text
core/      iş mantığı, API, oturum, composable'lar   → hiçbir UI kütüphanesini import edemez
shared/    kütüphanesiz ortak bileşenler             → Vant ya da Element Plus import edemez
mobile/    yalnızca Vant                              → Element Plus'ı import edemez
desktop/   yalnızca Element Plus                      → Vant'ı import edemez
```

Bir puantaj hesabı, bir tarih biçimi ya da bir "bu kişi bu sayfayı görebilir mi" kuralı `core/`'da bir kez yazılıyor;
iki kabuk aynı fonksiyonu kullanıyor. Kabuklar yalnızca görüntüden sorumlu.

Bu kurallar belgede kalsaydı bir gün çiğnenirdi. O yüzden ESLint'e yazdım: `core/` içinden Vant import eden kod build'den
geçmiyor ve hata mesajı hangi kuralın çiğnendiğini söylüyor (`Mimari sınır ihlali: ANAYASA.md Madde 4`).

## Atomik tasarım

Her kabuğun içi beş katman:

| Katman | Ne | Örnek |
|---|---|---|
| `atoms/` | En küçük parça, iş mantığı yok | Durum etiketi, avatar |
| `molecules/` | Birkaç atomun birlikte yaptığı tek iş | Avatar + isim + zaman |
| `organisms/` | Ekranın bütün bir bölümü | Gönderi kartı, yoklama satırı |
| `templates/` | Sayfa iskeleti, veri yok | Telefon kabuğu, liste + detay düzeni |
| `pages/` | Adrese bağlı sayfa; veriyi alır, dağıtır | Şantiyeler, Yoklama |

Bir katman yalnızca kendinden alttakileri import edebiliyor; bu da ESLint ile denetleniyor. Böylece bir atom gidip bir
sayfaya bağımlı hale gelemiyor.

## Bütün adresler tek tabloda

Uygulamanın bütün adresleri `core/navigation/routeTable.ts`'de duruyor: yol, başlık, gereken izin ve paket modülü. İki
kabuk aynı tabloyu kullanıyor ve her kabuk her adres için ya bir sayfa ya da bir yönlendirme vermek zorunda. Unutulan bir
adres **tip hatası** oluyor, yani derleme kırılıyor. Telefonda ayrı bir sayfa olan "Hesabım", bilgisayarda bir panel;
masaüstü kabuğu o adresi panele yönlendiriyor.

## Elle yazılmış istek yok

Backend'in OpenAPI dokümanından Orval ile tipli bir istemci üretiliyor (`npm run api`). Backend bir alanı değiştirdiğinde
istemci yeniden üretiliyor ve o alanı kullanan her ekran TypeScript hatası veriyor. Yanlış alan adı ya da eksik parametre
çalışma anında değil, derlerken yakalanıyor.

Bütün istekler tek bir fonksiyondan (`core/api/http.ts` içindeki `apiRequest`) geçiyor. Bu tek kapı sonradan çok işe
yaradı: canlı demoda gerçek backend'in yerine tarayıcının içindeki sahte bir backend'i bu kapıya bağladık
(bkz. [09 · Yayına alma](09-yayina-alma.md)).

## Sahada zayıf internet

Şantiyede internet çoğu zaman zayıf ya da hiç yok. Bunun için üç şey yaptık:

1. **Gönderim kuyruğu.** Fotoğraflı bir gönderi hemen ekranda görünüyor ve telefonun kendi deposuna (IndexedDB)
   yazılıyor. İnternet gelince kendiliğinden gönderiliyor; uygulama kapatılıp açılsa bile kaybolmuyor. Gönderilmeyen
   mesajın yanında WhatsApp'taki gibi bir saat simgesi duruyor.
2. **Fotoğraf küçültme.** Fotoğraflar yüklenmeden önce telefonda en uzun kenarı 1600 piksel olacak şekilde
   küçültülüyor. Telefon kamerasının çektiği birkaç megabaytlık dosyayı zayıf bir bağlantıyla göndermeye çalışmak
   yerine çok daha küçük bir dosya gidiyor ve şantiye fotoğrafı için gereken netlik kaybolmuyor.
3. **Uygulama dosyaları önbellekte.** Service worker uygulamanın kendi dosyalarını önbelleğe alıyor ve uygulama zayıf
   internette bile anında açılıyor. API cevapları ve medya ise hiçbir zaman önbellekten verilmiyor; eski veri göstermek
   yanlış veri göstermekten farksız.

## Bildirimler

Uygulama telefona yüklenebiliyor (PWA) ve bildirim gönderebiliyor. "Sorun bildir"e basıldığında patronun telefonuna
bildirim düşüyor; her akşam 18:00'de patrona "bugün haber gelmeyen şantiyeler" özeti gidiyor. Bildirimlerin nasıl
gönderildiği [06 · Backend](06-backend.md)'de.

## Görsel kalite

Bir noktada ekranların görüntüsünü yeterli bulmadım ve görsel kaliteyi tek hedef yaptım. Kurduğum döngü şuydu:

1. Ekranı telefon ve masaüstü boyutunda Playwright ile çek.
2. Görüntüyü eleştir: hiyerarşi, boşluk, renk dozu, boş durumlar.
3. Kütüphanenin hazır bileşenine bak; elle CSS yazmadan önce Vant ya da Element Plus'ın bunu zaten yapıp yapmadığını
   kontrol et.
4. Karar ver, kodla, yeniden çek ve karşılaştır.

Yeni arayüzde elle CSS yazmamaya karar verdim. Kütüphanelerin bileşenleri erişilebilirliği, klavye kullanımını ve kenar
durumlarını benim yazacağım CSS'ten daha iyi çözüyor. Benim işim doğru bileşeni seçip doğru yere koymak oldu.
