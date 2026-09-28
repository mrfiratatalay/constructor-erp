import { rangeLabel } from '@/core/materials/dateRanges'
import { STATUS_LOOKS, TYPE_LOOKS } from '@/core/materials/materialLabels'
import { DEFAULT_PRESET, type MovementFilters } from '@/core/materials/movementQuery'

/** Etiketin kapatılınca süzgeçte neyi boşalttığı. */
export interface ActiveFilter {
  key: string
  label: string
  reset: Partial<MovementFilters>
}

/** Kimlikten ad; seçenekler yüklenmeden etiket boş kalmasın diye yedek yazı verilir. */
export interface FilterNames {
  location: (id: string) => string | undefined
  material: (id: string) => string | undefined
  party: (id: string) => string | undefined
}

/** [seçili mi, anahtar, etiket, kapatınca ne boşalır] */
type Candidate = [boolean, string, () => string, Partial<MovementFilters>]

/**
 * Seçili süzgeçlerin etiketleri (İlke 2: ekranda ne varsa yazar): "Transfer ×", "Çamburnu Plaza ×", "“çimento” ×".
 * Varsayılan tarih aralığı etiket değildir; başka bir aralık seçilince etiket olur.
 */
export function activeFilters(filters: MovementFilters, names: FilterNames): ActiveFilter[] {
  const { type, locationId, materialId, partyId, status, category, q } = filters
  const candidates: Candidate[] = [
    [!!type, 'type', () => TYPE_LOOKS[type!].chip, { type: null }],
    [filters.preset !== DEFAULT_PRESET, 'date', () => rangeLabel(filters.preset, filters), { preset: DEFAULT_PRESET }],
    [!!locationId, 'location', () => names.location(locationId!) ?? 'Lokasyon', { locationId: null }],
    [!!materialId, 'material', () => names.material(materialId!) ?? 'Malzeme', { materialId: null }],
    [!!partyId, 'party', () => names.party(partyId!) ?? 'Firma', { partyId: null }],
    [!!status, 'status', () => STATUS_LOOKS[status!].label, { status: null }],
    [!!category, 'category', () => category!, { category: null }],
    [!!q, 'q', () => `“${q}”`, { q: '' }],
  ]
  return candidates
    .filter(([picked]) => picked)
    .map(([, key, label, reset]) => ({ key, label: label(), reset }))
}
