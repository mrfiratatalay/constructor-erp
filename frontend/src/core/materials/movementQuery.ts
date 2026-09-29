import type { LocationQuery, LocationQueryRaw } from 'vue-router'
import type { ListMaterialMovementsParams } from '@/core/api/generated/model'
import { DATE_PRESETS, rangeOf, type DatePreset } from '@/core/materials/dateRanges'
import {
  TYPE_LOOKS,
  STATUS_LOOKS,
  type MovementStatus,
  type MovementType,
} from '@/core/materials/materialLabels'

export type MovementSortKey = 'DAY' | 'QUANTITY' | 'MATERIAL'

/** Hareket listesinin süzgeçleri; hepsi birlikte çalışır. page 0'dan başlar (adreste 1'den). */
export interface MovementFilters {
  type: MovementType | null
  preset: DatePreset
  from: string | null
  to: string | null
  locationId: string | null
  materialId: string | null
  partyId: string | null
  status: MovementStatus | null
  category: string | null
  q: string
  page: number
  sort: MovementSortKey
  ascending: boolean
}

export const DEFAULT_PRESET: DatePreset = 'last30'

const SORT_SLUGS: Record<MovementSortKey, string> = {
  DAY: 'tarih',
  QUANTITY: 'miktar',
  MATERIAL: 'malzeme',
}
const TEXT_KEYS = {
  locationId: 'lokasyon',
  materialId: 'malzeme',
  partyId: 'firma',
  category: 'kategori',
} as const
type TextKey = keyof typeof TEXT_KEYS

const text = (value: unknown) => (typeof value === 'string' && value.length > 0 ? value : null)
const oneOf = <T extends string>(value: unknown, known: Record<T, unknown>) =>
  typeof value === 'string' && value in known ? (value as T) : null

function presetOf(query: LocationQuery): DatePreset {
  if (query.tarih === 'ozel') return 'custom'
  return DATE_PRESETS.find((item) => item.slug === query.tarih)?.key ?? DEFAULT_PRESET
}

/** Adresten süzgeçler: tanınmayan değer yok sayılır (elle yazılmış bozuk adres sayfayı bozmaz). */
export function filtersOf(query: LocationQuery): MovementFilters {
  const preset = presetOf(query)
  const range = rangeOf(preset, { from: text(query.bas), to: text(query.bit) })
  const sort = (Object.keys(SORT_SLUGS) as MovementSortKey[]).find(
    (key) => SORT_SLUGS[key] === query.sirala,
  )
  const texts = Object.fromEntries(
    (Object.keys(TEXT_KEYS) as TextKey[]).map((key) => [key, text(query[TEXT_KEYS[key]])]),
  ) as Record<TextKey, string | null>
  return {
    ...texts,
    type: oneOf(query.tur, TYPE_LOOKS),
    preset,
    ...range,
    status: oneOf(query.durum, STATUS_LOOKS),
    q: text(query.ara) ?? '',
    page: Math.max(Number(query.sayfa) || 1, 1) - 1,
    sort: sort ?? 'DAY',
    ascending: query.yon === 'artan',
  }
}

/** Boş değerleri atar: adrese ve API'ye yalnızca seçilmiş süzgeçler gider. */
function compact<T extends Record<string, unknown>>(values: T): Partial<T> {
  const kept = Object.entries(values).filter(
    ([, value]) => value !== null && value !== undefined && value !== '',
  )
  return Object.fromEntries(kept) as Partial<T>
}

/** Varsayılan aralık (son 30 gün) adrese yazılmaz; hazır aralık kısa adıyla, elle seçilen "ozel" olarak yazılır. */
function presetSlug(preset: DatePreset): string | null {
  if (preset === DEFAULT_PRESET) return null
  return DATE_PRESETS.find((item) => item.key === preset)?.slug ?? 'ozel'
}

function ownQuery(filters: MovementFilters): Record<string, string | null> {
  const custom = filters.preset === 'custom'
  const texts = Object.fromEntries(
    (Object.keys(TEXT_KEYS) as TextKey[]).map((key) => [TEXT_KEYS[key], filters[key]]),
  )
  return {
    ...texts,
    tur: filters.type,
    tarih: presetSlug(filters.preset),
    bas: custom ? filters.from : null,
    bit: custom ? filters.to : null,
    durum: filters.status,
    ara: filters.q,
    sayfa: filters.page > 0 ? String(filters.page + 1) : null,
    sirala: filters.sort === 'DAY' ? null : SORT_SLUGS[filters.sort],
    yon: filters.ascending ? 'artan' : null,
  }
}

const OWN_KEYS = [
  'tur',
  'tarih',
  'bas',
  'bit',
  'durum',
  'ara',
  'sayfa',
  'sirala',
  'yon',
  ...Object.values(TEXT_KEYS),
]

/** Süzgeçlerden adres: varsayılan değerler yazılmaz; sekme, açık hareket gibi başka anahtarlar yerinde kalır. */
export function queryOf(filters: MovementFilters, current: LocationQuery): LocationQueryRaw {
  const rest = Object.fromEntries(
    Object.entries(current).filter(([key]) => !OWN_KEYS.includes(key)),
  )
  return { ...rest, ...compact(ownQuery(filters)) }
}

/** API'nin süzgeçleri: boş olanlar gönderilmez. */
export function paramsOf(filters: MovementFilters, size: number): ListMaterialMovementsParams {
  return compact({
    from: filters.from,
    to: filters.to,
    locationId: filters.locationId,
    materialId: filters.materialId,
    partyId: filters.partyId,
    type: filters.type,
    status: filters.status,
    category: filters.category,
    q: filters.q.trim(),
    page: filters.page,
    size,
    sort: filters.sort,
    direction: filters.ascending ? 'ASC' : 'DESC',
  }) as ListMaterialMovementsParams
}
