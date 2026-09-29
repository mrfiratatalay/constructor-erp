import type { CrewRef, ProductionItemRequest, ProductionItemView } from '@/core/api/generated/model'
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

/** "Yeni İş Kalemi" penceresinin alanları. Seçim kutusu seçilmemişi undefined bekler (Element Plus, Vant). */
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
  if (!form.trade.trim()) return 'İş türünü seç ya da yaz.'
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

/**
 * Telefonda taşeron yazıyla da girilir: yazılan ad listedeki bir ekibinse (büyük-küçük harf Türkçe kurala göre) o
 * ekip seçilir, değilse yazı yeni taşeronun adıdır (kaydederken eklenir).
 */
export function crewIdForText(text: string, crews: CrewRef[]): string | undefined {
  const name = text.trim().toLocaleLowerCase('tr-TR')
  if (!name) return undefined
  return crews.find((crew) => crew.name.toLocaleLowerCase('tr-TR') === name)?.id ?? text.trim()
}

/** Seçili taşeronun kutuda yazan adı: listedekinin adı, yeni yazılanın kendisi. */
export const crewTextOf = (crewId: string | undefined, crews: CrewRef[]) =>
  crews.find((crew) => crew.id === crewId)?.name ?? crewId ?? ''

/**
 * Telefonda taşeron çipleri öneri gibidir: yazılana uyanlar (yazı yoksa hepsi), ada göre, aynı ad bir kez, en fazla
 * sekiz (aynı adın ilk yazılışı kalır). Firma büyüdükçe bütün ekipler çip duvarına dönmesin.
 */
export function crewSuggestions(crews: CrewRef[], text: string, limit = 8): CrewRef[] {
  const wanted = text.trim().toLocaleLowerCase('tr-TR')
  const byName = new Map<string, CrewRef>()
  for (const crew of crews) {
    const name = crew.name.toLocaleLowerCase('tr-TR')
    if (name.includes(wanted) && !byName.has(name)) byName.set(name, crew)
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, 'tr')).slice(0, limit)
}
