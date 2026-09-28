import { computed, ref } from 'vue'
import { useListMaterialStock } from '@/core/api/generated/materials/materials'
import type { StockRow, StockRowStatus } from '@/core/api/generated/model'

/** Stok süzgeçleri: malzeme adı ya da kodu, kategori, lokasyon, stok durumu. */
export interface StockFilters {
  q: string
  category: string | null
  locationId: string | null
  status: StockRowStatus | null
}

const emptyFilters = (): StockFilters => ({ q: '', category: null, locationId: null, status: null })

function matches(row: StockRow, filters: StockFilters): boolean {
  const q = filters.q.trim().toLocaleLowerCase('tr')
  const text = `${row.name} ${row.code ?? ''}`.toLocaleLowerCase('tr')
  return (
    (!q || text.includes(q)) &&
    (!filters.category || row.category === filters.category) &&
    (!filters.locationId || row.locations.some((cell) => cell.locationId === filters.locationId)) &&
    (!filters.status || row.status === filters.status)
  )
}

/**
 * Stok sekmesi: her malzemenin bugünkü durumu ve lokasyon kırılımı. Firmanın malzemesi az (onlar, yüzler): hepsi bir
 * kez gelir, süzgeçler anında tarayıcıda çalışır. Kritik ve tükenen malzeme sayısı sekmede uyarı olarak yazar.
 */
export function useStockRows() {
  const { data, isPending, error, refetch } = useListMaterialStock()
  const filters = ref<StockFilters>(emptyFilters())
  const rows = computed(() => data.value ?? [])
  return {
    rows: computed(() => rows.value.filter((row) => matches(row, filters.value))),
    all: rows,
    filters,
    clearFilters: () => (filters.value = emptyFilters()),
    hasFilters: computed(() => JSON.stringify(filters.value) !== JSON.stringify(emptyFilters())),
    warnings: computed(
      () => rows.value.filter((row) => row.active && row.status !== 'NORMAL').length,
    ),
    availableAt: (materialId: string | null, locationId: string | null) =>
      availableAt(rows.value, materialId, locationId),
    isPending,
    error,
    refetch,
  }
}

/** Bir malzemenin bir lokasyondaki kullanılabilir miktarı; seçim eksikse bilinmez (null). */
export function availableAt(
  rows: StockRow[],
  materialId: string | null,
  locationId: string | null,
): number | null {
  if (!materialId || !locationId) return null
  const row = rows.find((item) => item.materialId === materialId)
  return row?.locations.find((cell) => cell.locationId === locationId)?.quantity ?? 0
}
