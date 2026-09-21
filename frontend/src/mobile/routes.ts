import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'welcome', component: () => import('./pages/WelcomePage.vue') },
]
