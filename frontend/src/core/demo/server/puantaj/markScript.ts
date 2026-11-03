import type { DayMarkViewStatus } from '@/core/api/generated/model'

/** Senaryodaki bir işaret: durum, not, mesai; patron düzelttiyse onun adıyla yazılır. */
export interface ScriptedMark {
  status: DayMarkViewStatus
  note: string | null
  overtimeHours: number | null
  byOwner: boolean
}

// [satır, kaç iş günü önce (0: bugün), durum (null: şef unutmuş), not, mesai, patron düzeltti]
type ScriptRow = [string, number, DayMarkViewStatus | null, (string | null)?, (number | null)?, boolean?]

/**
 * Puantajın hikâyesi; geri kalan günler satırın alışkanlığından üretilir. Bugün yoklamanın yarısı alınmış, kalanını
 * demoyu açan işaretler. Geçmiş günlerden birkaçını patron düzeltmiş: şef geçmiş bir günü düzeltemez.
 */
const SCRIPT: ScriptRow[] = [
  ['ali', 0, 'PRESENT'],
  ['murat', 0, 'PRESENT'],
  ['hasan', 0, 'PRESENT'],
  ['musa', 0, 'PRESENT'],
  ['kalip', 0, 'PRESENT'],
  ['kaya', 0, 'PRESENT'],
  ['osman', 0, 'ABSENT', 'Haber vermedi'],
  ['yusuf', 0, 'LEAVE', 'Yıllık izin'],
  ['yusuf', 1, 'LEAVE', 'Yıllık izin'],
  ['cem', 3, null],
  ['emre', 4, 'PRESENT', 'Pano bağlantısı için kaldı', 2],
  ['emre', 7, 'HALF_DAY', 'Öğleden sonra hastaneye gitti'],
  ['kalip', 10, 'ABSENT', 'Yağmur'],
  ['kaya', 10, 'ABSENT', 'Yağmur'],
  ['musa', 12, 'LEAVE', 'İzin aldı, köye gitti'],
  ['kadir', 15, 'LEAVE', 'Raporlu'],
  ['kadir', 16, 'LEAVE', 'Raporlu'],
  ['murat', 19, 'LEAVE', 'Ailevi nedenle izinli'],
  ['osman', 6, 'HALF_DAY', 'Öğleden sonra geldi', null, true],
  ['hasan', 9, 'PRESENT', 'Mesaisi eksik yazılmış', 2, true],
  ['kaya', 11, 'PRESENT', 'Öğlene doğru geldiler', null, true],
  ['kadir', 21, 'LEAVE', 'Rapor getirdi', null, true],
]

/** Satırın o günkü senaryosu: senaryoda yoksa undefined, şef unuttuysa null. */
export function scriptOf(key: string, back: number): ScriptedMark | null | undefined {
  const row = SCRIPT.find(([candidate, daysBack]) => candidate === key && daysBack === back)
  if (!row) return undefined
  const [, , status, note = null, overtimeHours = null, byOwner = false] = row
  return status ? { status, note, overtimeHours, byOwner } : null
}
