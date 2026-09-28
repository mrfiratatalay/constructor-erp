import { computed } from 'vue'
import { useCurrentUser } from '@/core/auth/currentUser'
import { todayIsoDate } from '@/core/format/dates'
import { dayCounts } from '@/core/puantaj/puantajBook'
import { canMarkDay, recentDays } from '@/core/puantaj/puantajDays'
import { usePuantajRange } from '@/core/puantaj/usePuantajRange'

/**
 * Yoklama'nın Bugün sekmesi: bugün ve önceki birkaç gün (şef dünü görerek bugünü işaretler), bugünün sayımı.
 * Son satır da işaretlenince yoklama kendiliğinden tamamdır; ayrı bir "Tamamla" düğmesi yoktur.
 */
export function useDailyPuantaj() {
  const today = todayIsoDate()
  const days = recentDays(today)
  const { data: user } = useCurrentUser()
  const { book, isEmpty, isPending, error } = usePuantajRange({ from: days[0]!, to: today })
  const counts = computed(() => dayCounts([...book.value.people, ...book.value.crews], today))
  return {
    today,
    days,
    book,
    counts,
    isComplete: computed(() => !isEmpty.value && counts.value.unmarked === 0),
    canMark: (day: string) => canMarkDay(user.value?.role, day, today),
    isEmpty,
    isPending,
    error,
  }
}
