import type { RosterEntryRequest, RosterEntryView } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { del, patch, post, type DemoRoute } from '@/core/demo/server/demoRouter'
import { requireRollCaller, tidy } from './markRules'
import { requireEntry } from './puantajLedger'
import type { RosterRecord } from './puantajRecords'
import { entryView } from './puantajViews'

const MAX_NAME = 120
const MAX_TRADE = 60
const MAX_PHONE = 20

function tidyWord(word: string): string {
  const lower = word.toLocaleLowerCase('tr')
  if (word !== lower && word !== word.toLocaleUpperCase('tr')) return word
  return lower.charAt(0).toLocaleUpperCase('tr') + lower.slice(1)
}

/**
 * "ALİ YILMAZ" ve "ali yılmaz" → "Ali Yılmaz": liste, sahada girilen yazıma göre dağınık görünmesin (backend'deki
 * PersonNames). Bilerek karışık yazılmış kelimeye ("McAllister") dokunulmaz.
 */
const tidyName = (text: unknown): string =>
  typeof text === 'string' ? text.trim().split(/\s+/).map(tidyWord).join(' ') : ''

/** Aynı numara farklı yazılabilir ("0532 123 45 67", "+90 532 123 4567"): rakamlarına bakılır. */
const looksLikePhone = (phone: string) => phone.length <= MAX_PHONE && /^\d{10,15}$/.test(phone.replace(/\D/g, ''))

function tradeOf(request: RosterEntryRequest): string | null {
  const trade = tidy(request.trade)
  if (trade && trade.length > MAX_TRADE) throw badRequest('Görev ya da iş kolu en çok 60 harf olabilir.')
  return trade
}

/** Uygulaması olmayan kişinin ya da ekibin adı (ekipte ekip başı), görevi (ekipte iş kolu) ve numarası. */
function describe(entry: RosterRecord, request: RosterEntryRequest): void {
  const name = tidyName(request.name)
  if (!name) throw badRequest(entry.kind === 'CREW' ? 'Ekip başının adını yaz.' : 'Adını yaz.')
  if (name.length > MAX_NAME) throw badRequest('Ad en çok 120 harf olabilir.')
  const phone = tidy(request.phone)
  if (phone && !looksLikePhone(phone)) throw badRequest('Telefon numarası hatalı.')
  Object.assign(entry, { name, trade: tradeOf(request), phone })
}

/** Şef uygulaması olmayan bir kişiyi ya da taşeron ekibi adıyla ekler; İlerleme de yeni taşeronu buradan açar. */
function addEntry({ body }: DemoRequest): RosterEntryView {
  const { company } = requireRollCaller()
  const request = (body ?? {}) as RosterEntryRequest
  if (request.kind !== 'PERSON' && request.kind !== 'CREW') throw badRequest('Kişi mi taşeron ekip mi, seç.')
  const blank = { name: '', trade: null, phone: null, personId: null, archived: false }
  const entry: RosterRecord = { ...blank, id: newId(), companyId: company.id, kind: request.kind, createdAt: nowIso() }
  describe(entry, request)
  db().puantaj.roster.push(entry)
  return entryView(entry)
}

/** Düzeltirken tür değişmez. Uygulamadaki çalışanın adı ve numarası hesabından gelir: yalnızca görevi düzeltilir. */
function updateEntry({ params, body }: DemoRequest): RosterEntryView {
  const { company } = requireRollCaller()
  const entry = requireEntry(company.id, params.entryId!)
  const request = (body ?? {}) as RosterEntryRequest
  if (entry.personId) entry.trade = tradeOf(request)
  else describe(entry, request)
  return entryView(entry)
}

/** Listeden çıkan kalem silinmez: geçmiş günleri puantajda kalır, imalatın eski taşeronu adıyla görünür. */
function archiveEntry({ params }: DemoRequest): void {
  const { company } = requireRollCaller()
  const entry = requireEntry(company.id, params.entryId!)
  if (entry.personId) {
    throw badRequest("Uygulamadaki çalışan buradan çıkarılmaz: Katılımcılar'dan firmadan çıkar ya da şef yap.")
  }
  entry.archived = true
}

export const rosterRoutes: DemoRoute[] = [
  post('/api/puantaj/entries', addEntry),
  patch('/api/puantaj/entries/:entryId', updateEntry),
  del('/api/puantaj/entries/:entryId', archiveEntry),
]
