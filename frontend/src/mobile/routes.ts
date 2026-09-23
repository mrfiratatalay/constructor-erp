import { buildRoutes } from '@/core/navigation/routeTable'

export const routes = buildRoutes({
  login: () => import('./pages/LoginPage.vue'),
  invite: () => import('./pages/InviteAcceptPage.vue'),
  sites: () => import('./pages/SitesPage.vue'),
  siteFeed: () => import('./pages/SiteFeedPage.vue'),
  siteTasks: () => import('./pages/SiteTasksPage.vue'),
  team: () => import('./pages/TeamPage.vue'),
  profile: () => import('./pages/ProfilePage.vue'),
})
