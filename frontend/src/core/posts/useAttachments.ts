import { ref } from 'vue'
import { kindOf, LIMITS, releaseAttachment, toAttachment, type Attachment } from '@/core/posts/attachments'
import { compressPhoto } from '@/core/posts/photoCompression'
import { readVideoDuration } from '@/core/posts/videoDuration'

/** Eklenebiliyorsa eki, eklenemiyorsa kullanıcıya gösterilecek nedeni döner. */
async function prepareAttachment(file: File, currentCount: number): Promise<Attachment | string> {
  const kind = kindOf(file)
  if (!kind) return `${file.name}: yalnızca fotoğraf, video ve ses eklenebilir.`
  if (currentCount >= LIMITS.attachments) return `En fazla ${LIMITS.attachments} dosya eklenebilir.`
  if (kind === 'VIDEO' && ((await readVideoDuration(file)) ?? 0) > LIMITS.videoSeconds + 1) {
    return `Video en fazla ${LIMITS.videoSeconds} saniye olabilir.`
  }
  return toAttachment(kind === 'PHOTO' ? await compressPhoto(file) : file, kind)
}

/** Gönderinin ekleri: fotoğraflar küçültülür, uzun video reddedilir, kaldırılan ekin belleği boşaltılır. */
export function useAttachments() {
  const attachments = ref<Attachment[]>([])
  const isPreparing = ref(false)

  /** Sırayla hazırlanır: sınır kontrolü eklenenleri de sayar. Eklenemeyenlerin nedenleri döner. */
  async function addFiles(files: File[]): Promise<string[]> {
    const problems: string[] = []
    isPreparing.value = true
    for (const file of files) {
      const result = await prepareAttachment(file, attachments.value.length)
      if (typeof result === 'string') problems.push(result)
      else attachments.value.push(result)
    }
    isPreparing.value = false
    return problems
  }

  function remove(attachmentId: string) {
    attachments.value.filter((item) => item.id === attachmentId).forEach(releaseAttachment)
    attachments.value = attachments.value.filter((item) => item.id !== attachmentId)
  }

  function clear() {
    attachments.value.forEach(releaseAttachment)
    attachments.value = []
  }

  return { attachments, isPreparing, addFiles, remove, clear }
}
