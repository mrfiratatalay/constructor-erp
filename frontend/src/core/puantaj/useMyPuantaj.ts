import { keepPreviousData } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { MyDayView } from '@/core/api/generated/model'
import { useGetMyPuantaj } from '@/core/api/generated/puantaj/puantaj'
import { todayIsoDate } from '@/core/format/dates'
import { totalsOf } from '@/core/puantaj/puantajBook'
import { useMonthParam } from '@/core/puantaj/useMonthParam'

/**
 * Puantajım: çalışanın kendi ayı. Günler güne göre, toplamlar (yarım gün yarım sayılır), bugünün kaydı. Kaydı
 * yanlış bulan çalışan güne dokunur, işaretleyeni arar. Seçili ay adreste durur (?ay=2026-09).
 */
export function useMyPuantaj() {
  const { month, setMonth, isCurrentMonth } = useMonthParam()
  const { data, isPending, error } = useGetMyPuantaj(() => ({ month: month.value }), {
    query: { placeholderData: keepPreviousData },
  })
  const days = computed<Record<string, MyDayView>>(() =>
    Object.fromEntries((data.value?.days ?? []).map((day) => [day.day, day])),
  )
  const today = todayIsoDate()
  return {
    month,
    setMonth,
    isCurrentMonth,
    today,
    days,
    totals: computed(() => totalsOf(data.value?.days ?? [])),
    todayMark: computed(() => days.value[today]),
    counted: computed(() => data.value?.counted ?? true),
    isPending,
    error,
  }
}
