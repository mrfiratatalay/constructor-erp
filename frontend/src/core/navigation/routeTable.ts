import type { RouteComponent, RouteMeta, RouteRecordRaw } from 'vue-router'

type PageLoader = () => Promise<RouteComponent | { default: RouteComponent }>

/**
 * Uygulamanın bütün adresleri tek yerde. İki kabuk (mobil, masaüstü) aynı tabloyu kullanır;
 * her kabuk her adres için sayfa vermek zorundadır, eksik sayfa derleme hatasıdır.
 */
export const ROUTES = {
  login: { path: '/giris', meta: { public: true, guestOnly: true, title: 'Giriş' } },
  invite: { path: '/davet/:token', meta: { public: true, title: 'Davet' } },
  today: { path: '/bugun', meta: { ownerOnly: true, title: 'Bugün' } },
  feed: { path: '/akis', meta: { title: 'Akış' } },
  issues: { path: '/sorunlar', meta: { title: 'Sorunlar' } },
  sites: { path: '/santiyeler', meta: { title: 'Şantiyeler' } },
  siteFeed: { path: '/santiyeler/:siteId', meta: { title: 'Şantiye' } },
  compose: { path: '/gonder', meta: { title: 'Gönder' } },
  team: { path: '/ekip', meta: { ownerOnly: true, title: 'Ekip' } },
  profile: { path: '/ben', meta: { title: 'Hesabım' } },
} as const satisfies Record<string, { path: string; meta: RouteMeta }>

export type RouteName = keyof typeof ROUTES
export type PageSet = Record<RouteName, PageLoader>

/** Kök adres hiç görüntülenmez; guard kullanıcıyı rolüne göre kendi ana sayfasına gönderir. */
const HOME_PLACEHOLDER: RouteComponent = { render: () => null }

export function buildRoutes(pages: PageSet): RouteRecordRaw[] {
  const pageRoutes = (Object.keys(ROUTES) as RouteName[]).map((name) => ({
    name,
    path: ROUTES[name].path,
    meta: ROUTES[name].meta,
    component: pages[name],
  }))
  return [
    { path: '/', name: 'home', meta: { resolveHome: true }, component: HOME_PLACEHOLDER },
    ...pageRoutes,
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ]
}
