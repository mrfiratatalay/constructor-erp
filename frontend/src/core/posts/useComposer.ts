import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { newId } from '@/core/posts/newId'
import { useAttachments } from '@/core/posts/useAttachments'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'

/** Gönderinin gideceği şantiye: kuyruk, yükleme sürerken adını da gösterir. */
export interface ComposeTarget {
  id: string
  name: string
}

/**
 * Gönderi hazırlama: yazı, "sorun" işareti ve ekler. Şantiye sabittir: gönderi şantiyenin kendi
 * sayfasından atılır, seçici yoktur. Gönderince kuyruğa girer, form temizlenir.
 */
export function useComposer(target: MaybeRefOrGetter<ComposeTarget | undefined>) {
  const queue = useUploadQueue()
  const files = useAttachments()
  const body = ref('')
  const issue = ref(false)

  const canSend = computed(
    () => !!toValue(target) && (body.value.trim() !== '' || files.attachments.value.length > 0),
  )

  async function submit() {
    const site = toValue(target)
    if (!site || !canSend.value) return
    await queue.enqueue({
      id: newId(),
      siteId: site.id,
      siteName: site.name,
      body: body.value.trim() || null,
      issue: issue.value,
      files: files.attachments.value.map((item) => item.file),
      queuedAt: new Date().toISOString(),
    })
    files.clear()
    body.value = ''
    issue.value = false
  }

  return { body, issue, canSend, submit, ...files }
}

/** Gönderme çubuğu ile fotoğraf önizleme penceresi aynı taslağı paylaşır. */
export type Composer = ReturnType<typeof useComposer>
