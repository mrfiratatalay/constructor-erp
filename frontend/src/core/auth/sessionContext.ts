import { useQuery, type QueryClient } from '@tanstack/vue-query'
import { isUnauthorized } from '@/core/api/errors'
import { getGetSessionContextQueryKey, getSessionContext } from '@/core/api/generated/auth/auth'
import type { SessionContextView } from '@/core/api/generated/model'

/**
 * Oturumun bağlamı tek kaynaktır: kim, hangi firmalarda, şu anki firmanın markası, rolü, izinleri, açık modülleri ve
 * abonelik durumu. Route guard (bileşen dışı) ve bileşenler aynı sorguyu, aynı önbelleği kullanır.
 */
export const sessionContextQuery = {
  queryKey: getGetSessionContextQueryKey(),
  queryFn: ({ signal }: { signal: AbortSignal }) => getSessionContext(undefined, signal),
  staleTime: 60_000,
}

/** Oturum yoksa null. Guard her sayfa geçişinde çağırır; bir dakika önbellekten gelir. */
export async function loadSessionContext(queryClient: QueryClient): Promise<SessionContextView | null> {
  try {
    return await queryClient.fetchQuery(sessionContextQuery)
  } catch (error) {
    if (isUnauthorized(error)) return null
    throw error
  }
}

export function useSessionContext() {
  return useQuery(sessionContextQuery)
}

/** Giriş, kurulum ya da firma değişince sunucunun döndürdüğü bağlam önbelleğe yazılır; ikinci istek atılmaz. */
export function rememberSessionContext(queryClient: QueryClient, context: SessionContextView) {
  queryClient.setQueryData(sessionContextQuery.queryKey, context)
}
