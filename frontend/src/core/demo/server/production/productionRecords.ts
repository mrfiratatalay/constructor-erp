import type { MediaRecord } from '@/core/demo/server/posts/postRecords'

/**
 * Şantiyede takip edilen bir iş kalemi: "Demir İşleri · Kaya Demir · 120 ton". Gerçekleşen miktar burada durmaz,
 * girişlerin toplamıdır. Taşeron, yoklamanın ekibidir (puantaj.roster'daki CREW satırı).
 */
export interface ProductionItemRecord {
  id: string
  companyId: string
  siteId: string
  trade: string
  title: string | null
  crewId: string | null
  totalQuantity: number
  unit: string
  startDate: string | null
  plannedEnd: string | null
  note: string | null
  createdById: string
  createdAt: string
}

/**
 * Bir iş kaleminin günlük girişi: "28 Eylül · +3,5 ton". postId: Saha'ya yansıtıldıysa gönderisi, giriş silinince
 * geri çekilir. Dosyalar girişin kendisinde durur: Saha'daki gönderi silinse de kanıt iş kaleminde kalır.
 */
export interface ProductionEntryRecord {
  id: string
  itemId: string
  companyId: string
  siteId: string
  day: string
  quantity: number
  workerCount: number | null
  note: string | null
  postId: string | null
  media: MediaRecord[]
  createdById: string
  createdAt: string
}

/** Silinen iş kalemi ve giriş diziden çıkar: gerçek backend kaydını saklar ama hiçbir ekran onu göstermez. */
export interface ProductionState {
  items: ProductionItemRecord[]
  entries: ProductionEntryRecord[]
}

/** Tohumlamadan önceki boş hali. */
export const emptyProduction = (): ProductionState => ({ items: [], entries: [] })

/** Ekranda yazan ad: özel ad verildiyse o, yoksa türü. */
export const itemName = (item: ProductionItemRecord): string => item.title ?? item.trade
