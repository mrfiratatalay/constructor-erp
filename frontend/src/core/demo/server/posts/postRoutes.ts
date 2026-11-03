import type { PostPage, PostView, SeenBy } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, DemoError, notFound } from '@/core/demo/server/demoError'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { get, post } from '@/core/demo/server/demoRouter'
import { companyPeople, requireMember } from '@/core/demo/server/demoSession'
import { markSeen, requireSite, seenAt } from '@/core/demo/server/sites/siteViews'
import { uploadedMedia } from './media'
import { postActionRoutes, requirePost } from './postActions'
import type { PostRecord } from './postRecords'
import { addPost, findPost } from './postStore'
import { postViewOf } from './postViews'

const DEFAULT_PAGE = 20
const SEARCH_LIMIT = 50

/** Sayfa imleci son gönderinin zamanıdır: yukarı kaydırdıkça bundan eskiler gelir. */
function pageOf(posts: PostRecord[], query: URLSearchParams): PostPage {
  const cursor = query.get('cursor')
  const limit = Number(query.get('limit') ?? DEFAULT_PAGE)
  const older = posts
    .filter((candidate) => !cursor || candidate.createdAt < cursor)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  const items = older.slice(0, limit)
  const nextCursor = older.length > limit ? (items.at(-1)?.createdAt ?? null) : null
  return { items: items.map(postViewOf), nextCursor }
}

function sitePosts(query: URLSearchParams): PostRecord[] {
  const { member, site } = requireSite(query.get('siteId') ?? '')
  return db().posts.filter((candidate) => candidate.siteId === site.id && candidate.companyId === member.company.id)
}

const flag = (value: string | undefined) => value === 'true'

/** Telefondaki kuyruk aynı gönderiyi iki kez yollayabilir (bağlantı koptu sandı): aynı kimlik ikinci kez yazılmaz. */
function alreadySent(id: string | undefined, authorId: string): PostRecord | undefined {
  const existing = id ? findPost(id) : undefined
  if (existing && existing.authorId !== authorId) throw new DemoError(409, 'Bu gönderi kimliği başka bir gönderiye ait.')
  return existing
}

function flagsOf(text: Record<string, string>) {
  return { issue: flag(text.issue), fieldUpdate: flag(text.fieldUpdate), replyToId: text.replyToId ?? null }
}

async function createPost({ form }: DemoRequest): Promise<PostView> {
  const { person } = requireMember()
  const { id, siteId, body } = form.text
  const existing = alreadySent(id, person.id)
  if (existing) return postViewOf(existing)
  const files = form.files.files ?? []
  if (!body?.trim() && files.length === 0) throw badRequest('Boş gönderi gönderilemez: fotoğraf, video, ses ya da yazı ekle.')
  const { site } = requireSite(siteId ?? '')
  const createdAt = nowIso()
  const input = { id, siteId: site.id, authorId: person.id, body: body?.trim() || null, createdAt }
  const created = addPost({ ...input, ...flagsOf(form.text), media: await uploadedMedia(files, createdAt) })
  markSeen(site.id, person.id, createdAt)
  return postViewOf(created)
}

/** "Bilgi": kim gördü, ne zaman. Yazan listede yoktur. */
function receipts({ params }: DemoRequest): SeenBy[] {
  const found = requirePost(params.postId!)
  return companyPeople(found.companyId)
    .filter((person) => person.id !== found.authorId)
    .map((person) => {
      const seen = seenAt(found.siteId, person.id)
      return { userId: person.id, fullName: person.fullName, seenAt: seen && seen >= found.createdAt ? seen : null }
    })
}

function pinned({ query }: DemoRequest): PostView[] {
  return sitePosts(query)
    .filter((candidate) => candidate.pin && !candidate.deletion)
    .sort((a, b) => (b.pin?.pinnedAt ?? '').localeCompare(a.pin?.pinnedAt ?? ''))
    .map(postViewOf)
}

const normalized = (text: string) => text.toLocaleLowerCase('tr').normalize('NFC')

/** Mesaj metninde arama; şantiye verilmezse firmanın bütün şantiyelerinde. */
function search({ query }: DemoRequest): PostView[] {
  const { company } = requireMember()
  const term = normalized(query.get('q') ?? '').trim()
  if (term.length < 2) return []
  const siteId = query.get('siteId')
  return db()
    .posts.filter((candidate) => candidate.companyId === company.id && !candidate.deletion)
    .filter((candidate) => !siteId || candidate.siteId === siteId)
    .filter((candidate) => normalized(candidate.body ?? '').includes(term))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, SEARCH_LIMIT)
    .map(postViewOf)
}

function getPost({ params }: DemoRequest): PostView {
  const found = findPost(params.postId!)
  if (!found || found.companyId !== requireMember().company.id) throw notFound('Gönderi')
  return postViewOf(found)
}

export const postRoutes = [
  get('/api/posts', ({ query }) => pageOf(sitePosts(query), query)),
  post('/api/posts', createPost),
  get('/api/posts/field-updates', ({ query }) => pageOf(sitePosts(query).filter((item) => item.fieldUpdate), query)),
  get('/api/posts/pinned', pinned),
  get('/api/posts/search', search),
  get('/api/posts/:postId', getPost),
  get('/api/posts/:postId/receipts', receipts),
  ...postActionRoutes,
]
