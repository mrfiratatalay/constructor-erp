import { buildRoutes } from '@/core/navigation/routeTable'

// Liste ve seçili şantiye tek ekrandır (solda liste, sağda defter): iki adres aynı sayfayı açar,
// böylece satıra tıklayınca liste yerinde kalır, yalnızca sağ taraf değişir.
const sitesPage = () => import('./pages/SitesPage.vue')
// Yoklama da aynı kalıp: solda bugünün listesi, sağda seçili kişinin takvimi.
const attendancePage = () => import('./pages/AttendancePage.vue')

export const routes = buildRoutes({
  // Aşağıdaki geçici yönlendirmeler sayfaları yazıldıkça gerçek sayfalarla değişir.
  landing: { redirectTo: 'login' },
  pricing: { redirectTo: 'login' },
  apply: { redirectTo: 'login' },
  setup: { redirectTo: 'login' },
  platformDashboard: () => import('./pages/PlatformDashboardPage.vue'),
  platformTenants: () => import('./pages/PlatformTenantsPage.vue'),
  platformTenant: () => import('./pages/PlatformTenantPage.vue'),
  platformLeads: () => import('./pages/PlatformLeadsPage.vue'),
  platformPlans: () => import('./pages/PlatformPlansPage.vue'),
  platformAudit: () => import('./pages/PlatformAuditPage.vue'),
  login: () => import('./pages/LoginPage.vue'),
  invite: () => import('./pages/InviteAcceptPage.vue'),
  join: () => import('./pages/JoinPage.vue'),
  sites: sitesPage,
  siteFeed: sitesPage,
  siteField: sitesPage,
  siteProduction: sitesPage,
  siteTasks: sitesPage,
  attendance: attendancePage,
  memberAttendance: attendancePage,
  myPuantaj: () => import('./pages/MyPuantajPage.vue'),
  materials: () => import('./pages/MaterialsPage.vue'),
  // Masaüstünde Hesabım ayrı sayfa değil, sol alttaki kullanıcı düğmesinin açtığı paneldir.
  company: () => import('./pages/CompanyPage.vue'),
  workspaceLocked: () => import('./pages/WorkspaceLockedPage.vue'),
  profile: { redirectTo: 'sites' },
})
