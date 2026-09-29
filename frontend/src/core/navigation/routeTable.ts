import type { RouteComponent, RouteMeta, RouteRecordRaw } from 'vue-router'

type PageLoader = () => Promise<RouteComponent | { default: RouteComponent }>

/** Bir kabukta karşılığı olmayan adres başka bir adrese yönlenir (ör. masaüstünde Hesabım bir paneldir). */
interface Elsewhere {
  redirectTo: RouteName
}

/**
 * Uygulamanın bütün adresleri tek yerde. İki kabuk (mobil, masaüstü) aynı tabloyu kullanır;
 * her kabuk her adres için bir sayfa ya da bir yönlendirme vermek zorundadır, eksik adres derleme hatasıdır.
 */
export const ROUTES = {
  // Constructor ERP'nin tanıtım sitesi. Kök adres: oturumu açık olan kendi ana sayfasına gider, olmayan ürünü görür.
  landing: { path: '/', meta: { public: true, marketing: true, resolveHome: true, title: 'Constructor ERP' } },
  pricing: { path: '/fiyatlar', meta: { public: true, marketing: true, title: 'Fiyatlar' } },
  // POS yok: "Paketi seç" buraya gelir (?paket=professional); başvuru platform yönetiminde karşılanır.
  apply: { path: '/basvuru', meta: { public: true, marketing: true, title: 'Başvuru' } },
  login: { path: '/giris', meta: { public: true, guestOnly: true, title: 'Giriş' } },
  invite: { path: '/davet/:token', meta: { public: true, title: 'Davet' } },
  // Firmaya katılma bağlantısı: tıklayan adını ve numarasını yazıp katılır; zaten içerideyse listeye gider.
  join: { path: '/katil/:token', meta: { public: true, title: 'Katıl' } },
  // Satın alan firmanın kurulum sihirbazı: platformun gönderdiği tek kullanımlık link.
  setup: { path: '/kurulum/:token', meta: { public: true, title: 'Kurulum' } },
  sites: { path: '/santiyeler', meta: { title: 'Şantiyeler' } },
  siteFeed: { path: '/santiyeler/:siteId', meta: { detail: true, title: 'Şantiye' } },
  // Şantiyenin Saha sekmesi (günlük); Sohbet ile aynı sayfadır, yalnızca sekme değişir.
  siteField: { path: '/santiyeler/:siteId/saha', meta: { detail: true, title: 'Saha' } },
  // Şantiyenin İmalat sekmesi; Sohbet ve Saha ile aynı sayfadır. Çalışan göremez (sekmesi de yoktur).
  siteProduction: {
    path: '/santiyeler/:siteId/ilerleme',
    meta: { detail: true, permission: 'VIEW_PRODUCTION', feature: 'production', title: 'İlerleme' },
  },
  siteTasks: { path: '/santiyeler/:siteId/gorevler', meta: { detail: true, feature: 'tasks', title: 'Görevler' } },
  // Yoklama firmanındır, şantiyenin değil: şef her sabah alır, patron ay sonunda puantajı görür. Sekme ve ay
  // adreste durur (?sekme=puantaj&ay=2026-09). Kişi ya da ekibin ayı: telefonda ayrı sayfa, masaüstünde sağdan panel.
  attendance: { path: '/yoklama', meta: { rollCallOnly: true, feature: 'attendance', title: 'Yoklama' } },
  memberAttendance: {
    path: '/yoklama/kisi/:entryId',
    meta: { rollCallOnly: true, feature: 'attendance', detail: true, title: 'Yoklama' },
  },
  // Çalışanın kendi ayı: kaydını o gün görür, yanlışsa işaretleyeni arar. Patron ve şef yoklamada sayılmaz.
  myPuantaj: { path: '/puantajim', meta: { workerOnly: true, feature: 'attendance', title: 'Puantajım' } },
  // Malzemeler firmanındır, şantiyenin değil: hareketler ve stok aynı sayfada sekmedir (?sekme=stok). Süzgeçler ve
  // açık hareket adreste durur (?tur=TO_SITE&hareket=…): Saha kartı hareketin ayrıntısına buradan bağlanır.
  materials: {
    path: '/malzemeler',
    meta: { permission: 'VIEW_MATERIALS', feature: 'materials', title: 'Malzemeler' },
  },
  // Firmanın kimliği (ad, logo, iletişim) ve aboneliği: patronun.
  company: { path: '/firma', meta: { ownerOnly: true, title: 'Firma' } },
  profile: { path: '/ben', meta: { title: 'Hesabım' } },
  workspaceLocked: { path: '/erisim', meta: { lockedOnly: true, title: 'Erişim kapalı' } },
  // Constructor ERP platform yönetimi (süper yönetici): firmalar, abonelikler, ödemeler, başvurular.
  platformDashboard: { path: '/platform-admin', meta: { platform: true, title: 'Platform' } },
  platformTenants: { path: '/platform-admin/firmalar', meta: { platform: true, title: 'Firmalar' } },
  platformTenant: {
    path: '/platform-admin/firmalar/:companyId',
    meta: { platform: true, detail: true, title: 'Firma' },
  },
  platformLeads: { path: '/platform-admin/basvurular', meta: { platform: true, title: 'Başvurular' } },
  platformPlans: { path: '/platform-admin/paketler', meta: { platform: true, title: 'Paketler' } },
  platformAudit: { path: '/platform-admin/islem-gecmisi', meta: { platform: true, title: 'İşlem geçmişi' } },
} as const satisfies Record<string, { path: string; meta: RouteMeta }>

export type RouteName = keyof typeof ROUTES
export type PageSet = Record<RouteName, PageLoader | Elsewhere>

function routeOf(name: RouteName, page: PageLoader | Elsewhere): RouteRecordRaw {
  const { path, meta } = ROUTES[name]
  if ('redirectTo' in page) return { name, path, meta, redirect: { name: page.redirectTo } }
  return { name, path, meta, component: page }
}

export function buildRoutes(pages: PageSet): RouteRecordRaw[] {
  return [
    ...(Object.keys(ROUTES) as RouteName[]).map((name) => routeOf(name, pages[name])),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ]
}
