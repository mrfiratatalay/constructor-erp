import { watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { jumpToPost } from '@/core/posts/jumpToPost'

interface Timeline {
  posts: Readonly<Ref<{ id: string }[]>>
  hasMore: Readonly<Ref<boolean>>
  isLoading: Readonly<Ref<boolean>>
  loadMore: () => Promise<unknown>
}

/**
 * Adresteki ?mesaj=… (aramadan gelindi): akış yüklenince o mesaja gidilir, sonra parametre adresten silinir
 * ki geri dönünce aynı yere tekrar zıplamasın. Aynı sayfadaki atlamalar için de jump döner.
 */
export function useJumpTarget(timeline: Timeline) {
  const route = useRoute()
  const router = useRouter()

  const jump = (postId: string) =>
    jumpToPost(postId, {
      isLoaded: () => timeline.posts.value.some((post) => post.id === postId),
      hasMore: () => timeline.hasMore.value,
      loadMore: timeline.loadMore,
    })

  watch([() => route.query.mesaj, timeline.isLoading], async ([target, loading]) => {
    if (typeof target !== 'string' || loading) return
    await jump(target)
    void router.replace({ query: { ...route.query, mesaj: undefined } })
  }, { immediate: true })

  return { jump }
}
