import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { newId } from '@/core/posts/newId'
import { useAttachments } from '@/core/posts/useAttachments'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'

/** Gönderinin gideceği şantiye: kuyruk, yükleme sürerken adını da gösterir. */
export interface ComposeTarget {
  id: string
  name: string
}

/**
 * Kuyruğa yazmak (IndexedDB) beklenirken form henüz dolu durur: Gönder'e çift dokunuş aynı mesajı iki kez kuyruğa
 * koyuyor, sunucuya iki gönderi gidiyordu. Önceki çağrı bitmeden gelen çağrı yok sayılır.
 */
function oneAtATime(work: () => Promise<void>): () => Promise<void> {
  let running = false
  return async () => {
    if (running) return
    running = true
    try {
      await work()
    } finally {
      running = false
    }
  }
}

/** fieldUpdate: çubuk Saha sekmesindedir; giden her gönderi saha güncellemesidir. */
export interface ComposeOptions {
  fieldUpdate?: boolean
}

/**
 * Gönderi hazırlama: yazı, ekler ve varsa yanıtlanan mesaj. Şantiye sabittir: gönderi şantiyenin kendi
 * sayfasından atılır, seçici yoktur. Gönderince kuyruğa girer, form temizlenir.
 */
export function useComposer(target: MaybeRefOrGetter<ComposeTarget | undefined>, options: ComposeOptions = {}) {
  const queue = useUploadQueue()
  const files = useAttachments()
  const body = ref('')
  /** Yanıtlanan mesaj: çubuğun üstünde alıntı olarak durur, ✕ ile vazgeçilir (WhatsApp gibi). */
  const replyTo = ref<PostView | null>(null)
  /** Saha'daki "Sorun bildir": bu gönderi sorun olarak gider; gönderince kapanır. */
  const issue = ref(false)

  const canSend = computed(
    () => !!toValue(target) && (body.value.trim() !== '' || files.attachments.value.length > 0),
  )

  const submit = oneAtATime(async () => {
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
      replyToId: replyTo.value?.id ?? null,
      fieldUpdate: options.fieldUpdate ?? false,
    })
    files.clear()
    body.value = ''
    replyTo.value = null
    issue.value = false
  })

  return { body, replyTo, issue, canSend, submit, ...files }
}

/** Gönderme çubuğu ile fotoğraf önizleme penceresi aynı taslağı paylaşır. */
export type Composer = ReturnType<typeof useComposer>
