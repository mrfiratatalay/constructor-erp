import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useGetMaterialMovement } from '@/core/api/generated/materials/materials'

/** Hareketin ayrıntısı; kimlik boşken (panel kapalı) sorgu çalışmaz. */
export function useMovementDetail(movementId: MaybeRefOrGetter<string | null>) {
  const id = computed(() => toValue(movementId) ?? '')
  const { data, isPending, error } = useGetMaterialMovement(id, { query: { enabled: computed(() => !!id.value) } })
  return { detail: data, isPending, error }
}
