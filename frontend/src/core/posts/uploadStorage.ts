import { createStore, del, entries, set } from 'idb-keyval'

/** Gönderilmeyi bekleyen gönderi; dosyalarıyla birlikte telefonun kalıcı hafızasında durur. */
export interface QueuedPost {
  id: string
  siteId: string
  siteName: string
  body: string | null
  issue: boolean
  files: File[]
  queuedAt: string
  /** Yanıtlanan mesaj (WhatsApp'taki alıntı); eski sürümde kuyruğa girenlerde yoktur. */
  replyToId?: string | null
}

const store = createStore('kizilkan-santiye', 'gonderim-kuyrugu')

/**
 * IndexedDB bazı durumlarda (gizli sekme, dolu disk) yazamaz. O zaman gönderi yalnızca bellekte bekler;
 * uygulama kapanmadıkça yine gönderilir. Hata kullanıcıyı engellemez.
 */
export async function persist(post: QueuedPost): Promise<void> {
  await set(post.id, post, store).catch(() => undefined)
}

export async function forget(postId: string): Promise<void> {
  await del(postId, store).catch(() => undefined)
}

export async function restoreAll(): Promise<QueuedPost[]> {
  const stored = await entries<string, QueuedPost>(store).catch(() => [])
  return stored.map(([, post]) => post).sort((a, b) => a.queuedAt.localeCompare(b.queuedAt))
}
