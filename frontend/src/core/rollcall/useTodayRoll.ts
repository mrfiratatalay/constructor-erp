import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import {
  useGetRollCallDay,
  useMarkRollCallMember,
} from '@/core/api/generated/roll-calls/roll-calls'
import { todayIsoDate } from '@/core/format/dates'
import type { MarkChoice } from '@/core/rollcall/rollCallLabels'
import { refreshRollCalls } from '@/core/rollcall/rollCallQueries'
import { countsLine, rollSections } from '@/core/rollcall/todayRoll'

/**
 * Patronun Yoklama ekranı: bugünün listesi, bölümleri ve özet satırı; katılmayanı işaretlemek. Menüden girince
 * doğrudan bugün açılır, önce şantiye seçilmez.
 */
export function useTodayRoll() {
  const queryClient = useQueryClient()
  const day = todayIsoDate()
  const { data: roll, isPending, error } = useGetRollCallDay(day)
  const mark = useMarkRollCallMember({
    mutation: { onSuccess: () => refreshRollCalls(queryClient) },
  })
  return {
    day,
    sections: computed(() => rollSections(roll.value?.members ?? [])),
    summary: computed(() => (roll.value ? countsLine(roll.value.counts) : '')),
    isEmpty: computed(() => roll.value?.members.length === 0),
    mark: (memberId: string, choice: MarkChoice) =>
      mark.mutateAsync({ day, userId: memberId, data: choice.request }),
    isMarking: mark.isPending,
    isPending,
    error,
  }
}
