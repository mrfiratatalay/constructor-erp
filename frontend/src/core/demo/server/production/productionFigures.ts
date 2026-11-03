import type { ProductionItemViewStatus } from '@/core/api/generated/model'
import type { ProductionEntryRecord } from './productionRecords'

const NEARLY_DONE_PERCENT = 90

/**
 * Yarım yukarı yuvarlama (backend'deki BigDecimal HALF_UP). Ondalık sayı ikilik tabanda tam tutulamaz: 487,5 hesapta
 * 487,49999… çıkabilir; EPSILON payı onu doğru tarafa iter.
 */
export function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits
  return Math.round(value * factor * (1 + Number.EPSILON)) / factor
}

/** Girişlerin toplamı. Miktarlar üç ondalıkla tutulur: 0,1 + 0,2 toplamda 0,30000000000000004 olmasın. */
export const sumOf = (entries: ProductionEntryRecord[]): number =>
  roundTo(entries.reduce((sum, entry) => sum + entry.quantity, 0), 3)

/** Girişlerden çıkan: toplam gerçekleşen, bugün girilen (aynı güne birden çok giriş toplanır), son girişin anı. */
export interface Progress {
  done: number
  today: number
  lastEntryAt: string | null
}

export function progressOf(entries: ProductionEntryRecord[], today: string): Progress {
  const lastEntryAt = entries.map((entry) => entry.createdAt).sort().at(-1) ?? null
  return { done: sumOf(entries), today: sumOf(entries.filter((entry) => entry.day === today)), lastEntryAt }
}

/** Toplam ve gerçekleşen; kalan ve yüzde bunlardan hesaplanır, saklanmaz. */
export interface Figures {
  total: number
  done: number
  remaining: number
  percent: number
}

/** Toplamı aşan girişte (şef onayladıysa) kalan sıfırdır, eksi olmaz; yüzde %100'ü geçebilir. */
export function figuresOf(total: number, done: number): Figures {
  return { total, done, remaining: roundTo(Math.max(total - done, 0), 3), percent: roundTo((done * 100) / total, 1) }
}

/** Durum girilmez, hesaplanır. Gecikme bitmeye yakınlıktan önce gelir: %95'te olup tarihi geçmiş iş gecikiyordur. */
export function statusOf(figures: Figures, plannedEnd: string | null, today: string): ProductionItemViewStatus {
  if (figures.done >= figures.total) return 'COMPLETED'
  if (plannedEnd && today > plannedEnd) return 'DELAYED'
  return figures.percent >= NEARLY_DONE_PERCENT ? 'NEARLY_DONE' : 'IN_PROGRESS'
}
