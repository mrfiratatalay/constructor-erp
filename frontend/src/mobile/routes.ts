import { buildRoutes } from '@/core/navigation/routeTable'

// Şantiyenin Sohbet ve Saha sekmeleri tek sayfadır: sekme değişince başlık ve taslaklar yerinde kalır.
const siteFeedPage = () => import('./pages/SiteFeedPage.vue')

export const routes = buildRoutes({
  login: () => import('./pages/LoginPage.vue'),
  invite: () => import('./pages/InviteAcceptPage.vue'),
  join: () => import('./pages/JoinPage.vue'),
  sites: () => import('./pages/SitesPage.vue'),
  siteFeed: siteFeedPage,
  siteField: siteFeedPage,
  siteTasks: () => import('./pages/SiteTasksPage.vue'),
  // Yoklamanın mobil ekranları sonraki commit'lerde gelir; o zamana kadar bu adresler Şantiyeler'e yönlenir.
  attendance: { redirectTo: 'sites' },
  siteAttendance: { redirectTo: 'sites' },
  workerAttendance: { redirectTo: 'sites' },
  profile: () => import('./pages/ProfilePage.vue'),
})
