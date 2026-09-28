import { keepPreviousData } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import {
  useGetMaterialSummary,
  useListMaterialMovements,
} from '@/core/api/generated/materials/materials'
import type { ListMaterialMovementsParams, MovementTypeCounts } from '@/core/api/generated/model'
import type { MovementType } from '@/core/materials/materialLabels'

const NO_COUNTS: MovementTypeCounts = {
  all: 0,
  inbound: 0,
  toSite: 0,
  used: 0,
  transfer: 0,
  outbound: 0,
  returns: 0,
  adjustment: 0,
}

const COUNT_OF: Record<MovementType, keyof MovementTypeCounts> = {
  INBOUND: 'inbound',
  TO_SITE: 'toSite',
  USED: 'used',
  TRANSFER: 'transfer',
  OUTBOUND: 'outbound',
  RETURN: 'returns',
  ADJUSTMENT: 'adjustment',
}

/**
 * Hareket tablosunun verisi, sunucuda süzülmüş ve sayfalanmış. Süzgeç değişirken önceki sayfa ekranda kalır, yenisi
 * gelince yer değiştirir (tablo boşalıp dolmaz); ilk yüklemede iskelet gösterilir.
 */
export function useMovementList(params: MaybeRefOrGetter<ListMaterialMovementsParams>) {
  const { data, isPending, isFetching, error, refetch } = useListMaterialMovements(
    () => toValue(params),
    {
      query: { placeholderData: keepPreviousData },
    },
  )
  const counts = computed(() => data.value?.counts ?? NO_COUNTS)
  return {
    rows: computed(() => data.value?.items ?? []),
    total: computed(() => data.value?.total ?? 0),
    counts,
    countOf: (type: MovementType | null) =>
      type ? counts.value[COUNT_OF[type]] : counts.value.all,
    isPending,
    isFetching,
    error,
    refetch,
  }
}

/** Özet kartları: kalem, bu ayın gönderimleri, dışarı verilenler, beklenen iadeler. */
export function useMaterialSummary() {
  const { data, isPending, error } = useGetMaterialSummary()
  return { summary: data, isPending, error }
}
