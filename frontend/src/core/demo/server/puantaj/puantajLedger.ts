import { nowIso } from '@/core/demo/server/demoClock'
import { db, saveDb } from '@/core/demo/server/demoDb'
import { DemoError } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import { companyPeople } from '@/core/demo/server/demoSession'
import type { PersonRecord } from '@/core/demo/server/people/peopleRecords'
import type { MarkRecord, RosterRecord } from './puantajRecords'
import { isOnList, nameOf } from './puantajViews'

export const rosterOf = (companyId: string): RosterRecord[] =>
  db().puantaj.roster.filter((entry) => entry.companyId === companyId)

function linkedEntry(person: PersonRecord, companyId: string): RosterRecord {
  const blank = { kind: 'PERSON' as const, trade: null, phone: null, archived: false }
  return { ...blank, id: newId(), companyId, name: person.fullName, personId: person.id, createdAt: nowIso() }
}

/**
 * Uygulamadaki çalışan listeye kendiliğinden girer: bağlantıyla katılan ya da çalışan yapılan kişinin kalemi puantaj
 * okunurken açılır (backend'deki addMissingWorkers). Kişi başına tek kalem; şef yapılıp geri dönen eskisine kavuşur.
 */
export function addMissingWorkers(companyId: string): void {
  const roster = rosterOf(companyId)
  const missing = companyPeople(companyId).filter(
    (person) => person.role === 'WORKER' && !roster.some((entry) => entry.personId === person.id),
  )
  if (missing.length === 0) return
  db().puantaj.roster.push(...missing.map((person) => linkedEntry(person, companyId)))
  // Okuma isteğinden sonra veri kaydedilmez; açılan kalem sayfa yenilenince başka kimlikle yeniden açılmasın.
  saveDb()
}

/** Firmanın kalemi. Başka firmanınki de "yok" döner: varlığı belli edilmez. */
export function requireEntry(companyId: string, entryId: string): RosterRecord {
  const entry = db().puantaj.roster.find((candidate) => candidate.id === entryId && candidate.companyId === companyId)
  if (!entry) throw new DemoError(404, 'Listede böyle biri yok.')
  return entry
}

/** İşaretlenecek kalem bugün listede olmalı: listeden çıkmış kalemin geçmiş günleri değişmez. */
export function requireMarkable(companyId: string, entryId: string): RosterRecord {
  const entry = requireEntry(companyId, entryId)
  if (!isOnList(entry)) throw new DemoError(409, 'Listeden çıkmış kişi işaretlenemez.')
  return entry
}

export const findMark = (entryId: string, day: string): MarkRecord | undefined =>
  db().puantaj.marks.find((mark) => mark.entryId === entryId && mark.day === day)

/** Bir kalemin aralıktaki günleri, sırayla. */
export const marksOf = (entryId: string, from: string, to: string): MarkRecord[] =>
  db()
    .puantaj.marks.filter((mark) => mark.entryId === entryId && mark.day >= from && mark.day <= to)
    .sort((a, b) => a.day.localeCompare(b.day))

const KIND_ORDER = { PERSON: 0, CREW: 1 } as const

/** Önce kişiler sonra ekipler; adlar Türkçe sırayla (İbrahim, Hasan'ın ardından gelir). */
const byKindAndName = (a: RosterRecord, b: RosterRecord): number =>
  KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || nameOf(a).localeCompare(nameOf(b), 'tr')

/**
 * Aralığın defteri: bugün listede olanlar ve aralıkta kaydı olanlar (listeden çıkan ya da şef yapılan kişinin geçmiş
 * günleri puantajda kalır), bir de aralığın işaretleri. Bugünün ekranı ve ayın cetveli aynı defteri okur.
 */
export function ledgerOf(companyId: string, from: string, to: string) {
  addMissingWorkers(companyId)
  const roster = rosterOf(companyId)
  const ids = new Set(roster.map((entry) => entry.id))
  const marks = db().puantaj.marks.filter((mark) => ids.has(mark.entryId) && mark.day >= from && mark.day <= to)
  const marked = new Set(marks.map((mark) => mark.entryId))
  const entries = roster.filter((entry) => isOnList(entry) || marked.has(entry.id)).sort(byKindAndName)
  return { entries, marks }
}
