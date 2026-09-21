import type { RouteRecordRaw } from 'vue-router'

// Yollar mobile/routes.ts ile aynıdır: paylaşılan bir link her cihazda doğru sayfayı açar.
export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'welcome', component: () => import('./pages/WelcomePage.vue') },
]
