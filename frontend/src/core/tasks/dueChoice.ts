import dayjs from 'dayjs'

/** Sohbetteki görev penceresinin "Ne zaman?" sorusu: iki hazır cevap ve takvim. */
export type DueChoice = 'today' | 'tomorrow' | 'date'

export const DUE_CHOICES: { value: DueChoice; label: string }[] = [
  { value: 'today', label: 'Bugün' },
  { value: 'tomorrow', label: 'Yarın' },
  { value: 'date', label: 'Tarih seç' },
]

/** Seçimin tarihi, "2026-09-29". "Tarih seç"te takvimden seçilen gün; seçilmediyse termin yok. */
export function dueDateOf(
  choice: DueChoice,
  picked: string | null,
  today = dayjs(),
): string | null {
  if (choice === 'today') return today.format('YYYY-MM-DD')
  if (choice === 'tomorrow') return today.add(1, 'day').format('YYYY-MM-DD')
  return picked
}

/** "Tarih seç"te geçmiş günler kapalı: dünün işi verilmez. */
export function isPastDay(date: Date, today = dayjs()): boolean {
  return dayjs(date).isBefore(today, 'day')
}
