import type { DayMarkView, MyDayView, RosterEntryView } from '@/core/api/generated/model'
import { personById, personName } from '@/core/demo/server/demoSession'
import type { PersonRecord } from '@/core/demo/server/people/peopleRecords'
import type { MarkRecord, RosterRecord } from './puantajRecords'

/** Bağlı kalemin hesabı; yalnızca aynı firmadaki kişi sayılır. */
function accountOf(entry: RosterRecord): PersonRecord | undefined {
  const person = personById(entry.personId)
  return person?.companyId === entry.companyId ? person : undefined
}

/** Bağlı kalemin adı hesabından gelir: kişi adını değiştirirse puantajda da değişir. */
export const nameOf = (entry: RosterRecord): string => accountOf(entry)?.fullName ?? entry.name

/**
 * Bugünün listesinde mi? Listeden çıkarılan kalem değil. Bağlı kalemde kişi hâlâ firmada ve çalışan olmalı: şef ya
 * da patron yapılan kişi yoklamada sayılmaz, firmadan çıkarılan da. İkisinin de geçmiş günleri puantajda kalır.
 */
export function isOnList(entry: RosterRecord): boolean {
  if (entry.archived) return false
  if (!entry.personId) return true
  const person = accountOf(entry)
  return !!person && person.active && person.role === 'WORKER'
}

export function entryView(entry: RosterRecord): RosterEntryView {
  const account = accountOf(entry)
  return {
    id: entry.id,
    kind: entry.kind,
    name: account?.fullName ?? entry.name,
    trade: entry.trade,
    phone: account ? account.phone : entry.phone,
    linked: entry.personId !== null,
    archived: !isOnList(entry),
  }
}

export const markView = (mark: MarkRecord): DayMarkView => ({
  entryId: mark.entryId,
  day: mark.day,
  status: mark.status,
  overtimeHours: mark.overtimeHours,
  note: mark.note,
  markedByName: personName(mark.markedById),
  markedAt: mark.markedAt,
})

/**
 * Çalışanın kendi günü. Şefin notu yazılmaz: not şefle patron arasındadır. İşaretleyenin numarası yazılır: kaydı
 * yanlış bulan çalışan o gün, yazan kişiyi arar.
 */
export const myDayView = (mark: MarkRecord): MyDayView => ({
  day: mark.day,
  status: mark.status,
  overtimeHours: mark.overtimeHours,
  markedByName: personName(mark.markedById),
  markedByPhone: personById(mark.markedById)?.phone ?? null,
  markedAt: mark.markedAt,
})
