import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import type { ProductionItemView } from '@/core/api/generated/model'
import {
  boardSummary,
  EMPTY_FILTER,
  filterOptions,
  statusCounts,
  visibleItems,
} from '@/core/production/productionBoard'
import {
  lastUpdateLabel,
  percentLabel,
  progressLine,
  quantityLabel,
  remainingLine,
  todayLine,
} from '@/core/production/productionFormat'

const now = dayjs('2026-09-28T17:00:00')

const item = (fields: Partial<ProductionItemView>) =>
  ({
    id: 'demir',
    trade: 'Demir İşleri',
    name: 'Demir İşleri',
    crew: { id: 'kaya', name: 'Kaya Demir', archived: false },
    totalQuantity: 120,
    unit: 'ton',
    doneQuantity: 58.5,
    remainingQuantity: 61.5,
    percent: 48.8,
    todayQuantity: 3.5,
    status: 'IN_PROGRESS',
    lastEntryAt: '2026-09-28T16:42:00',
    createdAt: '2026-09-01T08:00:00',
    ...fields,
  }) as ProductionItemView

const ITEMS = [
  item({}),
  item({
    id: 'siva',
    trade: 'Sıva',
    name: 'Sıva',
    crew: undefined,
    status: 'COMPLETED',
    lastEntryAt: undefined,
  }),
  item({
    id: 'elektrik',
    trade: 'Elektrik',
    name: 'B Blok Elektrik',
    status: 'DELAYED',
    lastEntryAt: '2026-09-26T10:00:00',
  }),
  item({
    id: 'seramik',
    trade: 'Seramik',
    name: 'Seramik',
    status: 'NEARLY_DONE',
    lastEntryAt: '2026-09-27T18:20:00',
  }),
]

describe('imalat sayıları ekranda', () => {
  it('Türkçe yazılır: yapılan / toplam, bugün, kalan, yüzde', () => {
    expect(quantityLabel(12000)).toBe('12.000')
    expect(quantityLabel(0.25)).toBe('0,25')
    expect(percentLabel(48.8)).toBe('%48,8')
    expect(progressLine(ITEMS[0]!)).toBe('58,5 / 120 ton')
    expect(todayLine(ITEMS[0]!)).toBe('Bugün +3,5 ton')
    expect(remainingLine(ITEMS[0]!)).toBe('61,5 ton kaldı')
    expect(remainingLine(item({ remainingQuantity: 0 }))).toBe('Tamamlandı')
  })

  it('son güncelleme: bugün, dün, bu yıl, geçen yıl, hiç', () => {
    expect(lastUpdateLabel('2026-09-28T16:42:00', now)).toBe('Bugün 16:42')
    expect(lastUpdateLabel('2026-09-27T18:20:00', now)).toBe('Dün 18:20')
    expect(lastUpdateLabel('2026-09-26T14:28:00', now)).toBe('26 Eyl 14:28')
    expect(lastUpdateLabel('2025-09-26T14:28:00', now)).toBe('26 Eyl 2025')
    expect(lastUpdateLabel(null, now)).toBe('Henüz giriş yok')
  })
})

describe('İmalat sekmesinin özeti ve süzgeci', () => {
  it('özet kartları: aktif, tamamlanan ve oranı, geciken, son 24 saatte güncellenen', () => {
    expect(boardSummary(ITEMS, now)).toEqual({
      total: 4,
      active: 3,
      completed: 1,
      completedPercent: 25,
      delayed: 1,
      updatedToday: 2,
    })
    expect(statusCounts(ITEMS)).toEqual({
      ALL: 4,
      IN_PROGRESS: 1,
      NEARLY_DONE: 1,
      DELAYED: 1,
      COMPLETED: 1,
    })
  })

  it('durum, taşeron, tür ve arama birlikte süzer; biten işler sona iner', () => {
    expect(visibleItems(ITEMS, EMPTY_FILTER).map((one) => one.id)).toEqual([
      'demir',
      'elektrik',
      'seramik',
      'siva',
    ])
    expect(
      visibleItems(ITEMS, { ...EMPTY_FILTER, status: 'DELAYED' }).map((one) => one.id),
    ).toEqual(['elektrik'])
    expect(visibleItems(ITEMS, { ...EMPTY_FILTER, trade: 'Sıva' }).map((one) => one.id)).toEqual([
      'siva',
    ])
    expect(visibleItems(ITEMS, { ...EMPTY_FILTER, query: 'b blok' }).map((one) => one.id)).toEqual([
      'elektrik',
    ])
    expect(
      visibleItems(ITEMS, { ...EMPTY_FILTER, query: 'KAYA' }).map((one) => one.id),
    ).toHaveLength(3)
    expect(visibleItems(ITEMS, { ...EMPTY_FILTER, crewId: 'kaya', status: 'COMPLETED' })).toEqual(
      [],
    )
  })

  it('süzgeç seçenekleri listedeki imalatlardan, alfabetik', () => {
    expect(filterOptions(ITEMS)).toEqual({
      trades: ['Demir İşleri', 'Elektrik', 'Seramik', 'Sıva'],
      crews: [{ id: 'kaya', name: 'Kaya Demir' }],
    })
  })
})
