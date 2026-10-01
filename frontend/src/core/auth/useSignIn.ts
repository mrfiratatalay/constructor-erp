import { useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import type { SessionContextView } from '@/core/api/generated/model'
import { homeOf } from '@/core/auth/homeRoute'
import { returnPath } from '@/core/auth/returnPath'
import { rememberSessionContext } from '@/core/auth/sessionContext'

/**
 * Giriş başarılı olunca: önceki kişinin önbelleği temizlenir, yeni oturumun bağlamı yazılır, kişi geldiği sayfaya
 * ya da kendi ana sayfasına gider (firması, kilit ekranı ya da platform yönetimi).
 */
export function useSignIn() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const route = useRoute()

  return async (context: SessionContextView) => {
    queryClient.clear()
    rememberSessionContext(queryClient, context)
    await router.replace(returnPath(route.query.next) ?? { name: homeOf(context) })
  }
}
