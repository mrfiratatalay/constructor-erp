import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useGetMaterialOverview } from '@/core/api/generated/materials/materials'
import { useMovementList } from '@/core/materials/useMovementList'

const RECENT = 8

/**
 * Malzeme detayı: kart, stok, beklenen iadeler ve belgeler; altında bu malzemenin son hareketleri (en yeni önde).
 * Özet sayılar: toplam kullanılabilir, depolarda, şantiyelerde, dışarıda (ödünç). Kimlik boşken sorgu çalışmaz.
 */
export function useMaterialOverview(materialId: MaybeRefOrGetter<string | null>) {
  const id = computed(() => toValue(materialId) ?? '')
  const { data, isPending } = useGetMaterialOverview(id, {
    query: { enabled: computed(() => !!id.value) },
  })
  const recent = useMovementList(() => ({
    materialId: id.value,
    size: RECENT,
    page: 0,
    sort: 'DAY',
    direction: 'DESC',
  }))
  const sumOf = (kind: 'DEPOT' | 'SITE') =>
    (data.value?.stock.locations ?? [])
      .filter((cell) => cell.kind === kind)
      .reduce((sum, cell) => sum + cell.quantity, 0)
  return {
    overview: data,
    isPending,
    recent: recent.rows,
    totals: computed(() => ({ depots: sumOf('DEPOT'), sites: sumOf('SITE') })),
  }
}
