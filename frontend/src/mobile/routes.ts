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
  siteProduction: siteFeedPage,
  siteTasks: () => import('./pages/SiteTasksPage.vue'),
  attendance: () => import('./pages/AttendancePage.vue'),
  memberAttendance: () => import('./pages/MemberAttendancePage.vue'),
  myPuantaj: () => import('./pages/MyPuantajPage.vue'),
  profile: () => import('./pages/ProfilePage.vue'),
})
