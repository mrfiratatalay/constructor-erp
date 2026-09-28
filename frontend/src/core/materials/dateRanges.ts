import dayjs from 'dayjs'

export type DatePreset = 'last7' | 'last30' | 'thisMonth' | 'lastMonth' | 'all' | 'custom'

export interface DateRange {
  from: string | null
  to: string | null
}

/** Tarih süzgecinin hazır aralıkları; adreste kısa Türkçe adlarıyla durur (?tarih=buay). */
export const DATE_PRESETS: { key: Exclude<DatePreset, 'custom'>; label: string; slug: string }[] = [
  { key: 'last7', label: 'Son 7 gün', slug: 'son7' },
  { key: 'last30', label: 'Son 30 gün', slug: 'son30' },
  { key: 'thisMonth', label: 'Bu ay', slug: 'buay' },
  { key: 'lastMonth', label: 'Geçen ay', slug: 'gecenay' },
  { key: 'all', label: 'Tüm zamanlar', slug: 'tumu' },
]

const ISO = 'YYYY-MM-DD'

/** Hazır aralığın bugüne göre günleri; "Tüm zamanlar"da iki uç da boştur. */
export function rangeOf(
  preset: DatePreset,
  custom: DateRange = { from: null, to: null },
): DateRange {
  const today = dayjs()
  switch (preset) {
    case 'last7':
      return { from: today.subtract(6, 'day').format(ISO), to: today.format(ISO) }
    case 'last30':
      return { from: today.subtract(29, 'day').format(ISO), to: today.format(ISO) }
    case 'thisMonth':
      return { from: today.startOf('month').format(ISO), to: today.format(ISO) }
    case 'lastMonth': {
      const last = today.subtract(1, 'month')
      return { from: last.startOf('month').format(ISO), to: last.endOf('month').format(ISO) }
    }
    case 'custom':
      return custom
    default:
      return { from: null, to: null }
  }
}

/** Süzgeç düğmesinin yazısı: "Son 30 gün" ya da "1 Eyl – 30 Eyl". */
export function rangeLabel(preset: DatePreset, range: DateRange): string {
  const known = DATE_PRESETS.find((item) => item.key === preset)
  if (known) return known.label
  const format = (day: string | null) => (day ? dayjs(day).format('D MMM YYYY') : '…')
  return `${format(range.from)} – ${format(range.to)}`
}
