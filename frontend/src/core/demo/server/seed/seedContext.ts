import type { DemoDatabase } from '@/core/demo/server/demoDb'
import type { CompanyRecord, PersonRecord } from '@/core/demo/server/people/peopleRecords'
import type { SiteRecord } from '@/core/demo/server/sites/siteRecords'

export type PersonKey = 'kemal' | 'ayse' | 'burak' | 'mehmet' | 'musa' | 'emre' | 'serkan' | 'admin'
export type SiteKey = 'yomra' | 'kasustu' | 'sahil' | 'akcaabat'

/** Modüllerin örnek verisi bu ortak kişilere ve şantiyelere bağlanır: "Ayşe Şef, Yomra Park'ta yoklama aldı". */
export interface SeedContext {
  company: CompanyRecord
  people: Record<PersonKey, PersonRecord>
  sites: Record<SiteKey, SiteRecord>
}

/** Bir modülün örnek verisini taslak veritabanına yazar. Başka modülün dilimine de yazabilir (ör. Saha gönderisi). */
export type Seed = (draft: DemoDatabase, context: SeedContext) => void

/**
 * Örnek kayıtların kimliği sabittir: veri ertesi gün yeniden üretildiğinde açık oturum ve adres çubuğundaki
 * şantiye adresi geçerli kalır. Biçim gerçek bir UUID'dir. Grup, kaydın türüdür (2 kişi, 3 şantiye …).
 */
export function fixedId(group: number, index: number): string {
  return `00000000-0000-4000-8${String(group).padStart(3, '0')}-${String(index).padStart(12, '0')}`
}

/** Grup numaraları; her modül kendi aralığını kullanır, kimlikler çakışmaz. */
export const ID_GROUP = {
  company: 1,
  person: 2,
  site: 3,
  post: 4,
  media: 5,
  siteEvent: 6,
  task: 7,
  puantaj: 10,
  materials: 20,
  production: 30,
  platform: 40,
  otherCompany: 50,
} as const
