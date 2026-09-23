import { useQueryClient } from '@tanstack/vue-query'
import type { PostView } from '@/core/api/generated/model'
import { useCorrectPost, useDeletePost } from '@/core/api/generated/posts/posts'
import { refreshPostViews } from '@/core/posts/refreshPostViews'

/** Gönderi düzeltme ve silme; ikisinden sonra da gönderiyi gösteren her ekran yenilenir. */
export function usePostActions() {
  const queryClient = useQueryClient()
  const onSuccess = (post: PostView) => refreshPostViews(queryClient, post.site.id)
  const correct = useCorrectPost({ mutation: { onSuccess } })
  const remove = useDeletePost({ mutation: { onSuccess } })

  return {
    /** Düzeltme yalnızca yazıyı değiştirir; sunucunun beklediği "sorun" işareti olduğu gibi geri gönderilir. */
    correctPost: (post: PostView, body: string | null) =>
      correct.mutateAsync({ postId: post.id, data: { body, issue: post.issue } }),
    deletePost: (postId: string) => remove.mutateAsync({ postId }),
    isSaving: correct.isPending,
  }
}
