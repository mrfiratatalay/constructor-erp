import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import {
  useCancelMovement,
  useDeliverMovement,
  useUpdateMovement,
} from '@/core/api/generated/materials/materials'
import type { MovementUpdateRequest } from '@/core/api/generated/model'
import { refreshMaterials } from '@/core/materials/refreshMaterials'

/**
 * Kaydedilmiş hareketin adımları: teslim almak, iptal etmek (nedeniyle), notlarını düzeltmek. Tablodan da ayrıntı
 * panelinden de aynı komutlar çağrılır; her adımdan sonra liste, stok ve özet birlikte tazelenir.
 */
export function useMovementCommands() {
  const queryClient = useQueryClient()
  const mutation = { onSuccess: () => refreshMaterials(queryClient) }
  const deliver = useDeliverMovement({ mutation })
  const cancel = useCancelMovement({ mutation })
  const update = useUpdateMovement({ mutation })
  return {
    deliver: (movementId: string) => deliver.mutateAsync({ movementId }),
    cancel: (movementId: string, reason: string) => cancel.mutateAsync({ movementId, data: { reason } }),
    update: (movementId: string, data: MovementUpdateRequest) => update.mutateAsync({ movementId, data }),
    isBusy: computed(() => deliver.isPending.value || cancel.isPending.value || update.isPending.value),
  }
}
