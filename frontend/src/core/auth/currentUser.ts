import { useQuery, type QueryClient } from '@tanstack/vue-query'
import { isUnauthorized } from '@/core/api/errors'
import { getCurrentUser, getGetCurrentUserQueryKey } from '@/core/api/generated/auth/auth'
import type { CurrentUserResponse } from '@/core/api/generated/model'

/** Tek tanım: route guard (bileşen dışı) ve bileşenler aynı sorguyu, aynı önbelleği kullanır. */
const currentUserQuery = {
  queryKey: getGetCurrentUserQueryKey(),
  queryFn: ({ signal }: { signal: AbortSignal }) => getCurrentUser(undefined, signal),
  staleTime: 60_000,
}

/** Oturum yoksa null döner. Route guard her sayfa geçişinde çağırır; bir dakika önbellekten gelir. */
export async function loadCurrentUser(queryClient: QueryClient): Promise<CurrentUserResponse | null> {
  try {
    return await queryClient.fetchQuery(currentUserQuery)
  } catch (error) {
    if (isUnauthorized(error)) return null
    throw error
  }
}

/** Bileşenler için: guard zaten yüklediği için çoğunlukla önbellekten anında gelir. */
export function useCurrentUser() {
  return useQuery(currentUserQuery)
}
