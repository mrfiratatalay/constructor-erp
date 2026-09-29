# Constructor ERP — Çok Kiracılı (Multi-Tenant) SaaS Mimarisi

Bu doküman, tek firmaya (Kızılkan İnşaat) yazılmış gibi çalışan uygulamanın, birden çok müteahhit firmasına satılan
**Constructor ERP** ürününe nasıl dönüştüğünü ve bundan sonra her yeni modülün uyacağı kuralları anlatır.
Kural niteliğindeki kısım (Bölüm 6) [ANAYASA.md](ANAYASA.md) Madde 9'un ayrıntısıdır.

## 1. Üç yüzey

| Yüzey | Adres | Kim görür | Marka |
|---|---|---|---|
| Tanıtım sitesi | `/`, `/fiyatlar`, `/basvuru`, `/giris` | Henüz müşteri olmayanlar | Constructor ERP |
| Firma çalışma alanı (ERP) | `/santiyeler`, `/yoklama`, `/malzemeler`, `/firma` … | Firmanın kişileri | Firmanın adı + logosu |
| Platform yönetimi | `/platform-admin/**` | Yalnızca `SUPER_ADMIN` | Constructor ERP · Platform |
| Kurulum sihirbazı | `/kurulum/:token` | Yeni satın alan firma | Constructor ERP |

## 2. Envanter (dönüşüm öncesi, FAZ 1)

- **Frontend:** Vue 3 + TS + Vite. Açılışta ekran genişliğine göre iki kabuktan biri yüklenir: `mobile/` (Vant),
  `desktop/` (Element Plus). Ortak beyin `core/`, kütüphanesiz görünüm `shared/`. Bütün adresler tek tabloda
  (`core/navigation/routeTable.ts`), API istemcisi OpenAPI'den Orval ile üretilir.
- **Backend:** Java 25, Spring Boot 4, JPA + JdbcClient, PostgreSQL, Flyway. Özellik bazlı paketler.
- **Kimlik:** HttpOnly + SameSite=Strict oturum çerezi; token'ın yalnızca SHA-256 özeti saklanır. Patron e-posta +
  şifreyle, saha ekibi firmanın katılma bağlantısıyla ya da tek kullanımlık giriş linkiyle girer.
- **Roller:** `OWNER` (patron), `SITE_LEAD` (şef), `WAREHOUSE` (depo sorumlusu), `WORKER` (çalışan). Arayüz rol
  adına değil izin anahtarlarına (`Permission`) bakar.
- **Modüller (güncel):** Şantiyeler (Sohbet, Saha, İlerleme, Görevler, bilgi/kütüphane), Yoklama + Puantaj,
  Puantajım, Malzemeler (sevkiyat defteri), Bugün özeti, bildirimler, arama, sabitleme.
- **Firmaya ait veri:** `sites`, `posts`, `media`, `tasks`, `site_workers`, `attendances`, `member_attendance`,
  `roster_entries`, `puantaj_marks`, `materials`, `stock_locations`, `material_parties`, `material_shipments`,
  `material_documents`, `production_items`, `production_entries` — hepsinde `company_id` vardı.
  Çocuk tablolar (`attendance_entries`, `material_shipment_lines`, `site_events`, `site_visits` …) firmaya
  ebeveynlerinin zorunlu FK'si üzerinden bağlıdır.
- **Firmaya kilitli olan:** `users.company_id` ve `users.role` — bir kişi yalnızca tek firmada olabiliyordu,
  platform yöneticisi diye bir kavram yoktu.
- **Sabit marka:** "Kızılkan Şantiye" adı ve "KŞ" rozeti bileşenlere, PWA manifest'ine, Excel dökümlerine gömülüydü.
- **Dosyalar:** medya kökünde `{firma}/{medya}/…`, belgeler `materials/{firma}/{belge}` — yol zaten firma sınırlı.
- **Arka plan işleri:** 18:00 patron özeti (firma firma döner), sorun bildirimi (@Async), medya dönüştürme kuyruğu.

## 3. Kararlar

1. **"Firma" (company) tenant'ın kendisidir.** Kodda her yerde `company_id` / `companyId` adıyla yaşayan sınır
   yeniden adlandırılmadı: `companies` tablosu tenant tablosudur. Arayüzde "Firma" der.
2. **Kimlik ile üyelik ayrıldı.** `users` yalnızca kimliktir (ad, telefon, e-posta, şifre, platform rolü).
   Kişinin firmadaki rolü ve durumu `company_memberships`'tedir. Bir kişi birden çok firmada olabilir; oturum
   hangi firmada çalışıldığını (`user_sessions.company_id`) taşır, sunucu her istekte üyeliği yeniden doğrular.
3. **İstemciden gelen firma kimliğine asla güvenilmez.** Firma, oturumdan sunucu tarafında çözülür; iş
   uçlarının gövdesinde firma alanı yoktur. Firma değiştirme (`POST /api/auth/workspace`) üyelik kontrolünden geçer.
4. **İzolasyon iki katmanlıdır:**
   - Uygulama: servisler `CurrentUser.companyId()` ile sorgular (başka firmanın kaydı 404).
   - Veritabanı: firmaya ait her tabloda **PostgreSQL Row-Level Security** vardır. Firma çalışma alanına gelen her
     istekte bağlantıya `app.company_id` yazılır (`TenantScopedDataSource`); bir sorgu filtreyi unutsa bile başka
     firmanın satırı dönmez. Bağlam yokken (platform yönetimi, zamanlanmış işler, açılış) kısıt uygulanmaz ve bu
     kodlar firmayı açıkça belirtir.
   - Açılışta `TenantIsolationAudit`, `company_id` kolonu olup RLS'i açık olmayan bir iş tablosu bulursa
     uygulamayı başlatmaz.
5. **Rol iki katmanlıdır.** Platform rolü (`users.platform_role = SUPER_ADMIN`) ile firma rolü
   (`company_memberships.role`) ayrı alanlardır; Super Admin patronun özel hali değildir.
6. **Abonelik gerçek bir modeldir.** `plans` → `plan_features` (modül hakları), `subscriptions` (dönemler, fiyat
   anlık görüntüsü), `payments` (elden/havale). Firma durumu (`ACTIVE`, `SUSPENDED`, `ARCHIVED`) ve geçerli bir
   aboneliği yoksa çalışma alanı kilitlenir; veri silinmez.
7. **Modül hakları genişleyebilir.** Modüller `features` tablosunda anahtarla durur; planlar bu anahtarları açar.
   Backend uçları `@RequiresFeature("materials")` ile, arayüz menüsü ve adresleri `feature` alanıyla korunur.
8. **Silme yerine yaşam döngüsü.** Firma askıya alınır ya da arşivlenir; kalıcı silme normal bir düğme değildir.
9. **Kurulum linki** yüksek entropili, tek kullanımlık, süreli; veritabanında yalnızca özeti durur, yenisi
   üretilince eskisi iptal olur.
10. **POS yok.** Tanıtım sitesi sahte ödeme göstermez; "Paketi seç" başvuru formuna gider, satış talebi platform
    yönetiminde karşılanır, ödeme elden/havale ile kaydedilir.

## 4. Bir isteğin yolculuğu

```text
Çerez (ks_session)
  → SessionService: oturum geçerli mi, kullanıcı kim?
  → Workspaces: oturumdaki firma + aktif üyelik → rol
  → WorkspaceAccess: firma ACTIVE mi, bugün geçerli bir abonelik var mı, plan hangi modülleri açıyor?
  → yetkiler: ROLE_<rol>, izinler, FEATURE_<modül>, WORKSPACE (erişim açıksa), ROLE_SUPER_ADMIN
  → TenantContextFilter: /api/** iş uçlarında TenantContext = firma (RLS bu değerle çalışır)
  → SecurityConfig: /api/platform/** → SUPER_ADMIN, /api/** iş uçları → WORKSPACE
  → FeatureInterceptor: @RequiresFeature
  → Controller → Service (companyId ile sorgu) → PostgreSQL (RLS)
```

Kilitli çalışma alanına gelen istek `403` + `code: WORKSPACE_LOCKED` döner; arayüz kilit ekranını gösterir.

## 5. Verinin sınıfları

| Sınıf | Tablolar | Firma sınırı |
|---|---|---|
| Platform | `plans`, `features`, `plan_features`, `companies`, `subscriptions`, `payments`, `tenant_onboarding_invites`, `platform_audit_logs`, `sales_requests` | Yok; yalnızca platform yönetimi yazar |
| Kimlik | `users`, `user_sessions`, `invites`, `company_memberships`, `push_subscriptions`, `notifications` | Üyelik üzerinden |
| Firmaya ait | Bölüm 2'deki liste ve bundan sonra eklenecek her iş tablosu | `company_id` + RLS |

## 6. Yeni modül eklerken (zorunlu kontrol listesi)

1. **Sahiplik:** Veri platformun mu, kişinin mi, firmanın mı? Firmanınsa kök tabloda `company_id not null
   references companies (id)` ve `(company_id, …)` indeksi.
2. **RLS:** Aynı migration'da `select enable_company_isolation('tablo');` çağrılır. Unutulursa uygulama açılmaz.
3. **Oluşturma:** `company_id` istek gövdesinden değil `CurrentUser.companyId()`'den gelir.
4. **Okuma / liste / sayım / arama:** servis sorgusu `companyId` ile süzer; başka firmanın kaydı `404` döner.
5. **Güncelleme / silme:** kayıt önce `findByIdAndCompanyId` ile bulunur.
6. **Yetki:** Rolün açtığı iş `Permission`'a eklenir, uç `@PreAuthorize("hasAuthority('…')")` ile korunur.
7. **Modül hakkı:** `features` tablosuna anahtar eklenir, uygun planlara `plan_features` satırı yazılır, controller
   `@RequiresFeature("anahtar")` taşır; arayüzde adres `meta.feature`, menü öğesi `feature` alır.
8. **Dışa aktarma / içe aktarma:** yalnızca `CurrentUser.companyId()` verisi.
9. **Dosya yolu:** medya kökünde firma klasörü altında (`{firma}/…`).
10. **Önbellek anahtarı:** firma kimliğini içerir (`workspace:{companyId}` gibi).
11. **Arka plan işi / bildirim:** firma kimliğini olaydan taşır, firma firma çalışır.
12. **Menü:** `shared/navigation/navItems.ts`'e `permission` ve `feature` ile eklenir.
13. **Platform aksiyonu:** kritikse `PlatformAudit` ile firma kimliğiyle kaydedilir.
14. **Çapraz firma denemesi:** ikinci bir firmayla aynı kaydın kimliği denenir; okunamamalı, değişmemeli.
