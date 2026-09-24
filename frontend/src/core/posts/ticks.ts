import type { PostView } from '@/core/api/generated/model'

/**
 * WhatsApp'taki tikler, kendi mesajında: 🕓 henüz gitmedi (telefonda bekliyor), ✓ gitti, mavi ✓✓ şantiyedeki
 * herkes gördü. "Karşının telefonuna ulaştı" (gri ✓✓) bilgisi bizde yok, o hâl kullanılmaz.
 */
export type Tick = 'pending' | 'sent' | 'seen'

export function postTick(post: PostView): Tick {
  return post.seenByAll ? 'seen' : 'sent'
}
