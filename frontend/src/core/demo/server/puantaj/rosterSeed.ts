import { at, dayOf } from '@/core/demo/server/demoClock'
import { fixedId, ID_GROUP, type PersonKey, type SeedContext } from '@/core/demo/server/seed/seedContext'
import type { RosterRecord } from './puantajRecords'

/** Yoklamayı alan şef: Ayşe kaba inşaatın (kalıp, demir, vinç), Burak ince işlerin başında. */
export type Lead = 'ayse' | 'burak'

/** Cetvelin bir satırı ve örnek puantajdaki alışkanlığı. */
export interface SeedRow {
  key: string
  /** Satırın sırası: şefin sabah hangi dakikada bu satıra geldiği buradan çıkar. */
  index: number
  record: RosterRecord
  lead: Lead
  /** Bir iş gününde gelmeme olasılığı. */
  absence: number
  /** Listeye girdiği gün; işaretler o günden başlar. */
  since: string
  /** Beton dökülen akşam geç çıkan ekipten mi (kalıp, demir, vinç). */
  pour: boolean
}

// [anahtar, ad soyad, görevi, telefon, işaretleyen şef, gelmeme olasılığı, uygulamadaki hesabı]
type PersonRow = [string, string, string, string | null, Lead, number, PersonKey | null]

const PEOPLE: PersonRow[] = [
  ['ali', 'Ali Yılmaz', 'Kalıp ustası', '0500 000 12 01', 'ayse', 0.02, null],
  ['murat', 'Murat Demir', 'Demir ustası', '0500 000 12 02', 'ayse', 0.03, null],
  ['emre', 'Emre Kaya', 'Elektrik ustası', null, 'burak', 0.04, 'emre'],
  ['hasan', 'Hasan Koç', 'Kalıpçı', '0500 000 12 03', 'ayse', 0.05, null],
  ['ibrahim', 'İbrahim Arslan', 'Demirci', '0500 000 12 04', 'ayse', 0.05, null],
  ['yusuf', 'Yusuf Polat', 'Sıvacı', '0500 000 12 05', 'burak', 0.04, null],
  ['serkan', 'Serkan Güneş', 'Vinç operatörü', null, 'ayse', 0.03, 'serkan'],
  ['osman', 'Osman Kılıç', 'Düz işçi', null, 'ayse', 0.08, null],
  ['kadir', 'Kadir Öztürk', 'Düz işçi', '0500 000 12 06', 'burak', 0.09, null],
  ['cem', 'Cem Aksoy', 'Tesisatçı', '0500 000 12 07', 'burak', 0.05, null],
  ['musa', 'Musa Aydın', 'Düz işçi', null, 'ayse', 0.04, 'musa'],
]

// Ekipte ad ekip başınındır; İlerleme'de taşeronun adı olarak da görünür.
// [anahtar, ekip başı, iş kolu, telefon, işaretleyen şef, gelmeme olasılığı, kaç gün önce listeye girdi]
type CrewRow = [string, string, string, string, Lead, number, number]

const CREWS: CrewRow[] = [
  ['alci', 'Hüseyin Usta', 'Alçı', '0500 000 13 01', 'burak', 0.12, 45],
  ['kalip', 'Recep Usta', 'Kalıp', '0500 000 13 02', 'ayse', 0.06, 105],
  ['seramik', 'Nuri Usta', 'Seramik', '0500 000 13 03', 'burak', 0.15, 12],
  ['elektrik', 'Volkan Elektrik', 'Elektrik', '0500 000 13 04', 'burak', 0.12, 80],
  ['kaya', 'Kaya Demir', 'Demir', '0500 000 13 05', 'ayse', 0.06, 105],
]

// Uygulaması olmayan personel, firma uygulamaya geçtiği hafta listeye yazıldı.
const LISTED_DAYS_AGO = 105
const POUR_TEAM = new Set(['ali', 'murat', 'hasan', 'ibrahim', 'serkan', 'osman'])

type EntryFields = Pick<RosterRecord, 'kind' | 'name' | 'trade' | 'phone' | 'personId' | 'createdAt'>
type Habit = Pick<SeedRow, 'key' | 'lead' | 'absence'>

function seedRow(context: SeedContext, index: number, fields: EntryFields, habit: Habit): SeedRow {
  const record = { ...fields, id: fixedId(ID_GROUP.puantaj, index + 1), companyId: context.company.id, archived: false }
  return { ...habit, index, record, since: dayOf(fields.createdAt), pour: POUR_TEAM.has(habit.key) }
}

function personRow(row: PersonRow, index: number, context: SeedContext): SeedRow {
  const [key, name, trade, phone, lead, absence, account] = row
  // Uygulamadaki çalışanın kalemi katıldığı gün açıldı; adı ve numarası hesabından gelir.
  const person = account ? context.people[account] : null
  const createdAt = person?.createdAt ?? at(-LISTED_DAYS_AGO, '08:40')
  const fields = { kind: 'PERSON' as const, name, trade, phone, personId: person?.id ?? null, createdAt }
  return seedRow(context, index, fields, { key, lead, absence })
}

function crewRow(row: CrewRow, index: number, context: SeedContext): SeedRow {
  const [key, name, trade, phone, lead, absence, daysAgo] = row
  const fields = { kind: 'CREW' as const, name, trade, phone, personId: null, createdAt: at(-daysAgo, '08:40') }
  return seedRow(context, index, fields, { key, lead, absence })
}

/** Örnek cetvel: önce personel, sonra taşeron ekipler. Kimlikler sabittir; İlerleme'nin iş kalemleri ekiplere bağlanır. */
export function seedRoster(context: SeedContext): SeedRow[] {
  return [
    ...PEOPLE.map((row, index) => personRow(row, index, context)),
    ...CREWS.map((row, index) => crewRow(row, PEOPLE.length + index, context)),
  ]
}
