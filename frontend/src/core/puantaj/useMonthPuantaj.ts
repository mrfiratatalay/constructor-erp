import { computed } from 'vue'
import { useCurrentUser } from '@/core/auth/currentUser'
import { todayIsoDate } from '@/core/format/dates'
import { canMarkDay, isoDays, monthRange } from '@/core/puantaj/puantajDays'
import { useMonthParam } from '@/core/puantaj/useMonthParam'
import { puantajExportUrl, usePuantajRange } from '@/core/puantaj/usePuantajRange'

/**
 * Ayın puantajı: Puantaj sekmesinin cetveli ve bir kişinin ya da ekibin takvimi aynı sorguyu paylaşır. Seçili ay
 * adreste durur (?ay=2026-09); gelecek aya gidilmez. Excel yalnızca patrona: ay sonu hesabı onun işidir.
 */
export function useMonthPuantaj() {
  const { month, setMonth, isCurrentMonth } = useMonthParam()
  const { data: user } = useCurrentUser()
  const range = computed(() => monthRange(month.value))
  const { book, isEmpty, isPending, error } = usePuantajRange(range)
  const today = todayIsoDate()
  return {
    month,
    setMonth,
    isCurrentMonth,
    today,
    days: computed(() => isoDays(range.value.from, range.value.to)),
    book,
    isEmpty,
    isPending,
    error,
    canExport: computed(() => user.value?.role === 'OWNER'),
    exportUrl: computed(() => puantajExportUrl(month.value)),
    canMark: (day: string) => canMarkDay(user.value?.role, day, today),
  }
}
