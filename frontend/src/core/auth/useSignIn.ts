import { useQueryClient } from '@tanstack/vue-query'
import { useRoute, useRouter } from 'vue-router'
import { getGetCurrentUserQueryKey } from '@/core/api/generated/auth/auth'
import type { CurrentUserResponse } from '@/core/api/generated/model'
import { homeRouteFor } from '@/core/auth/homeRoute'

/** Giriş başarılı olunca: kullanıcıyı önbelleğe yazar, geldiği sayfaya ya da ana sayfasına gönderir. */
export function useSignIn() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const route = useRoute()

  return async (user: CurrentUserResponse) => {
    queryClient.setQueryData(getGetCurrentUserQueryKey(), user)
    const next = typeof route.query.next === 'string' ? route.query.next : null
    await router.replace(next ?? { name: homeRouteFor(user.role) })
  }
}
