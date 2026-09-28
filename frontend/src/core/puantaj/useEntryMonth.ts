import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { rowTotals } from '@/core/puantaj/puantajBook'
import { useMonthPuantaj } from '@/core/puantaj/useMonthPuantaj'

/**
 * Bir kişinin ya da ekibin ayı (listede adına dokununca): takvim, toplamlar ve günün ayrıntısı. Ayın cetveliyle
 * aynı sorguyu kullanır; ay değişince ikisi birlikte değişir.
 */
export function useEntryMonth(entryId: MaybeRefOrGetter<string | null>) {
  const month = useMonthPuantaj()
  const row = computed(() => {
    const id = toValue(entryId)
    return [...month.book.value.people, ...month.book.value.crews].find((candidate) => candidate.entry.id === id)
  })
  return { ...month, row, totals: computed(() => (row.value ? rowTotals(row.value) : null)) }
}
