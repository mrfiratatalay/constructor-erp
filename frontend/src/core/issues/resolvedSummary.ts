import type { PostView } from '@/core/api/generated/model'
import { timeAgo } from '@/core/format/dates'

/** Sunucu son çözülenlerin tamamını değil bu kadarını verir (IssueService.RECENTLY_RESOLVED). */
const RECENTLY_RESOLVED = 50

/** "Çözülen 12 sorun"; liste sınıra dayandıysa "50+". */
export function resolvedLinkText(resolved: PostView[]): string {
  const count = resolved.length >= RECENTLY_RESOLVED ? `${RECENTLY_RESOLVED}+` : String(resolved.length)
  return `Çözülen ${count} sorun`
}

/** Boş liste bu ekranın en sık hâlidir: kuru bir "yok" yerine gönül rahatlatan bir cümle. */
export const NO_OPEN_ISSUES = 'Bekleyen iş yok'

export function lastResolvedText(resolved: PostView[] | undefined): string | null {
  const lastResolvedAt = resolved?.[0]?.resolution?.resolvedAt
  return lastResolvedAt ? `Son sorun ${timeAgo(lastResolvedAt)} çözüldü.` : null
}
