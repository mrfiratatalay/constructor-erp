import { computed, ref, watch, type Ref } from 'vue'
import { isoDayOf, monthKey } from '@/core/format/dates'
import { monthRange } from '@/core/puantaj/puantajDays'

/**
 * Masaüstü takviminde seçili gün. Takvim kendi düğmeleriyle ay değiştirince seçili ay adrese de yazılır
 * (?ay=2026-09): cetvel ve takvim aynı ayda kalır. Gelecek aya geçilmez. Ay dışarıdan değişirse (ör. cetveldeki
 * ay seçici) o ayın bugünü, geçmiş ayda ilk günü seçilir.
 */
export function useCalendarDay(month: Ref<string>, setMonth: (next: string) => unknown, today: string) {
  const firstShown = () => (month.value === monthKey(today) ? today : monthRange(month.value).from)
  const selectedDay = ref(firstShown())
  watch(month, (next) => monthKey(selectedDay.value) !== next && (selectedDay.value = firstShown()))

  const calendarDate = computed({
    get: () => new Date(`${selectedDay.value}T00:00:00`),
    set: (date: Date) => {
      const day = isoDayOf(date)
      if (monthKey(day) > monthKey(today)) return
      selectedDay.value = day
      if (monthKey(day) !== month.value) void setMonth(monthKey(day))
    },
  })
  /** Belirli bir günü seçmek (cetvelde tıklanan hücre, kayıtlardaki satır): ayı gerekirse onunla değişir. */
  const select = (day: string) => (calendarDate.value = new Date(`${day}T00:00:00`))
  return { selectedDay, calendarDate, select, reset: () => (selectedDay.value = firstShown()) }
}
