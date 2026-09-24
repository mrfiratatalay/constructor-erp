import { isAxiosError } from 'axios'
import { errorMessage } from '@/core/api/errors'
import { createPost } from '@/core/api/generated/posts/posts'
import type { QueuedPost } from '@/core/posts/uploadStorage'

/** sent: gitti. retryLater: internet ya da sunucu sorunu, sonra tekrar denenir. rejected: gönderi hatalı. */
export type SendOutcome = 'sent' | 'retryLater' | 'rejected'

/** Sunucu "bu gönderi hatalı" diyorsa (4xx) tekrar denemenin anlamı yok; 401 ise giriş sonrası denenir. */
function isPermanentFailure(error: unknown): boolean {
  const status = isAxiosError(error) ? error.response?.status : undefined
  return status !== undefined && status >= 400 && status < 500 && status !== 401 && status !== 429
}

export async function sendQueuedPost(
  post: QueuedPost,
  onProgress: (fraction: number) => void,
): Promise<{ outcome: SendOutcome; error: string | null }> {
  try {
    const { id, siteId, body, issue, files, replyToId = null, fieldUpdate = false } = post
    await createPost({ id, siteId, body, issue, files, replyToId, fieldUpdate }, {
      onUploadProgress: (event) => onProgress(event.total ? event.loaded / event.total : 0),
    })
    return { outcome: 'sent', error: null }
  } catch (error) {
    return { outcome: isPermanentFailure(error) ? 'rejected' : 'retryLater', error: errorMessage(error) }
  }
}
