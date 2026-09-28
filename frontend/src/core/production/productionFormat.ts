import dayjs from 'dayjs'
import type { ProductionItemView, ProductionItemViewStatus } from '@/core/api/generated/model'
import { clockTime, shortDay } from '@/core/format/dates'
import type { TagTone } from '@/core/format/statusTone'

/** İmalatın durumları ekranda: Devam ediyor mavi, Bitmeye yakın turuncu, Gecikiyor kırmızı, Tamamlandı yeşil. */
export const PRODUCTION_STATUS: Record<
  ProductionItemViewStatus,
  { label: string; tone: TagTone }
> = {
  IN_PROGRESS: { label: 'Devam ediyor', tone: 'progress' },
  NEARLY_DONE: { label: 'Bitmeye yakın', tone: 'warning' },
  DELAYED: { label: 'Gecikiyor', tone: 'danger' },
  COMPLETED: { label: 'Tamamlandı', tone: 'success' },
}

const QUANTITY = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 3 })
const PERCENT = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 })

/** Sayılar Türkçe yazılır: 58,5 · 12.000 · 0,25. */
export const quantityLabel = (value: number) => QUANTITY.format(value)

/** "%48,8". */
export const percentLabel = (value: number) => `%${PERCENT.format(value)}`

/** "58,5 / 120 ton". */
export const progressLine = (item: ProductionItemView) =>
  `${quantityLabel(item.doneQuantity)} / ${quantityLabel(item.totalQuantity)} ${item.unit}`

/** "Bugün +3,5 ton"; bugün giriş yoksa "Bugün +0 ton". */
export const todayLine = (item: ProductionItemView) =>
  `Bugün +${quantityLabel(item.todayQuantity)} ${item.unit}`

/** "61,5 ton kaldı"; biten işte "Tamamlandı". */
export const remainingLine = (item: ProductionItemView) =>
  item.remainingQuantity > 0
    ? `${quantityLabel(item.remainingQuantity)} ${item.unit} kaldı`
    : 'Tamamlandı'

/** Çubuk %100'de durur: toplamı aşan (onaylı) girişte yazı %102,5 der, çubuk taşmaz. */
export const barPercent = (percent: number) => Math.min(100, Math.max(0, percent))

/** "+3,5 ton". */
export const entryAmount = (quantity: number, unit: string) => `+${quantityLabel(quantity)} ${unit}`

/**
 * Son güncelleme: "Bugün 16:42", "Dün 18:20", "26 Eyl 14:28", geçen yıldan "26 Eyl 2025"; girişi yoksa "Henüz
 * giriş yok". Ay adları tarih yardımcılarından gelir (Türkçe).
 */
export function lastUpdateLabel(isoDate: string | null | undefined, now = dayjs()): string {
  if (!isoDate) return 'Henüz giriş yok'
  const moment = dayjs(isoDate)
  if (moment.isSame(now, 'day')) return `Bugün ${clockTime(isoDate)}`
  if (moment.isSame(now.subtract(1, 'day'), 'day')) return `Dün ${clockTime(isoDate)}`
  const year = moment.isSame(now, 'year') ? clockTime(isoDate) : moment.format('YYYY')
  return `${shortDay(isoDate)} ${year}`
}
