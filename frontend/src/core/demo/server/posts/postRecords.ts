import type { MediaViewKind } from '@/core/api/generated/model'

/** Fotoğraf, video, ses ya da belge. Demoda dosyalar pakete gömülü görsellerdir ya da tarayıcıdaki yüklemedir. */
export interface MediaRecord {
  id: string
  kind: MediaViewKind
  url: string
  thumbnailUrl: string | null
  fileName: string | null
  sizeBytes: number
  durationSeconds: number | null
  createdAt: string
}

export interface PostRecord {
  id: string
  companyId: string
  siteId: string
  authorId: string
  body: string | null
  issue: boolean
  fieldUpdate: boolean
  createdAt: string
  media: MediaRecord[]
  replyToId: string | null
  forwarded: boolean
  editedAt: string | null
  deletion: { deletedAt: string; deletedById: string } | null
  pin: { pinnedAt: string; pinnedById: string } | null
  resolution: { resolvedAt: string; resolvedById: string; note: string | null } | null
}
