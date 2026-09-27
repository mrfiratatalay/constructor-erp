import { computed, ref, type Ref } from 'vue'
import { matchesQuery, type PuantajBook, type PuantajRow } from '@/core/puantaj/puantajBook'
import type { DayStatus } from '@/core/puantaj/puantajLabels'

/** Bir satırın o günkü durumu; işaretlenmemişse "UNMARKED". Renk açıklaması çipleri bununla süzer. */
export type StatusKey = DayStatus | 'UNMARKED'

export const statusKeyOf = (row: PuantajRow, day: string): StatusKey => row.marks[day]?.status ?? 'UNMARKED'

/**
 * Bugünün listesini süzmek: arama (ad, görev, ekip başı) ve renk açıklaması çipleri (ör. yalnızca işaretlenmeyenler).
 * Hiç çip seçili değilse herkes görünür.
 */
export function useRowFilter(book: Ref<PuantajBook>, day: string) {
  const query = ref('')
  const statuses = ref<StatusKey[]>([])
  const keep = (row: PuantajRow) =>
    matchesQuery(row.entry, query.value) &&
    (statuses.value.length === 0 || statuses.value.includes(statusKeyOf(row, day)))
  const toggle = (key: StatusKey) => {
    statuses.value = statuses.value.includes(key)
      ? statuses.value.filter((selected) => selected !== key)
      : [...statuses.value, key]
  }
  return {
    query,
    statuses,
    toggle,
    filtered: computed<PuantajBook>(() => ({
      people: book.value.people.filter(keep),
      crews: book.value.crews.filter(keep),
    })),
  }
}
