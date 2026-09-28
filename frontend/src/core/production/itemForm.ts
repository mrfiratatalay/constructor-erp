import type { ProductionItemRequest, ProductionItemView } from '@/core/api/generated/model'
import { quantityLabel } from '@/core/production/productionFormat'
import { parseQuantity, quantityProblem } from '@/core/production/quantityInput'

/** İmalat türünün hazır seçenekleri; listede olmayan yeni bir tür yazılabilir ("Diğer" yerine). */
export const TRADE_PRESETS = [
  'Demir İşleri',
  'Kalıp İşleri',
  'Duvar',
  'Sıva',
  'Seramik',
  'Boya',
  'Elektrik',
  'Mekanik',
  'Mantolama',
  'Alçı',
]

/** Birimin hazır seçenekleri; başka bir birim de yazılabilir. "%": fiziksel miktarı net olmayan iş (asansör). */
export const UNIT_PRESETS = ['ton', 'kg', 'm²', 'm³', 'metre', 'adet', 'daire', 'kat', '%']

/** "Yeni İmalat" penceresinin alanları. Seçim kutusu seçilmemişi undefined bekler (Element Plus, Vant). */
export interface ItemForm {
  trade: string
  title: string
  crewId: string | undefined
  /** Yazı: "12.000" ya da "58,5" (quantityInput). */
  total: string
  unit: string
  startDate: string | null
  plannedEnd: string | null
  note: string
}

export const EMPTY_ITEM_FORM: ItemForm = {
  trade: '',
  title: '',
  crewId: undefined,
  total: '',
  unit: 'ton',
  startDate: null,
  plannedEnd: null,
  note: '',
}

export function itemFormOf(item: ProductionItemView): ItemForm {
  return {
    trade: item.trade,
    title: item.title ?? '',
    crewId: item.crew?.id,
    total: quantityLabel(item.totalQuantity),
    unit: item.unit,
    startDate: item.startDate ?? null,
    plannedEnd: item.plannedEnd ?? null,
    note: item.note ?? '',
  }
}

/** Kaydedilemeyecek formun nedeni (düğmenin altında yazar); kaydedilebiliyorsa null. */
export function itemFormProblem(form: ItemForm): string | null {
  if (!form.trade.trim()) return 'İmalat türünü seç ya da yaz.'
  const total = quantityProblem(form.total, 'Toplam miktarı yaz.')
  if (total) return total
  if (!parseQuantity(form.total)) return 'Toplam miktar sıfırdan büyük olmalı.'
  if (!form.unit.trim()) return 'Birimi seç.'
  if (form.startDate && form.plannedEnd && form.plannedEnd < form.startDate) {
    return 'Planlanan bitiş, başlangıçtan önce olamaz.'
  }
  return null
}

const optional = (text: string) => text.trim() || null

export function itemRequestOf(form: ItemForm): ProductionItemRequest {
  return {
    trade: form.trade.trim(),
    title: optional(form.title),
    crewId: form.crewId ?? null,
    totalQuantity: parseQuantity(form.total) ?? 0,
    unit: form.unit.trim(),
    startDate: form.startDate,
    plannedEnd: form.plannedEnd,
    note: optional(form.note),
  }
}

/** Tür seçenekleri: hazır türler ve bu şantiyede daha önce yazılmış olanlar, bir kez. */
export function tradeChoices(items: ProductionItemView[]): string[] {
  return [...new Set([...TRADE_PRESETS, ...items.map((item) => item.trade)])]
}
