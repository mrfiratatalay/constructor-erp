import type { MemberViewRole } from '@/core/api/generated/model'
import { at } from '@/core/demo/server/demoClock'
import type { CompanyRecord, PersonRecord } from '@/core/demo/server/people/peopleRecords'
import { fixedId, ID_GROUP, type PersonKey } from './seedContext'

/**
 * Demo firması: Atalay Yapı (Trabzon). Hiçbir kişi, telefon ya da e-posta gerçek değildir: alan adları ".test"
 * (RFC 2606, hiçbir zaman gerçek olmaz), telefonlar 0500 000 … biçiminde yer tutucudur.
 */
export function seedCompany(): CompanyRecord {
  return {
    id: fixedId(ID_GROUP.company, 1),
    name: 'Atalay Yapı',
    slug: 'atalay-yapi',
    phone: '0462 000 00 00',
    email: 'info@atalayyapi.test',
    city: 'Trabzon',
    logoUrl: null,
    status: 'ACTIVE',
    lockReason: null,
    joinToken: 'atalay-yapi-katilim',
    setupCompleted: true,
    createdAt: at(-120, '10:00'),
  }
}

type PersonRow = [PersonKey, string, MemberViewRole | null, string | null, string, number]

// [anahtar, ad, rol, telefon, e-posta, kaç gün önce katıldı]
const PEOPLE: PersonRow[] = [
  ['kemal', 'Kemal Atalay', 'OWNER', '0500 000 10 20', 'kemal@atalayyapi.test', 120],
  ['ayse', 'Ayşe Kara', 'SITE_LEAD', '0500 000 11 01', 'ayse@atalayyapi.test', 110],
  ['burak', 'Burak Yıldız', 'SITE_LEAD', '0500 000 11 04', 'burak@atalayyapi.test', 95],
  ['mehmet', 'Mehmet Şahin', 'WAREHOUSE', '0500 000 11 02', 'mehmet@atalayyapi.test', 100],
  ['musa', 'Musa Aydın', 'WORKER', '0500 000 11 03', 'musa@atalayyapi.test', 60],
  ['emre', 'Emre Kaya', 'WORKER', '0500 000 11 05', 'emre@atalayyapi.test', 40],
  ['serkan', 'Serkan Güneş', 'WORKER', '0500 000 11 06', 'serkan@atalayyapi.test', 21],
  ['admin', 'Fırat Atalay', null, null, 'admin@constructor-erp.test', 150],
]

export function seedPeople(company: CompanyRecord): Record<PersonKey, PersonRecord> {
  const entries = PEOPLE.map(([key, fullName, role, phone, email, daysAgo], index): [PersonKey, PersonRecord] => [
    key,
    {
      id: fixedId(ID_GROUP.person, index + 1),
      companyId: role ? company.id : null,
      fullName,
      phone,
      email,
      role,
      platformAdmin: role === null,
      active: true,
      createdAt: at(-daysAgo, '09:00'),
      lastSeenAt: at(-1, '18:40'),
      loginToken: null,
      password: null,
    },
  ])
  return Object.fromEntries(entries) as Record<PersonKey, PersonRecord>
}
