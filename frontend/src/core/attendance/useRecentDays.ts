import { computed, ref } from 'vue'
import { useGetDailyAttendance, useGetRecentAttendanceDays } from '@/core/api/generated/attendance/attendance'
import { recordedRoll } from '@/core/attendance/dailyRoll'

/**
 * Yoklama ekranının Geçmiş'i: son günler (bütün şantiyeler, gün gün toplam) ve açılan günün listesi. Güne
 * dokununca liste aynı ekranda açılır, tekrar dokununca kapanır; aynı anda tek gün açıktır. Açılan günün listesi
 * yalnızca o an çekilir.
 */
export function useRecentDays() {
  const { data, isLoading } = useGetRecentAttendanceDays()
  const openDay = ref<string | null>(null)
  const detail = useGetDailyAttendance(() => openDay.value ?? '', {
    query: { enabled: computed(() => openDay.value !== null) },
  })

  return {
    days: computed(() => data.value ?? []),
    isLoading,
    openDay,
    openRows: computed(() => recordedRoll(detail.data.value ?? [])),
    isOpening: computed(() => openDay.value !== null && detail.isPending.value),
    toggle: (day: string) => {
      openDay.value = openDay.value === day ? null : day
    },
  }
}
