import type { HistoryEntryKind, ShipmentRowStatus, ShipmentRowType } from '@/core/api/generated/model'

/** Malzeme kartı: ad ve ana birim ("Çimento · Torba"). Silinmez, pasifleşir; geçmiş sevkiyatlarda adı yerinde kalır. */
export interface MaterialRecord {
  id: string
  companyId: string
  name: string
  unit: string
  active: boolean
  createdAt: string
}

/** Şirket dışındaki taraf: tedarikçi, müteahhit ya da kişi. Ayrı ekranı yoktur, formda yazılan ad kendiliğinden açılır. */
export interface PartyRecord {
  id: string
  companyId: string
  name: string
  createdAt: string
}

/**
 * Depo. Şantiye lokasyonu ayrıca saklanmaz: her şantiye kendi kimliğiyle bir stok yeridir. Gerçek backend'de ayrı bir
 * satırdır ve okurken eksikse açılır; demoda sonradan kurulan şantiye de böylece hemen seçilebilir.
 */
export interface DepotRecord {
  id: string
  companyId: string
  name: string
  createdAt: string
}

export interface ShipmentLineRecord {
  materialId: string
  quantity: number
}

/** Değişmez geçmişin bir satırı; iptalde nedeni, belgede dosya adı, düzeltmede eski ve yeni değer notta durur. */
export interface ShipmentEventRecord {
  kind: HistoryEntryKind
  actorId: string
  note: string | null
  at: string
}

/** İrsaliye: PDF ya da fotoğraf. Adres tarayıcıda doğrudan açılır. */
export interface DocumentRecord {
  id: string
  fileName: string
  contentType: string
  sizeBytes: number
  url: string
  createdById: string
  createdAt: string
}

/** Sevkiyatın şantiyenin Saha akışındaki izi. Gönderi yalnızca referanstır; kart durumu sevkiyattan okur. */
export interface FieldPostLink {
  postId: string
  siteId: string
}

/**
 * Bir sevkiyat bir kamyondur: tek hedef, tek irsaliye, birden çok kalem. Türü kullanıcı seçmez, iki ucundan hesaplanır.
 * Uçlardan biri boşsa orada yer yerine taraf (partyId) vardır. Kalemler, geçmiş ve belgeler kaydın içinde durur.
 */
export interface ShipmentRecord {
  id: string
  companyId: string
  number: number
  type: ShipmentRowType
  status: ShipmentRowStatus
  sourceId: string | null
  destinationId: string | null
  partyId: string | null
  expectsReturn: boolean
  returnOfId: string | null
  day: string
  description: string | null
  createdById: string
  createdAt: string
  lines: ShipmentLineRecord[]
  history: ShipmentEventRecord[]
  documents: DocumentRecord[]
  fieldPosts: FieldPostLink[]
}

/** Firmaların malzeme defteri: kartlar, taraflar, depolar ve sevkiyatlar. Stok saklanmaz, sevkiyatlardan hesaplanır. */
export interface MaterialsState {
  materials: MaterialRecord[]
  parties: PartyRecord[]
  depots: DepotRecord[]
  shipments: ShipmentRecord[]
}

/** Tohumlamadan önceki boş hali. */
export const emptyMaterials = (): MaterialsState => ({ materials: [], parties: [], depots: [], shipments: [] })
