import { newId } from '@/core/posts/newId'

export type AttachmentKind = 'PHOTO' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'

export interface Attachment {
  id: string
  kind: AttachmentKind
  file: File
  /** Gönderilmeden önce ekranda göstermek için tarayıcı içi geçici adres. */
  previewUrl: string
}

/** Sunucudaki sınırların aynısı; telefonda önceden kontrol edilir ki kullanıcı boşuna beklemesin. */
export const LIMITS = { attachments: 10, videoSeconds: 60, voiceSeconds: 180 } as const

export function kindOf(file: File): AttachmentKind | null {
  if (file.type.startsWith('image/')) return 'PHOTO'
  if (file.type.startsWith('video/')) return 'VIDEO'
  if (file.type.startsWith('audio/')) return 'AUDIO'
  if (file.type === 'application/pdf') return 'DOCUMENT'
  return null
}

export function toAttachment(file: File, kind: AttachmentKind): Attachment {
  return { id: newId(), kind, file, previewUrl: URL.createObjectURL(file) }
}

/** Geçici adresler bellekte yer tutar; ek kaldırılınca serbest bırakılır. */
export function releaseAttachment(attachment: Attachment) {
  URL.revokeObjectURL(attachment.previewUrl)
}
