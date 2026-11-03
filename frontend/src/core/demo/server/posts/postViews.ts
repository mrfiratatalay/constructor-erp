import type { MediaView, PostQuote, PostView } from '@/core/api/generated/model'
import { db } from '@/core/demo/server/demoDb'
import { companyPeople, personById, personName } from '@/core/demo/server/demoSession'
import { seenAt } from '@/core/demo/server/sites/siteViews'
import type { MediaRecord, PostRecord } from './postRecords'
import { findPost } from './postStore'

export function mediaViewOf(media: MediaRecord): MediaView {
  const { id, kind, url, thumbnailUrl, fileName, sizeBytes, durationSeconds, createdAt } = media
  return { id, kind, status: 'READY', url, thumbnailUrl, fileName, sizeBytes, durationSeconds, createdAt }
}

function quoteOf(replyToId: string | null): PostQuote | undefined {
  const quoted = replyToId ? findPost(replyToId) : undefined
  if (!quoted) return undefined
  const first = quoted.deletion ? undefined : quoted.media[0]
  return {
    id: quoted.id,
    authorName: personName(quoted.authorId),
    body: quoted.deletion ? null : quoted.body,
    mediaKind: first?.kind ?? null,
    thumbnailUrl: first?.thumbnailUrl ?? null,
    deleted: quoted.deletion !== null,
  }
}

/** Mavi çift tik: yazan dışındaki herkes şantiyeyi bu mesajdan sonra açmış. */
function seenByAll(post: PostRecord): boolean {
  const others = companyPeople(post.companyId).filter((person) => person.id !== post.authorId)
  return others.every((person) => (seenAt(post.siteId, person.id) ?? '') >= post.createdAt)
}

function siteRef(siteId: string) {
  const site = db().sites.find((candidate) => candidate.id === siteId)
  return { id: siteId, name: site?.name ?? 'Şantiye' }
}

/** Silinen mesajın içeriği gösterilmez; yerinde "Bu mesaj silindi" satırı kalır. */
export function postViewOf(post: PostRecord): PostView {
  const deleted = post.deletion !== null
  const author = personById(post.authorId)
  return {
    id: post.id,
    site: siteRef(post.siteId),
    author: { id: post.authorId, fullName: author?.fullName ?? 'Eski çalışan', phone: author?.phone ?? null },
    body: deleted ? null : post.body,
    issue: post.issue,
    createdAt: post.createdAt,
    media: deleted ? [] : post.media.map(mediaViewOf),
    resolution: post.resolution
      ? { ...post.resolution, resolvedByName: personName(post.resolution.resolvedById) }
      : undefined,
    editedAt: post.editedAt,
    deletion: post.deletion ? { deletedAt: post.deletion.deletedAt, deletedByName: personName(post.deletion.deletedById) } : undefined,
    replyTo: quoteOf(post.replyToId),
    forwarded: post.forwarded,
    pin: post.pin ? { pinnedAt: post.pin.pinnedAt, pinnedByName: personName(post.pin.pinnedById) } : undefined,
    seenByAll: seenByAll(post),
    fieldUpdate: post.fieldUpdate,
  }
}

/** Şantiyenin silinmemiş gönderileri, eskiden yeniye. */
export function livePosts(siteId: string): PostRecord[] {
  return db()
    .posts.filter((post) => post.siteId === siteId && !post.deletion)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}
