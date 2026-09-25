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
  attendance: () => import('./pages/AttendancePage.vue'),
  siteAttendance: () => import('./pages/SiteAttendancePage.vue'),
  // Kişinin geçmişi sonraki commit'te gelir; o zamana kadar bu adres Yoklama listesine yönlenir.
  workerAttendance: { redirectTo: 'attendance' },
  profile: () => import('./pages/ProfilePage.vue'),
})
