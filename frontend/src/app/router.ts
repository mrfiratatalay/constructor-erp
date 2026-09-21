import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export function createAppRouter(routes: RouteRecordRaw[]) {
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })
}
