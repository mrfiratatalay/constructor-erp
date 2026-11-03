import { at, isPast, nowIso } from '@/core/demo/server/demoClock'
import type { DemoDatabase } from '@/core/demo/server/demoDb'
import { fixedId, ID_GROUP, type Seed, type SeedContext } from '@/core/demo/server/seed/seedContext'
import { photoMedia } from './media'
import type { PostRecord } from './postRecords'
import { newPostRecord } from './postStore'
import { AKCAABAT, KASUSTU, SAHIL, YOMRA, type ThreadMessage } from './postThreads'

const when = ([day, time]: [number, string]) => at(day, time)

function details(message: ThreadMessage, post: PostRecord, context: SeedContext): void {
  const author = context.people[message.by].id
  if (message.pinned) post.pin = { pinnedAt: post.createdAt, pinnedById: author }
  if (message.edited) post.editedAt = at(message.at[0], '13:18')
  if (message.deleted) post.deletion = { deletedAt: post.createdAt, deletedById: author }
  const resolved = message.resolved
  if (resolved && isPast(when(resolved.at))) {
    post.resolution = { resolvedAt: when(resolved.at), resolvedById: context.people[resolved.by].id, note: resolved.note }
  }
}

function postOf(message: ThreadMessage, index: number, context: SeedContext): PostRecord {
  const createdAt = when(message.at)
  const media = (message.photos ?? []).map((name, order) => photoMedia(name, createdAt, fixedId(ID_GROUP.media, index * 10 + order)))
  const input = {
    id: fixedId(ID_GROUP.post, index),
    siteId: context.sites[message.site].id,
    authorId: context.people[message.by].id,
    body: message.body ?? null,
    createdAt,
    media,
    issue: message.issue,
    fieldUpdate: message.field,
    forwarded: message.forwarded,
  }
  const post = newPostRecord(input, context.company.id)
  details(message, post, context)
  return post
}

/** Bir şantiyenin mesajları; saati henüz gelmemiş bugünkü mesajlar atlanır (demo sabah açılırsa öğleden sonrası yok). */
function seedThread(draft: DemoDatabase, thread: ThreadMessage[], context: SeedContext): void {
  const ids: (string | null)[] = []
  for (const message of thread) {
    if (!isPast(when(message.at))) {
      ids.push(null)
      continue
    }
    const post = postOf(message, draft.posts.length + 1, context)
    post.replyToId = message.reply === undefined ? null : (ids[message.reply] ?? null)
    ids.push(post.id)
    draft.posts.push(post)
  }
}

/** Patron bir şantiyeyi en son kendi mesajını yazarken açmış; sonrasında gelenler onun için okunmamış. */
function ownerSeenAt(draft: DemoDatabase, siteId: string, ownerId: string): string {
  const own = draft.posts.filter((post) => post.siteId === siteId && post.authorId === ownerId).at(-1)
  return own?.createdAt ?? at(-1, '19:00')
}

/**
 * Kim şantiyeyi en son ne zaman açtı. Ekip bugün öğlene kadar her şeyi görmüş; patronun listesinde okunmamış
 * sayıları, ekibin mesajlarında da (patron henüz görmediği için) gri tik görünür.
 */
function seedVisits(draft: DemoDatabase, context: SeedContext): void {
  const lunch = at(0, '12:30')
  const seen = isPast(lunch) ? lunch : nowIso()
  const owner = context.people.kemal.id
  for (const site of Object.values(context.sites)) {
    for (const person of Object.values(context.people).filter((candidate) => candidate.companyId)) {
      const seenAt = person.id === owner ? ownerSeenAt(draft, site.id, owner) : seen
      draft.visits.push({ siteId: site.id, personId: person.id, seenAt })
    }
  }
}

export const seedPosts: Seed = (draft, context) => {
  for (const thread of [AKCAABAT, YOMRA, KASUSTU, SAHIL]) seedThread(draft, thread, context)
  seedVisits(draft, context)
  draft.sitePins.push({ siteId: context.sites.yomra.id, personId: context.people.kemal.id, pinnedAt: at(-30, '09:00') })
}
