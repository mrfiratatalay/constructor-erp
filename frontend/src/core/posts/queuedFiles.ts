import { kindOf } from '@/core/posts/attachments'

const LABELS = { PHOTO: '📷 Fotoğraf', VIDEO: '🎥 Video', AUDIO: '🎤 Sesli not', DOCUMENT: '📄 Belge' } as const

/** Henüz gitmemiş gönderinin dosyaları tek satırda: "📷 Fotoğraf", "📷 Fotoğraf ve 2 dosya daha". */
export function queuedFilesLabel(files: File[]): string | null {
  const kinds = files.map((file) => kindOf(file)).filter((kind) => kind !== null)
  const first = kinds[0]
  if (!first) return null
  return kinds.length > 1 ? `${LABELS[first]} ve ${kinds.length - 1} dosya daha` : LABELS[first]
}
