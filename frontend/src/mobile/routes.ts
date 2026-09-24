import { buildRoutes } from '@/core/navigation/routeTable'

export const routes = buildRoutes({
  login: () => import('./pages/LoginPage.vue'),
  invite: () => import('./pages/InviteAcceptPage.vue'),
  siteJoin: () => import('./pages/SiteJoinPage.vue'),
  sites: () => import('./pages/SitesPage.vue'),
  siteFeed: () => import('./pages/SiteFeedPage.vue'),
  siteTasks: () => import('./pages/SiteTasksPage.vue'),
  // Yoklamanın mobil ekranları sonraki commit'lerde gelir; o zamana kadar bu adresler Şantiyeler'e yönlenir.
  attendance: { redirectTo: 'sites' },
  siteAttendance: { redirectTo: 'sites' },
  workerAttendance: { redirectTo: 'sites' },
  profile: () => import('./pages/ProfilePage.vue'),
})
