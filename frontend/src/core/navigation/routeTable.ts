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
  // Şantiye davet bağlantısı: oturumu olan da olmayan da açar (oturumu olan tek dokunuşla katılır).
  siteJoin: { path: '/katil/:token', meta: { public: true, title: 'Şantiyeye katıl' } },
  sites: { path: '/santiyeler', meta: { title: 'Şantiyeler' } },
  siteFeed: { path: '/santiyeler/:siteId', meta: { detail: true, title: 'Şantiye' } },
  siteTasks: { path: '/santiyeler/:siteId/gorevler', meta: { detail: true, title: 'Görevler' } },
  // Yoklama ayrı modüldür (sohbete gitmez): şantiyelerin bugünü, bir şantiyenin geçmişi, bir personelin ayı.
  attendance: { path: '/yoklama', meta: { title: 'Yoklama' } },
  siteAttendance: { path: '/yoklama/:siteId', meta: { detail: true, title: 'Yoklama' } },
  workerAttendance: { path: '/yoklama/:siteId/personel/:workerId', meta: { detail: true, title: 'Yoklama' } },
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
