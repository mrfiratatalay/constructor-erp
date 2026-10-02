// Çekimin saati: backend.sh gerçek saatle demo saati arasındaki farkı yazar; seed ve tarayıcı aynı farkı kullanır.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const OFFSET_FILE = fileURLToPath(new URL('../../out/clock-offset.txt', import.meta.url))

export const offsetSeconds = () => Number(readFileSync(OFFSET_FILE, 'utf8').trim())

export const demoNow = () => new Date(Date.now() + offsetSeconds() * 1000)

/** İstanbul'daki takvim günü (YYYY-MM-DD). */
export function isoDay(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul' }).format(date)
}

export const demoToday = () => isoDay(demoNow())

/** Bugünden n gün önce/sonra (n negatif: geçmiş). */
export function dayOffset(n) {
  const date = new Date(`${demoToday()}T12:00:00+03:00`)
  date.setUTCDate(date.getUTCDate() + n)
  return isoDay(date)
}

export const weekday = (iso) => new Date(`${iso}T12:00:00+03:00`).getUTCDay()

/** Ayın başından bugüne kadarki iş günleri (pazar hariç), bugün dahil değil. */
export function workdaysThisMonthBeforeToday() {
  const today = demoToday()
  const days = []
  for (let n = -31; n < 0; n++) {
    const day = dayOffset(n)
    if (day.slice(0, 7) === today.slice(0, 7) && weekday(day) !== 0) days.push(day)
  }
  return days
}
