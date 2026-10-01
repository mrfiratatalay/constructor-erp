import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { SendOutcome } from '@/core/posts/uploadSender'
import type { QueuedPost } from '@/core/posts/uploadStorage'
import { useUploadQueue } from '@/core/posts/uploadQueueStore'

type Sent = { outcome: SendOutcome; error: string | null }

const send = vi.hoisted(() => vi.fn<(post: QueuedPost) => Promise<Sent>>())
const stored = vi.hoisted(() => ({ posts: [] as QueuedPost[] }))
vi.mock('@/core/posts/uploadSender', () => ({ sendQueuedPost: send }))
vi.mock('@/core/posts/uploadStorage', () => ({
  persist: async () => undefined,
  forget: async () => undefined,
  restoreAll: async () => stored.posts,
}))

const offline: Sent = { outcome: 'retryLater', error: 'İnternet yok' }
const delivered: Sent = { outcome: 'sent', error: null }

function draft(id: string, authorId?: string): QueuedPost {
  return { id, siteId: 'santiye', siteName: 'Şantiye', body: 'Beton döküldü', issue: false, files: [],
    queuedAt: '2026-10-01T09:00:00Z', authorId }
}

describe('gönderim kuyruğu', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    send.mockReset()
    stored.posts = []
  })

  it('bekleyen gönderi aynı telefonda giren başka birinin adıyla gitmez, ona görünmez de', async () => {
    const queue = useUploadQueue()
    send.mockResolvedValue(offline)
    await queue.setOwner('ahmet')
    await queue.enqueue(draft('p1'))
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1))

    send.mockReset()
    send.mockResolvedValue(delivered)
    await queue.setOwner('mehmet')
    await queue.flush()
    expect(send).not.toHaveBeenCalled()
    expect(queue.items).toHaveLength(0)

    await queue.setOwner('ahmet')
    await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(1))
    expect(send.mock.calls[0]?.[0].authorId).toBe('ahmet')
  })

  it('oturum yokken hiçbir gönderi gitmez', async () => {
    stored.posts = [draft('p1', 'ahmet')]
    const queue = useUploadQueue()

    await queue.restore()
    await queue.flush()

    expect(send).not.toHaveBeenCalled()
    expect(queue.items).toHaveLength(0)
  })

  it('önceki sürümden kalan kimliksiz gönderi ilk girene bağlanır, sonra girene geçmez', async () => {
    stored.posts = [draft('eski')]
    send.mockResolvedValue(offline)
    const queue = useUploadQueue()
    await queue.restore()

    await queue.setOwner('ahmet')
    expect(queue.items.map((item) => item.post.authorId)).toEqual(['ahmet'])

    await queue.setOwner('mehmet')
    expect(queue.items).toHaveLength(0)
  })
})
