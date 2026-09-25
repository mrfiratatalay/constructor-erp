import { useQueryClient } from '@tanstack/vue-query'
import type { PostView } from '@/core/api/generated/model'
import {
  useAddPostToField,
  useCorrectPost,
  useDeletePost,
  useForwardPost,
  usePinPost,
  useRemovePostFromField,
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
  const addToField = useAddPostToField({ mutation: { onSuccess } })
  const removeFromField = useRemovePostFromField({ mutation: { onSuccess } })

  return {
    /** Düzeltme yalnızca yazıyı değiştirir; sunucunun beklediği "sorun" işareti olduğu gibi geri gönderilir. */
    correctPost: (post: PostView, body: string | null) =>
      correct.mutateAsync({ postId: post.id, data: { body, issue: post.issue } }),
    /** Saha'da "Sorun olarak işaretle" / "Sorun işaretini kaldır": yazı olduğu gibi kalır. */
    toggleIssue: (post: PostView) =>
      correct.mutateAsync({ postId: post.id, data: { body: post.body ?? null, issue: !post.issue } }),
    deletePost: (postId: string) => remove.mutateAsync({ postId }),
    togglePin: (post: PostView) => (post.pin ? unpin : pin).mutateAsync({ postId: post.id }),
    /** "Sahaya ekle" / "Sahadan çıkar": mesaj sohbette kalır, Saha'da görünüp görünmediği değişir. */
    toggleField: (post: PostView) =>
      (post.fieldUpdate ? removeFromField : addToField).mutateAsync({ postId: post.id }),
    forwardPost: (post: PostView, siteId: string) => forward.mutateAsync({ postId: post.id, data: { siteId } }),
    /** Pano yalnızca güvenli bağlamda (https, localhost) açılır; açılmazsa false döner. */
    copyText: (post: PostView) =>
      navigator.clipboard?.writeText(post.body ?? '').then(() => true, () => false) ?? Promise.resolve(false),
    isSaving: correct.isPending,
  }
}
