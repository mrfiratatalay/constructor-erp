import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useGetMemberRollCallMonth, useMarkRollCallMember } from '@/core/api/generated/roll-calls/roll-calls'
import { useMonthParam } from '@/core/attendance/useMonthParam'
import { calendarIndex } from '@/core/rollcall/memberCalendar'
import type { MarkChoice } from '@/core/rollcall/rollCallLabels'
import { refreshRollCalls } from '@/core/rollcall/rollCallQueries'
import { countsLine } from '@/core/rollcall/todayRoll'

/**
 * Kişinin takvimi (patron bir kişiye dokununca): seçili ay adreste durur (?ay=2026-09), günler renklenir, güne
 * dokununca detay. Patron o günü değiştirebilir: unutulan ya da yanlış işaretlenen gün buradan düzeltilir.
 */
export function useMemberMonth(userId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const { month, setMonth, isCurrentMonth } = useMonthParam()
  const { data, isPending, error } = useGetMemberRollCallMonth(userId, () => ({ month: month.value }))
  const mark = useMarkRollCallMember({ mutation: { onSuccess: () => refreshRollCalls(queryClient) } })
  return {
    month,
    setMonth,
    isCurrentMonth,
    member: computed(() => data.value?.member),
    days: computed(() => calendarIndex(data.value?.days ?? [])),
    summary: computed(() => (data.value ? countsLine(data.value.counts, ' gün') : '')),
    markDay: (day: string, choice: MarkChoice) =>
      mark.mutateAsync({ day, userId: toValue(userId), data: choice.request }),
    isMarking: mark.isPending,
    isPending,
    error,
  }
}
