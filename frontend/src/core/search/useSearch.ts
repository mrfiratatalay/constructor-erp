import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { useSearchPosts } from '@/core/api/generated/posts/posts'
import type { SiteToday } from '@/core/api/generated/model'

/** Mesaj araması en az iki harfle başlar; yazarken her tuşta değil, durunca sorulur. */
const MIN_LENGTH = 2
const WAIT_MS = 300

const normalize = (text: string) => text.toLocaleLowerCase('tr-TR').trim()

/**
 * WhatsApp'taki arama: üstte adı uyan şantiyeler, altta yazısında aranan geçen mesajlar. siteId verilirse
 * yalnızca o şantiyenin mesajları ("Bu şantiyede ara"); şantiye adları o zaman aranmaz.
 */
export function useSearch(sites: MaybeRefOrGetter<SiteToday[]>, siteId?: MaybeRefOrGetter<string | undefined>) {
  const text = ref('')
  const settled = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(text, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => (settled.value = value.trim()), WAIT_MS)
  })

  const params = computed(() => ({ q: settled.value, siteId: toValue(siteId) }))
  const enabled = computed(() => settled.value.length >= MIN_LENGTH)
  const posts = useSearchPosts(params, { query: { enabled } })

  const matchingSites = computed(() => {
    const wanted = normalize(text.value)
    if (!wanted || toValue(siteId)) return []
    return toValue(sites).filter((site) => normalize(site.name).includes(wanted))
  })

  return {
    text,
    isActive: computed(() => text.value.trim() !== ''),
    matchingSites,
    posts: computed(() => (enabled.value ? (posts.data.value ?? []) : [])),
    isSearching: computed(() => enabled.value && posts.isFetching.value),
    clear: () => (text.value = ''),
  }
}
