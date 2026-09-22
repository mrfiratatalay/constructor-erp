import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListIssues, useResolveIssue as useResolveMutation } from '@/core/api/generated/issues/issues'
import { refreshPostViews } from '@/core/posts/refreshPostViews'

/** open=true: çözülmeyi bekleyenler (en eski üstte); false: son çözülenler. Dakikada bir yenilenir. */
export function useIssues(open: MaybeRefOrGetter<boolean>, siteId: MaybeRefOrGetter<string | undefined>) {
  const params = computed(() => ({ open: toValue(open), siteId: toValue(siteId) }))
  const query = useListIssues(params, { query: { refetchInterval: 60_000 } })
  return { issues: query.data, isLoading: query.isPending }
}

/** Çözülünce sorun listesi, akış ve ana ekran birlikte güncellenir. */
export function useResolveIssue() {
  const queryClient = useQueryClient()
  const mutation = useResolveMutation({
    mutation: { onSuccess: (post) => refreshPostViews(queryClient, post.site.id) },
  })
  return {
    resolve: (postId: string, note: string | null) => mutation.mutateAsync({ postId, data: { note } }),
    isResolving: mutation.isPending,
  }
}
