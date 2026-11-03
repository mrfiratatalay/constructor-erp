import type { CorrectPostRequest, ForwardPostRequest, PostView } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, DemoError, forbidden, notFound } from '@/core/demo/server/demoError'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { del, patch, post, put } from '@/core/demo/server/demoRouter'
import { requireMember } from '@/core/demo/server/demoSession'
import { requireSite } from '@/core/demo/server/sites/siteViews'
import type { PostRecord } from './postRecords'
import { addPost, findPost } from './postStore'
import { postViewOf } from './postViews'

const MAX_PINNED = 3

export function requirePost(postId: string): PostRecord {
  const found = findPost(postId)
  if (!found || found.companyId !== requireMember().company.id) throw notFound('Gönderi')
  return found
}

function requireLive(postId: string, refusal: string): PostRecord {
  const found = requirePost(postId)
  if (found.deletion) throw new DemoError(409, refusal)
  return found
}

/** Düzeltmenin süre sınırı yok; eski metin saklanmaz, mesajda yalnızca "düzenlendi" yazar. */
function correct({ params, body }: DemoRequest): PostView {
  const found = requireLive(params.postId!, 'Silinmiş gönderi düzeltilemez.')
  if (found.authorId !== requireMember().person.id) throw forbidden('Yalnızca kendi gönderini düzeltebilirsin.')
  const form = body as CorrectPostRequest
  const text = form.body?.trim() || null
  if (!text && found.media.length === 0) throw badRequest('Gönderi boş kalamaz: yazıyı silmek yerine gönderiyi sil.')
  Object.assign(found, { body: text, issue: form.issue, editedAt: nowIso() })
  return postViewOf(found)
}

function remove({ params }: DemoRequest): PostView {
  const found = requireLive(params.postId!, 'Bu gönderi zaten silinmiş.')
  const { person } = requireMember()
  if (found.authorId !== person.id) throw forbidden('Yalnızca kendi gönderini silebilirsin.')
  found.deletion = { deletedAt: nowIso(), deletedById: person.id }
  found.pin = null
  return postViewOf(found)
}

/** Herkes sabitler; bir şantiyede en fazla üç mesaj, kaldırılana kadar. */
function pin({ params }: DemoRequest): PostView {
  const found = requireLive(params.postId!, 'Silinmiş mesaj sabitlenemez.')
  if (found.pin) return postViewOf(found)
  const pinnedHere = db().posts.filter((candidate) => candidate.siteId === found.siteId && candidate.pin).length
  if (pinnedHere >= MAX_PINNED) throw new DemoError(409, `Bir şantiyede en fazla ${MAX_PINNED} mesaj sabitlenebilir.`)
  found.pin = { pinnedAt: nowIso(), pinnedById: requireMember().person.id }
  return postViewOf(found)
}

function unpin({ params }: DemoRequest): PostView {
  const found = requirePost(params.postId!)
  found.pin = null
  return postViewOf(found)
}

/** Sohbetteki bir mesaj "Sahaya ekle" ile şantiyenin günlüğüne alınır; ayrı kayıt değil, gönderinin işareti. */
function setField(postId: string, fieldUpdate: boolean): PostView {
  const found = fieldUpdate ? requireLive(postId, "Silinmiş mesaj Saha'ya eklenemez.") : requirePost(postId)
  found.fieldUpdate = fieldUpdate
  return postViewOf(found)
}

function forward({ params, body }: DemoRequest): PostView {
  const found = requireLive(params.postId!, 'Silinmiş mesaj iletilemez.')
  const { site } = requireSite((body as ForwardPostRequest).siteId)
  const copy = { siteId: site.id, authorId: requireMember().person.id, body: found.body, media: found.media }
  return postViewOf(addPost({ ...copy, forwarded: true }))
}

export const postActionRoutes = [
  patch('/api/posts/:postId', correct),
  del('/api/posts/:postId', remove),
  put('/api/posts/:postId/pin', pin),
  del('/api/posts/:postId/pin', unpin),
  put('/api/posts/:postId/field', ({ params }) => setField(params.postId!, true)),
  del('/api/posts/:postId/field', ({ params }) => setField(params.postId!, false)),
  post('/api/posts/:postId/forward', forward),
]
