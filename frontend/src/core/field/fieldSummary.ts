import type { MediaView } from '@/core/api/generated/model'
import type { FieldDay } from '@/core/field/fieldDays'
import { clockTime, daysAgo, listMoment } from '@/core/format/dates'
import { firstName } from '@/core/format/names'

/** Saha sekmesinin en üstündeki geniş görsel ve üzerindeki satırlar. */
export interface FieldSummary {
  photoUrl: string | null
  title: string
  lastUpdate: string
  todayCount: string | null
}

/** Görüntünün kapağı: fotoğrafın kendisi, videonun ilk karesi. */
function coverOf(media: MediaView[]): string | null {
  const ready = media.filter((item) => item.status === 'READY')
  const photo = ready.find((item) => item.kind === 'PHOTO' && item.url)
  return photo?.url ?? ready.find((item) => item.kind === 'VIDEO')?.thumbnailUrl ?? null
}

/** En son çekilen saha görüntüsü (günler ve güncellemeler en yeniden eskiye sıralı gelir). */
function latestCover(days: FieldDay[]): string | null {
  return days.flatMap((day) => day.entries).map((entry) => coverOf(entry.media)).find((url) => url) ?? null
}

function todayCount(day: FieldDay): string {
  return `${day.count}${day.complete ? '' : '+'} saha güncellemesi`
}

/**
 * "Bugün şantiyede · Son güncelleme 17:42 · Musa · 4 saha güncellemesi". Bugün bir şey yazılmadıysa başlık
 * "Şantiyede son durum" olur ve sayı yazılmaz (İlke 3). Saha fotoğrafı yoksa şantiyenin fotoğrafı kullanılır.
 * Hiç güncelleme yoksa null: boş bir kapak gösterilmez.
 */
export function fieldSummary(days: FieldDay[], sitePhotoUrl: string | null): FieldSummary | null {
  const day = days.find((candidate) => candidate.count > 0)
  const latest = day?.entries.find((entry) => !entry.deletion)
  if (!day || !latest) return null
  const today = daysAgo(latest.createdAt) === 0
  const time = clockTime(latest.createdAt)
  const when = today ? time : `${listMoment(latest.createdAt)} ${time}`
  return {
    photoUrl: latestCover(days) ?? sitePhotoUrl,
    title: today ? 'Bugün şantiyede' : 'Şantiyede son durum',
    lastUpdate: `Son güncelleme ${when} · ${firstName(latest.author.fullName)}`,
    todayCount: today ? todayCount(day) : null,
  }
}
