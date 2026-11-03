import type {
  CreateSiteRequest,
  MediaView,
  SiteEventView,
  SiteView,
  SiteVisitView,
  UpdateSiteRequest,
} from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, DemoError } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { del, get, post, put } from '@/core/demo/server/demoRouter'
import { requireMember } from '@/core/demo/server/demoSession'
import { uploadedMedia } from '@/core/demo/server/posts/media'
import { livePosts, mediaViewOf } from '@/core/demo/server/posts/postViews'
import { markSeen, requireSite, siteEventViewOf, siteViewOf } from './siteViews'

const MAX_PINS = 3

function listSites(): SiteView[] {
  const { company } = requireMember()
  return db()
    .sites.filter((site) => site.companyId === company.id)
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    .map(siteViewOf)
}

/** Şantiye kurmak grup kurmaktır: firmadaki herkes kurar, akışın başına "… şantiyeyi kurdu" yazılır. */
function createSite({ body }: DemoRequest): SiteView {
  const { person, company } = requireMember()
  const form = body as CreateSiteRequest
  if (!form.name.trim()) throw badRequest('Şantiyenin adını yaz.')
  const createdAt = nowIso()
  const site = {
    id: newId(),
    companyId: company.id,
    name: form.name.trim(),
    address: form.address?.trim() || null,
    status: 'ACTIVE' as const,
    photoUrl: null,
    photoThumbnailUrl: null,
    createdAt,
    createdById: person.id,
  }
  db().sites.push(site)
  db().siteEvents.push({ id: newId(), siteId: site.id, kind: 'CREATED', actorId: person.id, subjectId: null, createdAt })
  return siteViewOf(site)
}

function updateSite({ params, body }: DemoRequest): SiteView {
  const { site } = requireSite(params.siteId!)
  const form = body as UpdateSiteRequest
  if (!form.name.trim()) throw badRequest('Şantiyenin adını yaz.')
  Object.assign(site, { name: form.name.trim(), address: form.address?.trim() || null, status: form.status })
  return siteViewOf(site)
}

async function changePhoto({ params, form }: DemoRequest): Promise<void> {
  const { site } = requireSite(params.siteId!)
  const [photo] = await uploadedMedia(form.files.file ?? [], nowIso())
  if (!photo || photo.kind !== 'PHOTO') throw badRequest('Şantiye fotoğrafı bir resim olmalı.')
  Object.assign(site, { photoUrl: photo.url, photoThumbnailUrl: photo.thumbnailUrl })
}

function clearPhoto({ params }: DemoRequest): void {
  Object.assign(requireSite(params.siteId!).site, { photoUrl: null, photoThumbnailUrl: null })
}

/** Sabitleme kişiye özeldir (WhatsApp'taki gibi), en fazla üç şantiye. */
function pinSite({ params }: DemoRequest): void {
  const { member, site } = requireSite(params.siteId!)
  const mine = db().sitePins.filter((pin) => pin.personId === member.person.id)
  if (mine.some((pin) => pin.siteId === site.id)) return
  if (mine.length >= MAX_PINS) throw new DemoError(409, `En fazla ${MAX_PINS} şantiye sabitlenebilir.`)
  db().sitePins.push({ siteId: site.id, personId: member.person.id, pinnedAt: nowIso() })
}

function unpinSite({ params }: DemoRequest): void {
  const { member, site } = requireSite(params.siteId!)
  const keep = (pin: { siteId: string; personId: string }) => pin.siteId !== site.id || pin.personId !== member.person.id
  db().sitePins = db().sitePins.filter(keep)
}

function listEvents({ params }: DemoRequest): SiteEventView[] {
  const { site } = requireSite(params.siteId!)
  return db()
    .siteEvents.filter((event) => event.siteId === site.id)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map(siteEventViewOf)
}

/** Şantiyenin medya ve belgeleri, en yeni önce: "Medya ve belgeler" ekranı. */
function library({ params }: DemoRequest): MediaView[] {
  const { site } = requireSite(params.siteId!)
  return livePosts(site.id)
    .flatMap((candidate) => candidate.media)
    .reverse()
    .map(mediaViewOf)
}

function visit({ params }: DemoRequest): SiteVisitView {
  const { member, site } = requireSite(params.siteId!)
  return { previousSeenAt: markSeen(site.id, member.person.id, nowIso()) }
}

export const siteRoutes = [
  get('/api/sites', listSites),
  post('/api/sites', createSite),
  get('/api/sites/:siteId', ({ params }) => siteViewOf(requireSite(params.siteId!).site)),
  put('/api/sites/:siteId', updateSite),
  put('/api/sites/:siteId/photo', changePhoto),
  del('/api/sites/:siteId/photo', clearPhoto),
  put('/api/sites/:siteId/pin', pinSite),
  del('/api/sites/:siteId/pin', unpinSite),
  get('/api/sites/:siteId/events', listEvents),
  get('/api/sites/:siteId/library', library),
  post('/api/sites/:siteId/visits', visit),
]
