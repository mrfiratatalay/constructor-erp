import type { DayMarkViewStatus, RosterEntryViewKind } from '@/core/api/generated/model'

/**
 * Puantaj cetvelinin bir satırı: firmanın kendi çalışanı (PERSON) ya da taşeron ekibi (CREW). Uygulaması olmayan
 * usta da cetvelde durur; uygulamayı kullanan çalışan `personId` ile kendi satırına bağlıdır (Puantajım).
 * Taşeron ekipleri İlerleme modülünde de kullanılır (iş kaleminin taşeronu).
 */
export interface RosterRecord {
  id: string
  companyId: string
  kind: RosterEntryViewKind
  name: string
  trade: string | null
  phone: string | null
  personId: string | null
  archived: boolean
  createdAt: string
}

/** Bir satırın bir günkü işareti. Mesai yalnızca "Geldi"nin üstüne yazılır. */
export interface MarkRecord {
  id: string
  entryId: string
  day: string
  status: DayMarkViewStatus
  overtimeHours: number | null
  note: string | null
  markedById: string
  markedAt: string
}

export interface PuantajState {
  roster: RosterRecord[]
  marks: MarkRecord[]
}

/** Tohumlamadan önceki boş hali. */
export const emptyPuantaj = (): PuantajState => ({ roster: [], marks: [] })
