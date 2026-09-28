import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import {
  useCreateDepot,
  useCreateMaterial,
  useUpdateMaterial,
} from '@/core/api/generated/materials/materials'
import type { MaterialRequest } from '@/core/api/generated/model'
import { refreshMaterials } from '@/core/materials/refreshMaterials'

/** Malzeme kartları ve depolar: eklemek, düzeltmek, pasifleştirmek (kart silinmez). */
export function useMaterialCatalog() {
  const queryClient = useQueryClient()
  const mutation = { onSuccess: () => refreshMaterials(queryClient) }
  const create = useCreateMaterial({ mutation })
  const update = useUpdateMaterial({ mutation })
  const depot = useCreateDepot({ mutation })
  return {
    create: (data: MaterialRequest) => create.mutateAsync({ data }),
    update: (materialId: string, data: MaterialRequest) => update.mutateAsync({ materialId, data }),
    createDepot: (name: string) => depot.mutateAsync({ data: { name } }),
    isSaving: computed(
      () => create.isPending.value || update.isPending.value || depot.isPending.value,
    ),
  }
}
