import type { SiteEventView } from '@/core/api/generated/model'
import { accusative } from '@/core/format/names'

/** Fiilin kime göre çekimi: yapan (3. tekil / sen) ve yapanı bilinmeyen (edilgen) hâlleri. */
const VERBS = {
  MEMBER_ADDED: { third: 'ekledi', you: 'ekledin', passive: 'eklendi', passiveYou: 'eklendin' },
  MEMBER_REMOVED: { third: 'çıkardı', you: 'çıkardın', passive: 'çıkarıldı', passiveYou: 'çıkarıldın' },
} as const

function createdLine(actor: string | null): string {
  if (!actor) return 'Şantiye kuruldu'
  return actor === 'Sen' ? 'Şantiyeyi sen kurdun' : `${actor} şantiyeyi kurdu`
}

function memberLine(event: SiteEventView, actor: string | null, viewerId?: string): string {
  const verb = VERBS[event.kind as keyof typeof VERBS]
  const subjectIsYou = event.subjectId === viewerId
  const subject = event.subjectName ?? 'Bir kişi'
  if (!actor) return subjectIsYou ? `Sen ${verb.passiveYou}` : `${subject} ${verb.passive}`
  if (subjectIsYou) return `${actor} seni ${verb.third}`
  return `${actor}, ${accusative(subject)} ${actor === 'Sen' ? verb.you : verb.third}`
}

/**
 * Akıştaki sistem satırı, WhatsApp'taki gibi kim kime ne yaptı: "Patron, Musa Kusbey'i ekledi",
 * "Patron seni ekledi", "Sen, Ali'yi çıkardın". Yapanı bilinmeyen eski kayıtta: "Musa Kusbey eklendi".
 */
export function eventLine(event: SiteEventView, viewerId?: string): string {
  const actor = event.actorId && event.actorId === viewerId ? 'Sen' : (event.actorName ?? null)
  return event.kind === 'CREATED' ? createdLine(actor) : memberLine(event, actor, viewerId)
}
