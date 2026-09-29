import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import type { ProductionEntryView, ProductionItemView } from '@/core/api/generated/model'
import { canEnterProduction, canSeeProduction } from '@/core/production/productionPermissions'
import { entryFileProblem } from '@/core/production/entryFiles'
import {
  emptyEntryForm,
  entryFormProblem,
  entryPayload,
  overflowQuestion,
} from '@/core/production/entryForm'
import { historyDays } from '@/core/production/entryHistory'
import {
  EMPTY_ITEM_FORM,
  itemFormProblem,
  itemRequestOf,
  tradeChoices,
} from '@/core/production/itemForm'
import { parseQuantity, quantityProblem } from '@/core/production/quantityInput'

const today = dayjs('2026-09-28')
const demir = {
  doneQuantity: 118,
  totalQuantity: 120,
  unit: 'ton',
  trade: 'Demir İşleri',
} as ProductionItemView

describe('kim ne yapar', () => {
  it('görmek VIEW_PRODUCTION, girmek MANAGE_PRODUCTION ister; izni olmayan (çalışan) hiç görmez', () => {
    const lead = { permissions: ['VIEW_PRODUCTION', 'MANAGE_PRODUCTION'] as const }
    const keeper = { permissions: ['VIEW_PRODUCTION'] as const }
    expect([lead, keeper, { permissions: [] }, undefined].map((user) => canSeeProduction(user as never))).toEqual([
      true,
      true,
      false,
      false,
    ])
    expect(canEnterProduction(lead as never)).toBe(true)
    expect(canEnterProduction(keeper as never)).toBe(false)
  })
})

describe('Yeni İmalat formu', () => {
  it('tür, toplam ve birim ister; bitiş başlangıçtan önce olamaz', () => {
    const filled = { ...EMPTY_ITEM_FORM, trade: 'Sıva', total: '12.000', unit: 'm²' }
    expect(itemFormProblem(EMPTY_ITEM_FORM)).toBe('İmalat türünü seç ya da yaz.')
    expect(itemFormProblem({ ...filled, total: '' })).toBe('Toplam miktarı yaz.')
    expect(itemFormProblem({ ...filled, total: '0' })).toBe('Toplam miktar sıfırdan büyük olmalı.')
    expect(itemFormProblem({ ...filled, startDate: '2026-10-10', plannedEnd: '2026-10-01' })).toBe(
      'Planlanan bitiş, başlangıçtan önce olamaz.',
    )
    expect(itemFormProblem(filled)).toBeNull()
  })

  it('boş bırakılan isteğe bağlı alanlar gönderilmez', () => {
    const form = {
      ...EMPTY_ITEM_FORM,
      trade: ' Sıva ',
      title: '  ',
      total: '12.000',
      unit: 'm²',
      note: '',
    }
    expect(itemRequestOf(form)).toMatchObject({
      trade: 'Sıva',
      title: null,
      crewId: null,
      totalQuantity: 12000,
      note: null,
    })
    expect(tradeChoices([{ trade: 'Asansör' } as ProductionItemView])).toContain('Asansör')
    expect(
      tradeChoices([{ trade: 'Sıva' } as ProductionItemView]).filter((one) => one === 'Sıva'),
    ).toHaveLength(1)
  })
})

describe('Günlük İmalat Güncellemesi', () => {
  it('bugünle ve Saha kapalı gelir; 0 girilebilir, ileri gün girilemez', () => {
    const form = emptyEntryForm(today)
    expect(form).toMatchObject({ day: '2026-09-28', onField: false })
    expect(entryFormProblem(form, today)).toBe('Bugün yapılan miktarı yaz.')
    expect(entryFormProblem({ ...form, quantity: '0' }, today)).toBeNull()
    expect(entryFormProblem({ ...form, quantity: '2 ton' }, today)).toBe(
      'Miktarı sayı olarak yaz: 3,5 ya da 12.000',
    )
    expect(entryFormProblem({ ...form, quantity: '1', day: '2026-09-29' }, today)).toBe(
      'İleri bir güne giriş yapılmaz.',
    )
  })

  it('toplamı aşan giriş engellenmez, sorulur', () => {
    expect(overflowQuestion(demir, 2)).toBeNull()
    expect(overflowQuestion(demir, 5)).toBe(
      'Bu giriş ile toplam gerçekleşme 123 ton olacak (toplam 120 ton). Devam edilsin mi?',
    )
  })

  it('gönderilen form: Türkçe yazılan miktar sayı olur, üç haneye yuvarlanır; boş not gitmez', () => {
    const form = { ...emptyEntryForm(today), quantity: '0,3004', note: ' ' }
    expect(entryPayload(form, [], 'giris')).toEqual({
      id: 'giris',
      day: '2026-09-28',
      quantity: 0.3,
      workerCount: null,
      note: null,
      onField: false,
      files: [],
    })
  })

  it('yalnızca fotoğraf ve PDF eklenir', () => {
    expect(entryFileProblem(new File(['x'], 'a.jpg', { type: 'image/jpeg' }))).toBeNull()
    expect(entryFileProblem(new File(['x'], 'b.pdf', { type: 'application/pdf' }))).toBeNull()
    expect(entryFileProblem(new File(['x'], 'c.mp4', { type: 'video/mp4' }))).toBe(
      'c.mp4: yalnızca fotoğraf ve PDF eklenebilir.',
    )
  })

  it('geçmiş gün gün, günün toplamıyla', () => {
    const entry = (id: string, day: string, quantity: number) =>
      ({ id, day, quantity }) as ProductionEntryView
    const days = historyDays([
      entry('a', '2026-09-28', 2),
      entry('b', '2026-09-28', 1.5),
      entry('c', '2026-09-27', 4.2),
    ])
    expect(days.map(({ title, total, entries }) => [title, total, entries.length])).toEqual([
      ['28 Eylül 2026', 3.5, 2],
      ['27 Eylül 2026', 4.2, 1],
    ])
  })
})

describe('Türkçe yazılan miktar', () => {
  it('virgül ondalık, nokta binliktir; noktalı ondalık da anlaşılır', () => {
    expect(parseQuantity('3,5')).toBe(3.5)
    expect(parseQuantity('3.5')).toBe(3.5)
    expect(parseQuantity('12.000')).toBe(12000)
    expect(parseQuantity('12.000,5')).toBe(12000.5)
    expect(parseQuantity(' 250 ')).toBe(250)
    expect(parseQuantity('0')).toBe(0)
    expect(parseQuantity('')).toBeUndefined()
    expect(parseQuantity('-2')).toBeUndefined()
    expect(parseQuantity('3,5,2')).toBeUndefined()
    expect(parseQuantity('üç')).toBeUndefined()
    expect(quantityProblem('abc', 'Yaz.')).toBe('Miktarı sayı olarak yaz: 3,5 ya da 12.000')
  })
})
