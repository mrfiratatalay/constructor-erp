import { computed, ref, type Ref } from 'vue'
import { matchesQuery, type PuantajBook, type PuantajRow } from '@/core/puantaj/puantajBook'
import { STATUS_LOOKS, UNMARKED, type DayStatus, type StatusLook } from '@/core/puantaj/puantajLabels'

/** Bir satırın o günkü durumu; işaretlenmemişse "UNMARKED". Özet kartları ve sayılar bununla süzer. */
export type StatusKey = DayStatus | 'UNMARKED'

/** Masaüstündeki tek seçimli süzgecin değeri: ya herkes ya da tek bir durum. */
export type FilterKey = StatusKey | 'ALL'

/** Süzgecin görünüşü: "İşaretlenmedi" ya da durumun kendisi (etiket, renk, şekil). */
export const lookOfKey = (key: StatusKey): StatusLook => (key === 'UNMARKED' ? UNMARKED : STATUS_LOOKS[key])

export const statusKeyOf = (row: PuantajRow, day: string): StatusKey => row.marks[day]?.status ?? 'UNMARKED'

/**
 * Bugünün listesini süzmek: arama (ad, görev, ekip başı) ve durum süzgeci (ör. yalnızca işaretlenmeyenler). Hiç
 * durum seçili değilse herkes görünür. Arama sözcüğü dışarıdan da verilebilir: masaüstünde arama sayfa başlığındadır,
 * iki sekme aynı sözcüğü kullanır.
 */
export function useRowFilter(book: Ref<PuantajBook>, day: string, query: Ref<string> = ref('')) {
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
