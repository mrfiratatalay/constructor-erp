import { useQueryClient } from '@tanstack/vue-query'
import type { PostView } from '@/core/api/generated/model'
import {
  useCorrectPost,
  useDeletePost,
  useForwardPost,
  usePinPost,
  useUnpinPost,
} from '@/core/api/generated/posts/posts'
import { refreshPostViews } from '@/core/posts/refreshPostViews'

/** Mesaja uzun basınca yapılan işler; her birinden sonra mesajı gösteren her ekran yenilenir. */
export function usePostActions() {
  const queryClient = useQueryClient()
  const onSuccess = (post: PostView) => refreshPostViews(queryClient, post.site.id)
  const correct = useCorrectPost({ mutation: { onSuccess } })
  const remove = useDeletePost({ mutation: { onSuccess } })
  const pin = usePinPost({ mutation: { onSuccess } })
  const unpin = useUnpinPost({ mutation: { onSuccess } })
  const forward = useForwardPost({ mutation: { onSuccess } })

  return {
    /** Düzeltme yalnızca yazıyı değiştirir; sunucunun beklediği "sorun" işareti olduğu gibi geri gönderilir. */
    correctPost: (post: PostView, body: string | null) =>
      correct.mutateAsync({ postId: post.id, data: { body, issue: post.issue } }),
    deletePost: (postId: string) => remove.mutateAsync({ postId }),
    togglePin: (post: PostView) => (post.pin ? unpin : pin).mutateAsync({ postId: post.id }),
    forwardPost: (post: PostView, siteId: string) => forward.mutateAsync({ postId: post.id, data: { siteId } }),
    /** Pano yalnızca güvenli bağlamda (https, localhost) açılır; açılmazsa false döner. */
    copyText: (post: PostView) =>
      navigator.clipboard?.writeText(post.body ?? '').then(() => true, () => false) ?? Promise.resolve(false),
    isSaving: correct.isPending,
  }
}
