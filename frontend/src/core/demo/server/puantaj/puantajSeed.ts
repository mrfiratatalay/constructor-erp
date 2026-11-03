import type { Seed } from '@/core/demo/server/seed/seedContext'
import { seedMarks } from './markSeed'
import { seedRoster } from './rosterSeed'

/**
 * Atalay Yapı'nın yoklama defteri: on bir kişi (üçü uygulamada) ve beş taşeron ekip; geçen ayın başından bugüne her
 * iş günü işaretli. İlerleme taşeronlarını bu ekiplerden seçer, bu yüzden ondan önce tohumlanır.
 */
export const seedPuantaj: Seed = (draft, context) => {
  const rows = seedRoster(context)
  draft.puantaj.roster.push(...rows.map((row) => row.record))
  draft.puantaj.marks.push(...seedMarks(rows, context))
}
