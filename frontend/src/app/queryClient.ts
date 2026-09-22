import { QueryClient } from '@tanstack/vue-query'
import { isUnauthorized } from '@/core/api/errors'

/** Sahadaki zayıf internet için bir kez yeniden dener; oturum yoksa (401) denemenin anlamı yok. */
export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => !isUnauthorized(error) && failureCount < 1,
        refetchOnWindowFocus: true,
      },
    },
  })
}
