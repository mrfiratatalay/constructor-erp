import dayjs from 'dayjs'
import { isoDays, monthRange } from '@/core/puantaj/puantajDays'

/** Takvimin bir hücresi: ayın bir günü ya da ay Pazartesi başlamıyorsa baştaki boşluk. */
export interface GridCell {
  key: string
  day: string | null
}

/** Haftanın günleri, Pazartesi başta (Türkiye takvimi). */
export const WEEKDAY_HEADERS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

/** Telefondaki aylık takvim: yedi sütunlu ızgara, ilk günden önce boş hücreler. */
export function monthGrid(month: string): GridCell[] {
  const { from, to } = monthRange(month)
  const leading = (dayjs(from).day() + 6) % 7
  const blanks = Array.from({ length: leading }, (_, index) => ({ key: `blank-${index}`, day: null }))
  return [...blanks, ...isoDays(from, to).map((day) => ({ key: day, day }))]
}
