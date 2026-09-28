import { useQueryClient } from '@tanstack/vue-query'
import { useAdjustStock } from '@/core/api/generated/materials/materials'
import { adjustmentRequestOf, type AdjustmentForm } from '@/core/materials/adjustmentForm'
import { refreshMaterials } from '@/core/materials/refreshMaterials'

/** Sayım düzeltmesini kaydeder; stok, liste ve özet tazelenir. Kimlik formla gelir: tekrar deneme ikinci kayıt açmaz. */
export function useStockAdjust() {
  const queryClient = useQueryClient()
  const adjust = useAdjustStock({ mutation: { onSuccess: () => refreshMaterials(queryClient) } })
  return {
    adjust: (form: AdjustmentForm) => adjust.mutateAsync({ data: adjustmentRequestOf(form) }),
    isSaving: adjust.isPending,
  }
}
