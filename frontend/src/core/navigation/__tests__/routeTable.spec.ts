import { describe, expect, it } from 'vitest'
import { buildRoutes, ROUTES, type PageSet } from '@/core/navigation/routeTable'

const page = () => Promise.resolve({ render: () => null })
// Açık liste: yeni bir adres eklenince derleyici bu testi de güncellemeye zorlar.
const PAGES: PageSet = {
  login: page,
  invite: page,
  siteJoin: page,
  sites: page,
  siteFeed: page,
  siteTasks: page,
  profile: page,
}

describe('buildRoutes', () => {
  it('her adrese kabuğun verdiği sayfayı bağlar', () => {
    const routes = buildRoutes(PAGES)
    for (const name of Object.keys(ROUTES)) {
      expect(routes.find((route) => route.name === name)?.path).toBe(ROUTES[name as keyof typeof ROUTES].path)
    }
  })

  it('kökü rol yönlendirmesine, bilinmeyen adresleri köke gönderir', () => {
    const routes = buildRoutes(PAGES)
    expect(routes[0]).toMatchObject({ path: '/', meta: { resolveHome: true } })
    expect(routes[routes.length - 1]).toMatchObject({ redirect: '/' })
  })
})
