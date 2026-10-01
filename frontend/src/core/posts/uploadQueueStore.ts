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
  /** Oturumu açık kişi: kuyruk yalnızca onun gönderilerini gösterir ve gönderir. */
  owner: Ref<string | null>
  listeners: Array<() => unknown>
  flushing: boolean
}

const newItem = (post: QueuedPost): QueueItem => ({ post, state: 'waiting', progress: 0, error: null })
const pendingOf = (items: QueueItem[]) => items.filter((item) => item.state !== 'failed')
const ownedBy = (items: QueueItem[], owner: string | null) =>
  owner === null ? [] : items.filter((item) => item.post.authorId === owner)

/** Kimliği olmayan gönderi (önceki sürümün kuyruğu) ilk giren kişiye, pratikte telefonun sahibine bağlanır. */
async function claimUnowned(state: QueueState) {
  const owner = state.owner.value
  if (owner === null) return
  for (const item of state.items.value.filter((candidate) => candidate.post.authorId === undefined)) {
    item.post = { ...item.post, authorId: owner }
    await persist(item.post)
  }
}

async function removeItem(state: QueueState, postId: string) {
  await forget(postId)
  state.items.value = state.items.value.filter((item) => item.post.id !== postId)
}

/** true: sıradakine geç. false: internet yok, kuyruğu burada bırak. */
async function sendItem(state: QueueState, item: QueueItem): Promise<boolean> {
  item.state = 'sending'
  const result = await sendQueuedPost(item.post, (fraction) => (item.progress = fraction))
  // Önce akış yenilenir, sonra 🕓'lı geçici baloncuk kalkar: asıl mesaj gelmeden yer boşalmaz.
  if (result.outcome === 'sent') {
    await Promise.all(state.listeners.map((listener) => listener()))
    await removeItem(state, item.post.id)
    return true
  }
  Object.assign(item, { state: result.outcome === 'rejected' ? 'failed' : 'waiting', progress: 0, error: result.error })
  return result.outcome === 'rejected'
}

/** Gönderim sürerken oturum değişirse durur: sıradaki gönderi yeni girenin adıyla gitmez. */
async function flushQueue(state: QueueState) {
  if (state.flushing) return
  state.flushing = true
  try {
    for (const item of pendingOf(ownedBy(state.items.value, state.owner.value))) {
      if (item.post.authorId !== state.owner.value || !(await sendItem(state, item))) break
    }
  } finally {
    state.flushing = false
  }
}

/**
 * Gönderim kuyruğu. Gönderi önce telefona yazılır, sonra gönderilir: internet yoksa kaybolmaz,
 * bağlantı gelince sırayla gider. Aynı gönderi tekrar gitse de sunucu çift kayıt açmaz (kimliği telefonda).
 * Gönderi yazanın kimliğini taşır: aynı telefonda başka biri giriş yaparsa bekleyen gönderiler onun adıyla gitmez,
 * ona görünmez de; yazan yeniden girince gider.
 */
export const useUploadQueue = defineStore('uploadQueue', () => {
  const state: QueueState = { items: ref<QueueItem[]>([]), owner: ref<string | null>(null), listeners: [], flushing: false }
  const flush = () => flushQueue(state)
  const mine = computed(() => ownedBy(state.items.value, state.owner.value))

  return {
    items: mine,
    pending: computed(() => pendingOf(mine.value)),
    flush,
    restore: async () => {
      state.items.value = (await restoreAll()).map(newItem)
      await claimUnowned(state)
      void flush()
    },
    enqueue: async (post: QueuedPost) => {
      const owned: QueuedPost = { ...post, authorId: state.owner.value ?? undefined }
      await persist(owned)
      state.items.value.push(newItem(owned))
      void flush()
    },
    /** Oturum değişince (giriş, çıkış, başka hesap) çağrılır; aynı kişiyse bir şey olmaz. */
    setOwner: async (owner: string | null) => {
      if (state.owner.value === owner) return
      state.owner.value = owner
      await claimUnowned(state)
      void flush()
    },
    discard: (postId: string) => removeItem(state, postId),
    /** Bir gönderi başarıyla gidince çağrılır (ör. akışı yenilemek için). */
    onSent: (listener: () => unknown) => state.listeners.push(listener),
  }
})
