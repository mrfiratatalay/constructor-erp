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

/** "14:20". */
export function clockTime(isoDate: string): string {
  return dayjs(isoDate).format('HH:mm')
}

/** Ses ve video süresi: "0:45", "2:05". */
export function durationLabel(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}
