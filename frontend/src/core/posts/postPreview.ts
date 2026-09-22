import type { MediaView, PostView } from '@/core/api/generated/model'
import { firstName } from '@/core/format/names'

function mediaSummary(media: MediaView[]): string {
  const count = (kind: MediaView['kind']) => media.filter((item) => item.kind === kind).length
  const parts: string[] = []
  if (count('PHOTO')) parts.push(`${count('PHOTO')} fotoğraf`)
  if (count('VIDEO')) parts.push(`${count('VIDEO')} video`)
  if (count('AUDIO')) parts.push('sesli not')
  return parts.join(', ') || 'gönderi'
}

/** Ana ekrandaki önizleme: 'Ahmet: "Demir gelmedi…"'. Yazı yoksa ne gönderildiği söylenir. */
export function postPreview(post: PostView): string {
  const firstLine = post.body?.split('\n').find((line) => line.trim())?.trim()
  return `${firstName(post.author.fullName)}: ${firstLine ?? mediaSummary(post.media)}`
}
