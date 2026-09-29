# Kızılkan Şantiye — İlerleme Tasarımı

TASARIM.md'nin bir bölümüdür; o dosya 300 satırı geçtiği için ayrı durur. İlkeler ve genel kararlar TASARIM.md'dedir.

28 Eylül'de kararlaştırıldı (Musa); 29 Eylül'de adı "İmalat"tan **İlerleme** oldu, her satır bir **iş kalemi**dir. İlerleme, şantiyede taşeronların ve ekiplerin **gerçekleşen üretimidir**: "Demir
İşleri · Kaya Demir · 58,5 / 120 ton". Ana nesne taşeron değil **iş kalemidir**: Şantiye → İş kalemi → Taşeron → Günlük
girişler. Sohbet iletişim, Saha günlük olay akışı, İlerleme gerçekleşen üretimdir.

> **Şef her gün yalnızca "bugün ne kadar yapıldı"yı yazar: "+3,5 ton".** Gerçekleşeni, kalanı, yüzdeyi ve durumu
> sistem hesaplar. Başarı ölçütü: "Demir İşleri → Güncelle → 3,5 → Kaydet".

## Kim görür, kim girer

| Rol | İlerleme |
|---|---|
| Patron | Görür, Excel alır. Veri girmez. |
| Şantiye şefi | Görür, **veriyi yalnızca o girer**: iş kalemi açar, düzeltir, siler; günlük girişleri yapar, yanlışı siler. |
| Depo sorumlusu | Görür, Excel alır (dördüncü rol, bkz. TASARIM.md "Kişiler"). |
| Çalışan | **Göremez**: İlerleme sekmesi yoktur, adresi açarsa listeye döner. |

## Yeri

Sol menüde ayrı bir İlerleme yoktur ("Hangi şantiyenin ilerlemesi?" sorusu cevapsız kalmasın). Şantiyenin içinde
üçüncü sekmedir: **Sohbet · Saha · İlerleme** (`/santiyeler/:id/ilerleme`). Bu sekmede gönderme çubuğu yoktur.

```
İlerleme Takibi                                   [Rapor / Excel] [＋ İş kalemi ekle]
┌ Aktif ───────┐┌ Tamamlanan ┐┌ Geciken ┐┌ Bugün güncellenen ┐   dar panelde 2 × 2
│ 4 iş kalemi  ││ 1 · %20    ││ 1 kayıt ││ 5 kalem · 24 saat│
Tümü 6 · Devam eden 3 · Bitmeye yakın 1 · Geciken 1 · Tamamlanan 1
[Taşeron ▾] [İş türü ▾]    [Ara…]
┌───────────────────────────────────────────────────────────────────────────┐
│ ⛏ Demir İşleri · 👤 Kaya Demir        (Devam ediyor)  Detay  Güncelle  ⋮  │
│ 58,5 / 120 ton                                                    %48,8   │
│ ████████████░░░░░░░░░░░░                                                  │
│ ↑ Bugün +3,5 ton   61,5 ton kaldı                Son güncelleme: Bugün 16:42 │
└───────────────────────────────────────────────────────────────────────────┘
Son günlük girişler: Tarih · İş kalemi · Günlük giriş · Taşeron · Durum · Not
```

## Parçalar

| Parça | Karar |
|---|---|
| Özet | Aktif (bitmemiş) iş kalemi, Tamamlanan (ve oranı), Geciken, Bugün güncellenen (son 24 saatte girişi olan). Yalnızca gösterge; masaüstünde panel genişse dört, darsa 2 × 2 (ekranın değil panelin genişliği). |
| Süzgeç | Durum düğmeleri sayılarıyla (masaüstünde `el-segmented`); taşeron, tür ve arama. Telefonda arama ve Vant'ın süzgeç menüsü (Durum · Taşeron · Tür). Mockup'taki ayrı "Durum" listesi yok: düğmeler aynı işi yapar. |
| Kart | Tür simgesi (türün adından okunur), ad, taşeron, durum; "58,5 / 120 ton · %48,8"; durumun renginde çubuk; "↑ Bugün +3,5 ton · 61,5 ton kaldı"; son güncelleme ("Bugün 16:42", "Dün 18:20"). Şefte Güncelle ve ⋮ (Düzenle, Sil); biten işte Güncelle yok. Sağ panel mockup'taki tek satıra sığmadığı için kart üç katlıdır. |
| Durum | Hesaplanır: toplam doldu → **Tamamlandı** (yeşil); planlanan bitiş geçti → **Gecikiyor** (kırmızı); %90 ve üstü → **Bitmeye yakın** (turuncu); öteki → **Devam ediyor** (mavi; marka renginin durumdaki tek istisnası). Gecikme bitmeye yakınlıktan önce gelir. |
| Yeni iş kalemi | Tür (hazır: Demir, Kalıp, Duvar, Sıva, Seramik, Boya, Elektrik, Mekanik, Mantolama, Alçı; yenisi yazılır), isteğe bağlı ad ("A Blok Demir İşleri"), taşeron, toplam miktar ve birim (ton, kg, m², m³, metre, adet, daire, kat, %; başkası yazılır), başlangıç, planlanan bitiş, açıklama. Girişi olan iş kalemi silinmez. |
| Taşeron | Yoklamanın taşeron ekibidir (firmada tek taşeron listesi). Listede yoksa şef adını yazar, kaydederken ekip olarak eklenir; yoklamada da görünür. Telefonda yazdıkça en fazla sekiz öneri çipi çıkar. |
| Günlük giriş | Bugün yapılan (birim iş kalemininkidir, değiştirilmez), çalışan sayısı, tarih (bugün; geçmiş güne değiştirilir, ileri gün olmaz), not, fotoğraf ve PDF (en fazla 10; fotoğraf küçültülür), Saha'ya yansıt. 0 girilebilir ("Çalışma yapılmadı"). Aynı güne birden çok giriş toplanır. |
| Türkçe sayı | Miktar "3,5" diye yazılır (virgül ondalık, nokta binlik: "12.000"); "3.5" de anlaşılır. Sayı kutusu virgülü kabul etmediği ve telefonun Türkçe sayı klavyesinde ondalık tuşu virgül olduğu için alan yazıdır. |
| Toplamı aşan giriş | Engellenmez, sorulur: "Bu giriş ile toplam gerçekleşme 123 ton olacak (toplam 120 ton). Devam edilsin mi?" |
| Kaydedince | "İlerleme kaydedildi · Demir İşleri için +3,5 ton kaydedildi." (yansıtıldıysa "Saha akışına da eklendi."). |
| Detay | Özet (toplam, tamamlanan, kalan, ilerleme, tarihler) ve gün gün geçmiş: "+3,5 ton · 12 çalışan · 16:42 · Mehmet Şef", not, fotoğraflar (dokununca büyür), belgeler. Şef yanlış girişi siler (telefonda sola kaydırarak); toplamdan düşer. |
| Saha'ya yansıt | **Kapalı gelir** (Musa'nın kararı): Saha'yı çalışanlar da görür. Açılırsa Saha'ya sıradan bir saha güncellemesi düşer, fotoğrafıyla: "📐 İlerleme · Demir İşleri: +3,5 ton · 62 / 120 ton (%51,7)". Giriş silinirse Saha'dan da çekilir; Saha'dan silinirse fotoğraf iş kaleminde kalır. Yansıtılmayan girişin fotoğrafı "bugünün fotoğrafları"na ve galeriye düşmez. |
| Excel | "ilerleme-2026-09-28.xlsx": İş kalemleri (ekrandaki hesaplarla, durum renkli) ve Günlük girişler (gün gün, giren ve an). Patron, şef ve depo sorumlusu alır. |
| Durumlar | Yüklenirken iskelet; hata olursa "İlerleme verileri yüklenemedi. · Tekrar dene"; boşsa "Henüz iş kalemi yok" ve şefte "İlk iş kalemini ekle". |

## Bilerek yapılmayanlar (sonraki tur)

Birim fiyat ve maliyet (hakediş, avans, KDV, stopaj, ödeme ayrı bir Finans modülünün işidir; maliyet yetkisi de
onunla gelir), ilerleme grafiği, "Planlanan iş kalemleri" sekmesi, sohbette paylaşma, taşeronların ayrı ekranı,
planlanan ilerlemeyle kıyaslanan gecikme (şimdilik yalnızca tarih).
