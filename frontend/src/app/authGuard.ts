import type { QueryClient } from '@tanstack/vue-query'
import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router'
import { isAxiosError } from 'axios'
import { http } from '@/core/api/http'
import { isUnauthorized } from '@/core/api/errors'
import type { SessionContextView } from '@/core/api/generated/model'
import { workspaceUserOf } from '@/core/auth/currentUser'
import { homeOf } from '@/core/auth/homeRoute'
import { loadSessionContext, sessionContextQuery } from '@/core/auth/sessionContext'
import { routeAllows } from '@/core/team/roles'

const home = (context: SessionContextView): RouteLocationRaw => ({ name: homeOf(context) })

/** Oturum gerektiren sayfalar: platform yönetimi, kilit ekranı ve firmanın çalışma alanı. */
function signedInTarget(to: RouteLocationNormalized, context: SessionContextView): RouteLocationRaw | true {
  if (to.meta.platform) return context.user.platformAdmin ? true : home(context)
  const workspace = context.workspace
  if (to.meta.lockedOnly) return workspace && !workspace.access.open ? true : home(context)
  if (!workspace) return home(context)
  if (!workspace.access.open) return { name: 'workspaceLocked' }
  const viewer = { ...workspaceUserOf(context)!, features: workspace.features }
  return routeAllows(to.meta, viewer) ? true : home(context)
}

/**
 * Her sayfa geçişinde: oturum var mı, sayfa bu kişiye açık mı? Tanıtım sitesinin kökü oturumu açık olanı kendi ana
 * sayfasına gönderir. Firma sayfaları firmanın çalışma alanı açık değilse kilit ekranına düşer.
 */
export function installAuthGuard(router: Router, queryClient: QueryClient) {
  router.beforeEach(async (to) => {
    if (to.meta.public && !to.meta.guestOnly && !to.meta.resolveHome) return true
    const context = await loadSessionContext(queryClient)
    if (to.meta.resolveHome) return context ? home(context) : true
    if (to.meta.guestOnly) return context ? home(context) : true
    if (!context) return { name: 'login', query: { next: to.fullPath } }
    return signedInTarget(to, context)
  })
}

function isWorkspaceLocked(error: unknown): boolean {
  if (!isAxiosError(error) || error.response?.status !== 403) return false
  return (error.response.data as { code?: unknown } | undefined)?.code === 'WORKSPACE_LOCKED'
}

/**
 * Oturum başka bir yerde kapatılırsa (ör. patron kişiyi çıkardı) kullanıcı giriş sayfasına düşer; firmanın aboneliği
 * kullanım sırasında biterse ya da firma askıya alınırsa kilit ekranına. Yalnızca "giriş yapmış olduğunu bildiğimiz"
 * kullanıcı için: açılıştaki oturum yoklamasının 401'i beklenen bir cevaptır ve guard'a aittir.
 */
export function installSessionExpiry(router: Router, queryClient: QueryClient) {
  http.interceptors.response.use(undefined, async (error: unknown) => {
    const wasSignedIn = queryClient.getQueryData(sessionContextQuery.queryKey) !== undefined
    if (isUnauthorized(error) && wasSignedIn) {
      queryClient.clear()
      // Yeniden girişten sonra kişi bulunduğu sayfaya döner (useSignIn next'i okur), ana sayfaya değil.
      const here = router.currentRoute.value
      await router.replace({ name: 'login', query: here.meta.public ? {} : { next: here.fullPath } })
    } else if (isWorkspaceLocked(error) && wasSignedIn) {
      await queryClient.invalidateQueries({ queryKey: sessionContextQuery.queryKey })
      await router.replace({ name: 'workspaceLocked' })
    }
    return Promise.reject(error)
  })
}
