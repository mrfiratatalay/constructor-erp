import type { QueryClient } from '@tanstack/vue-query'
import type { Router } from 'vue-router'
import { http } from '@/core/api/http'
import { isUnauthorized } from '@/core/api/errors'
import { getGetCurrentUserQueryKey } from '@/core/api/generated/auth/auth'
import { loadCurrentUser } from '@/core/auth/currentUser'
import { homeRouteFor } from '@/core/auth/homeRoute'
import { roleAllows } from '@/core/team/roles'

/** Her sayfa geçişinde: oturum var mı, bu sayfaya yetkisi var mı? */
export function installAuthGuard(router: Router, queryClient: QueryClient) {
  router.beforeEach(async (to) => {
    if (to.meta.public && !to.meta.guestOnly) return true
    const user = await loadCurrentUser(queryClient)
    if (to.meta.guestOnly) return user ? { name: homeRouteFor(user.role) } : true
    if (!user) return { name: 'login', query: to.name === 'home' ? {} : { next: to.fullPath } }
    if (to.meta.resolveHome || !roleAllows(to.meta, user.role)) {
      return { name: homeRouteFor(user.role) }
    }
    return true
  })
}

/**
 * Oturum başka bir yerde kapatılırsa (ör. patron kişiyi pasif yaptı) kullanıcı giriş sayfasına düşer.
 * Yalnızca "giriş yapmış olduğunu bildiğimiz" kullanıcı için: açılıştaki oturum yoklamasının 401'i
 * beklenen bir cevaptır ve guard'a aittir; burada önbelleği temizlemek o yoklamayı iptal ederdi.
 */
export function installSessionExpiry(router: Router, queryClient: QueryClient) {
  http.interceptors.response.use(undefined, async (error: unknown) => {
    const wasSignedIn = queryClient.getQueryData(getGetCurrentUserQueryKey()) !== undefined
    if (isUnauthorized(error) && wasSignedIn) {
      queryClient.clear()
      await router.replace({ name: 'login' })
    }
    return Promise.reject(error)
  })
}
