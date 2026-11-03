import type { SiteToday, TodayView } from '@/core/api/generated/model'
import { at, today } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { get } from '@/core/demo/server/demoRouter'
import { requireMember } from '@/core/demo/server/demoSession'
import type { PersonRecord } from '@/core/demo/server/people/peopleRecords'
import { livePosts, postViewOf } from '@/core/demo/server/posts/postViews'
import type { SiteRecord } from './siteRecords'
import { seenAt, siteEventViewOf, siteViewOf } from './siteViews'

const RECENT_PHOTOS = 4

/** Listede yalnızca kuruluş satırı sayılır: katıldı satırları her şantiyeye birden düşer, sırayı bozardı. */
function createdEvent(siteId: string) {
  const event = db().siteEvents.find((candidate) => candidate.siteId === siteId && candidate.kind === 'CREATED')
  return event ? siteEventViewOf(event) : undefined
}

function siteToday(site: SiteRecord, viewer: PersonRecord, startOfDay: string): SiteToday {
  const posts = livePosts(site.id)
  const todays = posts.filter((candidate) => candidate.createdAt >= startOfDay)
  const since = seenAt(site.id, viewer.id) ?? startOfDay
  const issues = posts.filter((candidate) => candidate.issue && !candidate.resolution)
  const photos = posts.flatMap((candidate) => candidate.media).filter((media) => media.kind === 'PHOTO')
  const latest = posts.at(-1)
  return {
    siteId: site.id,
    name: site.name,
    leads: siteViewOf(site).leads,
    lastPostAt: latest?.createdAt ?? null,
    latestPost: latest ? postViewOf(latest) : undefined,
    postsToday: todays.length,
    photosToday: todays.flatMap((candidate) => candidate.media).filter((media) => media.kind === 'PHOTO').length,
    unreadPosts: posts.filter((candidate) => candidate.authorId !== viewer.id && candidate.createdAt > since).length,
    openIssues: issues.length,
    oldestOpenIssueAt: issues[0]?.createdAt ?? null,
    noNewsToday: todays.length === 0,
    recentPhotoUrls: photos.slice(-RECENT_PHOTOS).map((media) => media.thumbnailUrl ?? media.url),
    latestEvent: createdEvent(site.id),
    pinnedAt: db().sitePins.find((pin) => pin.siteId === site.id && pin.personId === viewer.id)?.pinnedAt ?? null,
    photoThumbnailUrl: site.photoThumbnailUrl,
  }
}

/** Önce açık sorunu olanlar, sonra okunmamışı olanlar, sonra sessizler (backend'deki ATTENTION_FIRST). */
function attentionFirst(a: SiteToday, b: SiteToday): number {
  const keys = (site: SiteToday) => [site.openIssues === 0, site.unreadPosts === 0, !site.noNewsToday]
  const [left, right] = [keys(a), keys(b)]
  const differs = left.findIndex((value, index) => value !== right[index])
  if (differs >= 0) return Number(left[differs]) - Number(right[differs])
  return (b.lastPostAt ?? '').localeCompare(a.lastPostAt ?? '')
}

function todayView(): TodayView {
  const { person, company } = requireMember()
  const startOfDay = at(0, '00:00')
  const sites = db()
    .sites.filter((site) => site.companyId === company.id && site.status === 'ACTIVE')
    .map((site) => siteToday(site, person, startOfDay))
    .sort(attentionFirst)
  const sum = (pick: (site: SiteToday) => number) => sites.reduce((total, site) => total + pick(site), 0)
  return {
    date: today(),
    totals: {
      activeSites: sites.length,
      postsToday: sum((site) => site.postsToday),
      photosToday: sum((site) => site.photosToday),
      openIssues: sum((site) => site.openIssues),
      sitesWithoutNews: sites.filter((site) => site.noNewsToday).length,
    },
    sites,
  }
}

export const todayRoutes = [get('/api/today', todayView)]
