import { useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useListIssues, useResolveIssue as useResolveMutation } from '@/core/api/generated/issues/issues'
import { FEED_QUERY_PREFIX } from '@/core/posts/useFeed'

const ISSUES_QUERY_PREFIX = '/api/issues'
const TODAY_QUERY_PREFIX = '/api/today'

/** open=true: çözülmeyi bekleyenler; false: son çözülenler. Dakikada bir yenilenir. */
export function useIssues(open: MaybeRefOrGetter<boolean>, siteId: MaybeRefOrGetter<string | undefined>) {
  const params = computed(() => ({ open: toValue(open), siteId: toValue(siteId) }))
  const query = useListIssues(params, { query: { refetchInterval: 60_000 } })
  return { issues: query.data, isLoading: query.isPending }
}

/** Çözülünce sorun listesi, akış ve Bugün paneli birlikte güncellenir. */
export function useResolveIssue() {
  const queryClient = useQueryClient()
  const mutation = useResolveMutation({
    mutation: {
      onSuccess: () =>
        Promise.all(
          [ISSUES_QUERY_PREFIX, FEED_QUERY_PREFIX, TODAY_QUERY_PREFIX].map((prefix) =>
            queryClient.invalidateQueries({ queryKey: [prefix] }),
          ),
        ),
    },
  })
  return {
    resolve: (postId: string, note: string | null) => mutation.mutateAsync({ postId, data: { note } }),
    isResolving: mutation.isPending,
  }
}
