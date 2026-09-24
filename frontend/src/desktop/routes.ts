import { buildRoutes } from '@/core/navigation/routeTable'

// Liste ve seçili şantiye tek ekrandır (solda liste, sağda defter): iki adres aynı sayfayı açar,
// böylece satıra tıklayınca liste yerinde kalır, yalnızca sağ taraf değişir.
const sitesPage = () => import('./pages/SitesPage.vue')

export const routes = buildRoutes({
  login: () => import('./pages/LoginPage.vue'),
  invite: () => import('./pages/InviteAcceptPage.vue'),
  join: () => import('./pages/JoinPage.vue'),
  sites: sitesPage,
  siteFeed: sitesPage,
  siteField: sitesPage,
  siteTasks: sitesPage,
  // Masaüstünde Hesabım ayrı sayfa değil, sol alttaki kullanıcı düğmesinin açtığı paneldir.
  profile: { redirectTo: 'sites' },
})
