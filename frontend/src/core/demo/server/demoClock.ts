/**
 * Demo verisinin saati. Örnek kayıtlar sabit bir tarihe değil bugüne göre yazılır ("dün 09:15"): demo hangi gün
 * açılırsa açılsın şantiyeler canlı görünür. Türkiye 2016'dan beri yaz saati uygulamıyor, saat dilimi sabit UTC+3.
 */
const ZONE = 'Europe/Istanbul'
const OFFSET = '+03:00'
const DAY_MS = 86_400_000

const dayFormat = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit' })

/** Bir anın İstanbul'daki günü: '2026-11-03'. */
export function dayOf(instant: Date | string): string {
  return dayFormat.format(new Date(instant))
}

export const today = () => dayOf(new Date())

export const nowIso = () => new Date().toISOString()

/** '2026-11-03' + (-2) → '2026-11-01'. */
export function addDays(day: string, delta: number): string {
  return new Date(Date.parse(`${day}T12:00:00Z`) + delta * DAY_MS).toISOString().slice(0, 10)
}

/** Bugüne göre gün ve saat: at(-1, '09:15') → dünün 09:15'i (İstanbul), ISO biçiminde. */
export function at(dayDelta: number, time: string): string {
  return new Date(`${addDays(today(), dayDelta)}T${time}:00${OFFSET}`).toISOString()
}

export const isPast = (instant: string) => Date.parse(instant) <= Date.now()

/** İki gün arasındaki fark (gün): daysBetween('2026-11-01', '2026-11-03') → 2. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / DAY_MS)
}

/** '2026-11' → ['2026-11-01', '2026-11-30']. */
export function monthRange(month: string): [string, string] {
  const first = `${month}-01`
  const nextMonth = new Date(Date.parse(`${first}T12:00:00Z`))
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1)
  return [first, addDays(nextMonth.toISOString().slice(0, 10), -1)]
}

/** from ile to arasındaki günler, ikisi dahil. */
export function daysFrom(from: string, to: string): string[] {
  const count = daysBetween(from, to)
  return Array.from({ length: Math.max(count + 1, 0) }, (_, index) => addDays(from, index))
}
