import type { QueryClient } from '@tanstack/vue-query'
import {
  getGetPlatformDashboardQueryKey,
  getListPlansQueryKey,
  getListPlatformAuditQueryKey,
  getListSalesRequestsQueryKey,
  getListTenantsQueryKey,
} from '@/core/api/generated/platform/platform'

/** Bir platform işleminden sonra özet, firma listesi, başvurular, paketler ve işlem geçmişi yeniden okunur. */
export function refreshAdminLists(queryClient: QueryClient) {
  return Promise.all(
    [getListTenantsQueryKey(), getGetPlatformDashboardQueryKey(), getListSalesRequestsQueryKey(), getListPlansQueryKey()]
      .map((queryKey) => queryClient.invalidateQueries({ queryKey }))
      .concat(queryClient.invalidateQueries({ queryKey: getListPlatformAuditQueryKey().slice(0, 3) })),
  )
}
