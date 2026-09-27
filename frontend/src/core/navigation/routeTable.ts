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
  siteTasks: { path: '/santiyeler/:siteId/gorevler', meta: { detail: true, title: 'Görevler' } },
  // Yoklama modülü yalnızca patronundur: bugünün listesi ve bir kişinin takvimi. Çalışanlar sohbetteki yoklama
  // mesajından katılır.
  attendance: { path: '/yoklama', meta: { ownerOnly: true, title: 'Yoklama' } },
  memberAttendance: {
    path: '/yoklama/kisi/:userId',
    meta: { ownerOnly: true, detail: true, title: 'Yoklama' },
  },
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
