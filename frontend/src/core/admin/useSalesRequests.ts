import { computed, ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useFollowSalesRequest, useListSalesRequests } from '@/core/api/generated/platform/platform'
import type { FollowSalesRequestStatus } from '@/core/api/generated/model'
import { refreshAdminLists } from '@/core/admin/adminCache'

export type SalesRequestFilter = 'open' | 'all' | FollowSalesRequestStatus

/**
 * Tanıtım sitesinden gelen başvurular. Varsayılan görünüm "açık" olanlardır (yeni ve arananlar): ekibin iş listesi.
 * Kazanılan başvuru firmaya bağlanır (firma açılırken seçilir).
 */
export function useSalesRequests() {
  const queryClient = useQueryClient()
  const { data, isPending } = useListSalesRequests()
  const filter = ref<SalesRequestFilter>('open')
  const follow = useFollowSalesRequest({ mutation: { onSuccess: () => refreshAdminLists(queryClient) } })
  const requests = computed(() =>
    (data.value ?? []).filter((request) => {
      if (filter.value === 'all') return true
      if (filter.value === 'open') return request.status === 'NEW' || request.status === 'CONTACTED'
      return request.status === filter.value
    }),
  )
  return {
    requests,
    filter,
    isPending,
    follow: (requestId: string, status: FollowSalesRequestStatus, notes: string | null) =>
      follow.mutateAsync({ requestId, data: { status, notes } }),
  }
}
