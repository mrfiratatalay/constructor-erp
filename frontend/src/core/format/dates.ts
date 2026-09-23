import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('tr')

/** "3 saat önce", "2 gün önce". */
export function timeAgo(isoDate: string): string {
  return dayjs(isoDate).fromNow()
}

/** "22 Eylül Salı". */
export function dayTitle(isoDate: string): string {
  return dayjs(isoDate).format('D MMMM dddd')
}

/** "22 Eylül 14:20". */
export function dateTime(isoDate: string): string {
  return dayjs(isoDate).format('D MMMM HH:mm')
}

/** Akıştaki gün başlığı: "Bugün", "Dün" ya da "20 Eylül Pazar". */
export function relativeDayTitle(isoDate: string): string {
  const day = dayjs(isoDate)
  if (day.isSame(dayjs(), 'day')) return 'Bugün'
  if (day.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Dün'
  return day.format('D MMMM dddd')
}

/** Bugünün tarihi, "2026-09-23". Yerel saatle: toISOString UTC'ye çevirir, gece yarısına yakın gün kayar. */
export function todayIsoDate(): string {
  return dayjs().format('YYYY-MM-DD')
}

/** "12 Eki". */
export function shortDay(isoDate: string): string {
  return dayjs(isoDate).format('D MMM')
}

/** "14:20". */
export function clockTime(isoDate: string): string {
  return dayjs(isoDate).format('HH:mm')
}

/** Listedeki son haber zamanı (WhatsApp gibi): "14:20", "Dün 17:40", "Pzt 11:30", "12 Eyl". */
export function listMoment(isoDate: string): string {
  const moment = dayjs(isoDate)
  const today = dayjs()
  if (moment.isSame(today, 'day')) return moment.format('HH:mm')
  if (moment.isSame(today.subtract(1, 'day'), 'day')) return `Dün ${moment.format('HH:mm')}`
  if (moment.isAfter(today.subtract(7, 'day'))) return moment.format('ddd HH:mm')
  return moment.format('D MMM')
}

/** Kaç takvim günü önce: bugün 0, dün 1. Saat farkı değil gün farkı sayılır. */
export function daysAgo(isoDate: string): number {
  return dayjs().startOf('day').diff(dayjs(isoDate).startOf('day'), 'day')
}

/** Ses ve video süresi: "0:45", "2:05". */
export function durationLabel(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}
