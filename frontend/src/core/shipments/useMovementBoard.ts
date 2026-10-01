import { computed, reactive, ref, watch } from 'vue'
import { todayIsoDate } from '@/core/format/dates'
import { EMPTY_MOVEMENT_FILTER, matchesMovement, movementPoints } from '@/core/shipments/movementFilters'
import { movementSummary } from '@/core/shipments/movementSummary'
import { shipmentExportUrl } from '@/core/shipments/shipmentExport'
import { useShipments } from '@/core/shipments/useShipments'

function useMovementSearch() {
  const search = ref('')
  const settled = ref('')
  watch(search, (value, _, cleanup) => {
    const timer = setTimeout(() => { settled.value = value.trim() }, 250)
    cleanup(() => clearTimeout(timer))
  })
  return { search, settled }
}

function useMovementPaging(count: () => number) {
  const page = ref(1)
  const pageSize = ref(10)
  watch(count, (size) => { page.value = Math.min(page.value, Math.max(1, Math.ceil(size / pageSize.value))) })
  return { page, pageSize }
}

/** Özetler aramadan etkilenmez; tablo ve Excel aynı süzgeçleri kullanır. */
export function useMovementBoard() {
  const { search, settled } = useMovementSearch()
  const all = useShipments('')
  const results = useShipments(settled)
  const filter = reactive({ ...EMPTY_MOVEMENT_FILTER })
  const rows = computed(() => results.shipments.value.filter((row) => matchesMovement(row, filter)))
  const { page, pageSize } = useMovementPaging(() => rows.value.length)
  watch([search, () => JSON.stringify(filter), pageSize], () => { page.value = 1 })
  const clear = () => { search.value = ''; Object.assign(filter, EMPTY_MOVEMENT_FILTER) }
  return {
    search, filter, rows, page, pageSize, clear,
    summary: computed(() => movementSummary(all.shipments.value, todayIsoDate())),
    summaryLoading: all.isLoading,
    summaryError: all.isError,
    points: computed(() => movementPoints(all.shipments.value)),
    shown: computed(() => rows.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)),
    isLoading: computed(() => all.isLoading.value || results.isLoading.value || search.value.trim() !== settled.value),
    isError: computed(() => all.isError.value || results.isError.value),
    retry: () => Promise.all([all.refetch(), results.refetch()]),
    hasFilters: computed(() => !!search.value || JSON.stringify(filter) !== JSON.stringify(EMPTY_MOVEMENT_FILTER)),
    exportUrl: computed(() => shipmentExportUrl(search.value, filter)),
  }
}
