import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { notFound } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { MediaRecord, PostRecord } from './postRecords'

/** Yeni gönderinin değişen alanları; gerisi sohbetteki sıradan bir mesajın varsayılanıdır. */
export interface NewPost {
  siteId: string
  authorId: string
  body: string | null
  id?: string
  createdAt?: string
  media?: MediaRecord[]
  issue?: boolean
  fieldUpdate?: boolean
  replyToId?: string | null
  forwarded?: boolean
}

export function newPostRecord(input: NewPost, companyId: string): PostRecord {
  return {
    id: input.id ?? newId(),
    companyId,
    siteId: input.siteId,
    authorId: input.authorId,
    body: input.body,
    issue: input.issue ?? false,
    fieldUpdate: input.fieldUpdate ?? false,
    createdAt: input.createdAt ?? nowIso(),
    media: input.media ?? [],
    replyToId: input.replyToId ?? null,
    forwarded: input.forwarded ?? false,
    editedAt: null,
    deletion: null,
    pin: null,
    resolution: null,
  }
}

/**
 * Gönderiyi şantiyenin sohbetine ekler. Başka modüller de kullanır: İlerleme'nin "Saha'ya yansıt"ı, sevkiyatın Saha
 * kartı. Gerçek backend'de de bunlar ayrı bir kayıt değil, işaretli birer gönderidir.
 */
export function addPost(input: NewPost): PostRecord {
  const site = db().sites.find((candidate) => candidate.id === input.siteId)
  if (!site) throw notFound('Şantiye')
  const post = newPostRecord(input, site.companyId)
  db().posts.push(post)
  return post
}

export function findPost(postId: string): PostRecord | undefined {
  return db().posts.find((post) => post.id === postId)
}

/** Gönderiyi "silindi" yapar; sohbette "Bu mesaj silindi" satırı kalır (WhatsApp'taki gibi). */
export function retractPost(postId: string, byId: string): void {
  const post = findPost(postId)
  if (post && !post.deletion) post.deletion = { deletedAt: nowIso(), deletedById: byId }
}
