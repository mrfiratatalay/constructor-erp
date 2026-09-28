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
  login: { path: '/giris', meta: { public: true, guestOnly: true, title: 'Giriş' } },
  invite: { path: '/davet/:token', meta: { public: true, title: 'Davet' } },
  // Firmaya katılma bağlantısı: tıklayan adını ve numarasını yazıp katılır; zaten içerideyse listeye gider.
  join: { path: '/katil/:token', meta: { public: true, title: 'Katıl' } },
  sites: { path: '/santiyeler', meta: { title: 'Şantiyeler' } },
  siteFeed: { path: '/santiyeler/:siteId', meta: { detail: true, title: 'Şantiye' } },
  // Şantiyenin Saha sekmesi (günlük); Sohbet ile aynı sayfadır, yalnızca sekme değişir.
  siteField: { path: '/santiyeler/:siteId/saha', meta: { detail: true, title: 'Saha' } },
  // Şantiyenin İmalat sekmesi; Sohbet ve Saha ile aynı sayfadır. Çalışan göremez (sekmesi de yoktur).
  siteProduction: {
    path: '/santiyeler/:siteId/imalat',
    meta: { detail: true, productionOnly: true, title: 'İmalat' },
  },
  siteTasks: { path: '/santiyeler/:siteId/gorevler', meta: { detail: true, title: 'Görevler' } },
  // Yoklama firmanındır, şantiyenin değil: şef her sabah alır, patron ay sonunda puantajı görür. Sekme ve ay
  // adreste durur (?sekme=puantaj&ay=2026-09). Kişi ya da ekibin ayı: telefonda ayrı sayfa, masaüstünde sağdan panel.
  attendance: { path: '/yoklama', meta: { rollCallOnly: true, title: 'Yoklama' } },
  memberAttendance: {
    path: '/yoklama/kisi/:entryId',
    meta: { rollCallOnly: true, detail: true, title: 'Yoklama' },
  },
  // Çalışanın kendi ayı: kaydını o gün görür, yanlışsa işaretleyeni arar. Patron ve şef yoklamada sayılmaz.
  myPuantaj: { path: '/puantajim', meta: { workerOnly: true, title: 'Puantajım' } },
  profile: { path: '/ben', meta: { title: 'Hesabım' } },
} as const satisfies Record<string, { path: string; meta: RouteMeta }>

export type RouteName = keyof typeof ROUTES
export type PageSet = Record<RouteName, PageLoader | Elsewhere>

/** Kök adres hiç görüntülenmez; guard kullanıcıyı rolüne göre kendi ana sayfasına gönderir. */
const HOME_PLACEHOLDER: RouteComponent = { render: () => null }

function routeOf(name: RouteName, page: PageLoader | Elsewhere): RouteRecordRaw {
  const { path, meta } = ROUTES[name]
  if ('redirectTo' in page) return { name, path, meta, redirect: { name: page.redirectTo } }
  return { name, path, meta, component: page }
}

export function buildRoutes(pages: PageSet): RouteRecordRaw[] {
  return [
    { path: '/', name: 'home', meta: { resolveHome: true }, component: HOME_PLACEHOLDER },
    ...(Object.keys(ROUTES) as RouteName[]).map((name) => routeOf(name, pages[name])),
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ]
}
