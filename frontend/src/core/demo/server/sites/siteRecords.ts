import type { SiteEventViewKind, SiteViewStatus } from '@/core/api/generated/model'

export interface SiteRecord {
  id: string
  companyId: string
  name: string
  address: string | null
  status: SiteViewStatus
  photoUrl: string | null
  photoThumbnailUrl: string | null
  createdAt: string
  createdById: string
}

/** Sohbetteki sistem satırları: "Şantiye kuruldu", "Musa davet bağlantısıyla katıldı". */
export interface SiteEventRecord {
  id: string
  siteId: string
  kind: SiteEventViewKind
  actorId: string | null
  subjectId: string | null
  createdAt: string
}

/** Kişinin şantiyeyi en son ne zaman açtığı: okunmamış sayısı ve mavi tikler buradan hesaplanır. */
export interface VisitRecord {
  siteId: string
  personId: string
  seenAt: string
}

/** Listede sabitlenmiş şantiye (kişiye özel, en fazla 3). */
export interface SitePinRecord {
  siteId: string
  personId: string
  pinnedAt: string
}
