import { buildRoutes } from '@/core/navigation/routeTable'

export const routes = buildRoutes({
  login: () => import('./pages/LoginPage.vue'),
  invite: () => import('./pages/InviteAcceptPage.vue'),
  today: () => import('./pages/TodayPage.vue'),
  feed: () => import('./pages/FeedPage.vue'),
  issues: () => import('./pages/IssuesPage.vue'),
  sites: () => import('./pages/SitesPage.vue'),
  siteFeed: () => import('./pages/SiteFeedPage.vue'),
  compose: () => import('./pages/ComposePage.vue'),
  team: () => import('./pages/TeamPage.vue'),
  profile: () => import('./pages/ProfilePage.vue'),
})
