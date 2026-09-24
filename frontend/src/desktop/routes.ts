import { buildRoutes } from '@/core/navigation/routeTable'

// Liste ve seçili şantiye tek ekrandır (solda liste, sağda defter): iki adres aynı sayfayı açar,
// böylece satıra tıklayınca liste yerinde kalır, yalnızca sağ taraf değişir.
const sitesPage = () => import('./pages/SitesPage.vue')
// Yoklama da aynı kalıp: solda şantiyeler, sağda seçili şantiyenin geçmişi ya da bir personelin ayı.
const attendancePage = () => import('./pages/AttendancePage.vue')

export const routes = buildRoutes({
  login: () => import('./pages/LoginPage.vue'),
  invite: () => import('./pages/InviteAcceptPage.vue'),
  siteJoin: () => import('./pages/SiteJoinPage.vue'),
  sites: sitesPage,
  siteFeed: sitesPage,
  siteTasks: sitesPage,
  attendance: attendancePage,
  siteAttendance: attendancePage,
  workerAttendance: attendancePage,
  // Masaüstünde Hesabım ayrı sayfa değil, sol alttaki kullanıcı düğmesinin açtığı paneldir.
  profile: { redirectTo: 'sites' },
})
