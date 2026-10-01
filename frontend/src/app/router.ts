import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// Tanıtım sitesi uzun, kayan sayfalardır: menüdeki #bölüm bağlantısı o bölüme, yeni sayfa en üste açılır. Yapışkan
// üst menünün altında kalmasın diye bölüm biraz aşağıda durur. Uygulama ekranları kendi içinde kaydığı için etkilenmez.
const TOP_BAR_OFFSET = 80

export function createAppRouter(routes: RouteRecordRaw[]) {
  return createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior(to, from, saved) {
      if (saved) return saved
      if (to.hash) return { el: to.hash, top: TOP_BAR_OFFSET, behavior: 'smooth' }
      // Aynı sayfada sekme, süzgeç ya da açık ayrıntı değiştiyse kişi olduğu yerde kalır.
      return to.path === from.path ? false : { top: 0 }
    },
  })
}
