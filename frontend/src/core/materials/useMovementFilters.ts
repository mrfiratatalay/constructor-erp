import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { rangeOf, type DatePreset, type DateRange } from '@/core/materials/dateRanges'
import {
  DEFAULT_PRESET,
  filtersOf,
  paramsOf,
  queryOf,
  type MovementFilters,
} from '@/core/materials/movementQuery'

export const PAGE_SIZE = 20

/**
 * Hareket listesinin süzgeçleri adreste durur (?tur=TO_SITE&tarih=buay&ara=çimento): geri tuşu, yenileme ve
 * paylaşılan bağlantı aynı listeyi açar. Bir süzgeç değişince liste ilk sayfaya döner; sayfa ve sıralama değişince
 * süzgeçler yerinde kalır.
 */
export function useMovementFilters() {
  const route = useRoute()
  const router = useRouter()
  const filters = computed(() => filtersOf(route.query))
  const params = computed(() => paramsOf(filters.value, PAGE_SIZE))

  const write = (next: MovementFilters) => router.replace({ query: queryOf(next, route.query) })
  const update = (change: Partial<MovementFilters>) =>
    write({ ...filters.value, page: 0, ...change })
  const setPage = (page: number) => write({ ...filters.value, page })
  const setDates = (preset: DatePreset, custom?: DateRange) =>
    update({ preset, ...rangeOf(preset, custom) })

  /** Tarih dışındaki süzgeçler ve arama; "Filtreleri temizle" hepsini varsayılana döndürür. */
  const hasActive = computed(() => {
    const current = filters.value
    const picked = [
      current.type,
      current.locationId,
      current.materialId,
      current.partyId,
      current.status,
    ]
    return (
      picked.some(Boolean) || !!current.category || !!current.q || current.preset !== DEFAULT_PRESET
    )
  })

  const clear = () => write(filtersOf({}))

  return { filters, params, update, setPage, setDates, hasActive, clear }
}
