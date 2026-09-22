import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import { sendQueuedPost } from '@/core/posts/uploadSender'
import { forget, persist, restoreAll, type QueuedPost } from '@/core/posts/uploadStorage'

export type UploadState = 'waiting' | 'sending' | 'failed'

export interface QueueItem {
  post: QueuedPost
  state: UploadState
  /** 0-1 arası yükleme ilerlemesi (büyük videolar için). */
  progress: number
  error: string | null
}

interface QueueState {
  items: Ref<QueueItem[]>
  listeners: Array<() => void>
  flushing: boolean
}

const newItem = (post: QueuedPost): QueueItem => ({ post, state: 'waiting', progress: 0, error: null })
const pendingOf = (items: QueueItem[]) => items.filter((item) => item.state !== 'failed')

async function removeItem(state: QueueState, postId: string) {
  await forget(postId)
  state.items.value = state.items.value.filter((item) => item.post.id !== postId)
}

/** true: sıradakine geç. false: internet yok, kuyruğu burada bırak. */
async function sendItem(state: QueueState, item: QueueItem): Promise<boolean> {
  item.state = 'sending'
  const result = await sendQueuedPost(item.post, (fraction) => (item.progress = fraction))
  if (result.outcome === 'sent') {
    await removeItem(state, item.post.id)
    state.listeners.forEach((listener) => listener())
    return true
  }
  Object.assign(item, { state: result.outcome === 'rejected' ? 'failed' : 'waiting', progress: 0, error: result.error })
  return result.outcome === 'rejected'
}

async function flushQueue(state: QueueState) {
  if (state.flushing) return
  state.flushing = true
  try {
    for (const item of pendingOf(state.items.value)) {
      if (!(await sendItem(state, item))) break
    }
  } finally {
    state.flushing = false
  }
}

/**
 * Gönderim kuyruğu. Gönderi önce telefona yazılır, sonra gönderilir: internet yoksa kaybolmaz,
 * bağlantı gelince sırayla gider. Aynı gönderi tekrar gitse de sunucu çift kayıt açmaz (kimliği telefonda).
 */
export const useUploadQueue = defineStore('uploadQueue', () => {
  const state: QueueState = { items: ref<QueueItem[]>([]), listeners: [], flushing: false }
  const flush = () => flushQueue(state)

  return {
    items: state.items,
    pending: computed(() => pendingOf(state.items.value)),
    flush,
    restore: async () => {
      state.items.value = (await restoreAll()).map(newItem)
      void flush()
    },
    enqueue: async (post: QueuedPost) => {
      await persist(post)
      state.items.value.push(newItem(post))
      void flush()
    },
    discard: (postId: string) => removeItem(state, postId),
    /** Bir gönderi başarıyla gidince çağrılır (ör. akışı yenilemek için). */
    onSent: (listener: () => void) => state.listeners.push(listener),
  }
})
