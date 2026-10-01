# 01 — Ekran ve akış envanteri

Kaynak: `frontend/src/core/navigation/routeTable.ts` (tek rota tablosu), `desktop/routes.ts`, `mobile/routes.ts`,
`app/authGuard.ts` (oturum, rol, paket ve kilit koruması) ve backend'deki `@PreAuthorize` / `@RequiresFeature`.
Tarih: 1 Ekim 2026. Envanter repodan çıkarıldı, eski dokümanlardan değil.

## Roller ve erişim

| Kim | Gerçek model | Notlar |
|---|---|---|
| Ziyaretçi | oturum yok | Tanıtım sitesi, giriş, bağlantıyla katılma/davet/kurulum |
| Patron | `OWNER` | Firma ve kişiler; yoklama ve puantaj; malzeme; ilerlemeyi görür (giremez) |
| Şef | `SITE_LEAD` | Yoklama alır; malzeme; ilerleme girer (`MANAGE_PRODUCTION`) |
| Depo | `WAREHOUSE` | Malzeme izinleri (`Permission`) |
| Çalışan | `WORKER` | Şantiyeler ve kendi puantajı (`/puantajim`) |
| Süper yönetici | `platformAdmin` (firmadan ayrı) | `/platform-admin/**` |

Paket modülleri (`meta.feature` + `@RequiresFeature`): `attendance`, `materials`, `production`, `tasks`.

## Rotalar

Durum sütunları: Masaüstü 1440×900 · Mobil 390×844 · Akış · UI/UX. "Düzeltildi": bu çalışmada bulunan kusur giderildi
ve yeniden doğrulandı. Küçük ekran regresyonu (1366×768 ve 360×800) bütün rotalarda koşuldu: sayfa düzeyinde taşma yok.

| Rota | Ad | Kim | Masaüstü | Mobil | Akış | UI/UX | Not |
|---|---|---|---|---|---|---|---|
| `/` | landing | Ziyaretçi (oturumluyu ana sayfasına yollar) | Geçti | Geçti | Geçti | Geçti | |
| `/fiyatlar` | pricing | Ziyaretçi | Geçti | Geçti | Geçti | Geçti | |
| `/basvuru` | apply | Ziyaretçi | Geçti | Düzeltildi | Düzeltildi | Düzeltildi | D-18, D-19, D-20 |
| `/giris` | login | Ziyaretçi | Düzeltildi | Düzeltildi | Düzeltildi | Düzeltildi | D-05, D-06 |
| `/davet/:token` | invite | Ziyaretçi | Düzeltildi | Düzeltildi | Geçti | Düzeltildi | D-04 |
| `/katil/:token` | join | Ziyaretçi | Düzeltildi | Düzeltildi | Geçti | Düzeltildi | D-04 |
| `/kurulum/:token` | setup | Satın alan firma | Geçti | Geçti | Geçti (tam kurulum yapıldı) | Geçti | Sihirbaz uçtan uca: firma → patron → şantiye |
| `/santiyeler` | sites | Firma | Düzeltildi | Düzeltildi | Geçti | Düzeltildi | D-16, D-17, D-40 |
| `/santiyeler/:id` | siteFeed (Sohbet) | Firma | Geçti | Düzeltildi | Düzeltildi | Geçti | D-23 (çift gönderim) |
| `/santiyeler/:id/saha` | siteField | Firma | Geçti | Düzeltildi | Geçti | Geçti | D-07 |
| `/santiyeler/:id/ilerleme` | siteProduction | Patron, şef (`production`) | Düzeltildi | Düzeltildi | Geçti (şef ile kalem + günlük giriş) | Düzeltildi | D-33, D-34, D-35 |
| `/santiyeler/:id/gorevler` | siteTasks | Firma (`tasks`) | Geçti | Geçti | Geçti | Geçti | |
| `/yoklama` | attendance | Patron, şef (`attendance`) | Düzeltildi | Düzeltildi | Düzeltildi | Düzeltildi | D-03, D-27, D-30 |
| `/yoklama/kisi/:entryId` | memberAttendance | Patron, şef | Panel | Geçti | Geçti | Geçti | Masaüstünde sağ panel |
| `/puantajim` | myPuantaj | Çalışan | Geçti | Geçti | Geçti | Geçti | |
| `/malzemeler` | materials | `VIEW_MATERIALS` (`materials`) | Düzeltildi | Düzeltildi | Düzeltildi | Düzeltildi | D-08…D-12, D-37, D-39 |
| `/firma` | company | Patron | Düzeltildi | Düzeltildi | Geçti | Düzeltildi | D-21 |
| `/ben` | profile | Firma | Yönlendirme (masaüstünde panel) | Geçti | Geçti | Geçti | |
| `/erisim` | workspaceLocked | Kilitli firma | Geçti | Geçti | Geçti (askıya alma denendi) | Geçti | |
| `/platform-admin` | platformDashboard | Süper yönetici | Düzeltildi | Düzeltildi | Geçti | Düzeltildi | D-01, D-02 |
| `/platform-admin/firmalar` | platformTenants | Süper yönetici | Düzeltildi | Geçti | Geçti | Düzeltildi | D-26, D-31 |
| `/platform-admin/firmalar/:id` | platformTenant | Süper yönetici | Düzeltildi | Geçti | Düzeltildi | Düzeltildi | D-14, D-15, D-24 |
| `/platform-admin/basvurular` | platformLeads | Süper yönetici | Düzeltildi | Düzeltildi | Geçti | Düzeltildi | D-31, D-32 |
| `/platform-admin/paketler` | platformPlans | Süper yönetici | Düzeltildi | Yönlendirme (özet) | Geçti | Düzeltildi | D-25 |
| `/platform-admin/islem-gecmisi` | platformAudit | Süper yönetici | Düzeltildi | Yönlendirme (özet) | Geçti | Düzeltildi | D-26 |
| `/:pathMatch(.*)*` | — | Herkes | Geçti | Geçti | Geçti | Geçti | Ana sayfaya yönlenir |

## Pencere, çekmece ve alt sayfa akışları

| Akış | Yüzey | Sonuç |
|---|---|---|
| Yeni şantiye (＋), plan sınırında | Her ikisi | Geçti; sınır mesajı telefonda okunmuyordu → D-22 |
| Mesaj gönder / düzelt / sil (onaylı) | Her ikisi | Geçti; telefonda çift dokunuş → D-23 |
| Saha kaydı, "Sorun bildir" | Telefon | D-07 |
| Sevkiyat çıkar (çok kalemli), ayrıntı, iptal | Her ikisi | D-08, D-09, D-12, D-37, D-39 |
| Yoklama işaretleme (tek, toplu) | Her ikisi | Sunucu yarışı → D-27 |
| Görev ekle | Her ikisi | Geçti (çift tıklamada tek kayıt) |
| İş kalemi ekle, günlük giriş | Her ikisi (şef) | Geçti; D-35 |
| Yeni firma (manuel satış), kurulum bağlantısı | Masaüstü | D-13 |
| Ödeme kaydet, dönem uzat, firma düzenle | Her ikisi | D-24 (çift ödeme) |
| Firma askıya al / yeniden aç | Her ikisi | Geçti; kilit ekranı doğru |
| Oturum kullanım sırasında düşer | Her ikisi | D-41 |
| Masaüstü ⇄ mobil görünüm geçişi | Her ikisi | Geçti |
