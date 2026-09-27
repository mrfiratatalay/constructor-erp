import type { MediaView, PostQuote, PostView } from '@/core/api/generated/model'
import { firstName } from '@/core/format/names'
import { postTick, type Tick } from '@/core/posts/ticks'

/** Satırdaki tek satırlık önizleme: kimden ("Sen", "Ahmet"), ne ("📷 Beton döküldü") ve kendi mesajındaysa tik. */
export interface ChatPreview {
  author: string | null
  text: string
  tick: Tick | null
}

const count = (media: MediaView[], kind: MediaView['kind']) => media.filter((item) => item.kind === kind).length

/** Mesajdaki dosyanın WhatsApp'taki gibi simgesi ve adı: "📷 Fotoğraf", "📷 3 fotoğraf", "📄 Proje.pdf". */
function mediaLabel(media: MediaView[]): { icon: string; label: string } | null {
  const photos = count(media, 'PHOTO')
  if (photos) return { icon: '📷', label: photos > 1 ? `${photos} fotoğraf` : 'Fotoğraf' }
  if (count(media, 'VIDEO')) return { icon: '🎥', label: 'Video' }
  if (count(media, 'AUDIO')) return { icon: '🎤', label: 'Sesli not' }
  const document = media.find((item) => item.kind === 'DOCUMENT')
  return document ? { icon: '📄', label: document.fileName ?? 'Belge' } : null
}

/** Mesajın kendisi tek satırda: yazının ilk satırı, dosya varsa önünde simgesi. Yazı yoksa dosyanın adı. */
export function postSummary(post: Pick<PostView, 'body' | 'media'>): string {
  const firstLine = post.body?.split('\n').find((line) => line.trim())?.trim()
  const media = mediaLabel(post.media)
  if (!media) return firstLine ?? ''
  return `${media.icon} ${firstLine ?? media.label}`
}

export function chatPreview(post: PostView, viewerId?: string): ChatPreview {
  const mine = post.author.id === viewerId
  return {
    author: mine ? 'Sen' : firstName(post.author.fullName),
    text: post.deletion ? '🚫 Bu mesaj silindi' : postSummary(post),
    tick: mine && !post.deletion ? postTick(post) : null,
  }
}

/** Yazarken çubuğun üstündeki alıntı: yanıtlanan mesaj, baloncuktaki alıntıyla aynı biçimde. */
export function quoteOf(post: PostView): PostQuote {
  const first = post.media[0]
  const firstLine = post.body?.split('\n').find((line) => line.trim())?.trim() ?? null
  return {
    id: post.id,
    authorName: post.author.fullName,
    body: firstLine,
    mediaKind: first?.kind ?? null,
    thumbnailUrl: first?.thumbnailUrl ?? null,
    deleted: !!post.deletion,
  }
}
