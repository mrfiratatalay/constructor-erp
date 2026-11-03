import type { SiteViewStatus } from '@/core/api/generated/model'
import { PHOTOS, type PhotoName } from '@/core/demo/media/demoPhotos'
import { at } from '@/core/demo/server/demoClock'
import type { PersonRecord } from '@/core/demo/server/people/peopleRecords'
import type { SiteEventRecord, SiteRecord } from '@/core/demo/server/sites/siteRecords'
import { fixedId, ID_GROUP, type PersonKey, type SeedContext, type SiteKey } from './seedContext'

type SiteRow = [SiteKey, string, string, SiteViewStatus, PhotoName | null, number]

// [anahtar, ad, adres, durum, kapak fotoğrafı, kaç gün önce kuruldu]
const SITES: SiteRow[] = [
  ['yomra', 'Yomra Park Konutları', 'Kaşüstü Mah. Sahil Yolu, Yomra / Trabzon', 'ACTIVE', 'yomra', 75],
  ['kasustu', 'Kaşüstü Rezidans', 'Kaşüstü Mah. Akyazı Cad., Yomra / Trabzon', 'ACTIVE', 'kasustu', 52],
  ['sahil', 'Sahil Evleri', 'Sahil Mah. Liman Yolu, Arsin / Trabzon', 'ACTIVE', 'sahil', 118],
  ['akcaabat', 'Akçaabat Villaları', 'Söğütlü Mah. Sahil Cad., Akçaabat / Trabzon', 'COMPLETED', null, 115],
]

export function seedSites(companyId: string, owner: PersonRecord): Record<SiteKey, SiteRecord> {
  const entries = SITES.map(([key, name, address, status, photo, daysAgo], index): [SiteKey, SiteRecord] => [
    key,
    {
      id: fixedId(ID_GROUP.site, index + 1),
      companyId,
      name,
      address,
      status,
      photoUrl: photo ? PHOTOS[photo].url : null,
      photoThumbnailUrl: photo ? PHOTOS[photo].thumbnailUrl : null,
      createdAt: at(-daysAgo, '09:30'),
      createdById: owner.id,
    },
  ])
  return Object.fromEntries(entries) as Record<SiteKey, SiteRecord>
}

// Bağlantıyla katılanlar: gerçek backend katılımı her şantiyenin sohbetine "X davet bağlantısıyla katıldı" diye yazar.
const JOINED: PersonKey[] = ['musa', 'emre', 'serkan']

/** Her şantiyenin "kuruldu" satırı ve sonradan katılanların satırları. */
export function seedSiteEvents(context: SeedContext): SiteEventRecord[] {
  const events: SiteEventRecord[] = []
  for (const site of Object.values(context.sites)) {
    const created = { siteId: site.id, kind: 'CREATED' as const, actorId: site.createdById, subjectId: null }
    events.push({ ...created, id: fixedId(ID_GROUP.siteEvent, events.length + 1), createdAt: site.createdAt })
    for (const key of JOINED) {
      const person = context.people[key]
      if (person.createdAt < site.createdAt) continue
      const joined = { siteId: site.id, kind: 'MEMBER_JOINED' as const, actorId: person.id, subjectId: person.id }
      events.push({ ...joined, id: fixedId(ID_GROUP.siteEvent, events.length + 1), createdAt: person.createdAt })
    }
  }
  return events
}
