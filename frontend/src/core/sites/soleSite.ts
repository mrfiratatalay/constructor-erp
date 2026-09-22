import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/core/auth/currentUser'
import { useToday } from '@/core/today/useToday'

/** Liste yalnızca birden çok aktif şantiye varsa anlamlıdır; patron her zaman listeyi görür. */
export function useHasSiteList() {
  const { data: user } = useCurrentUser()
  const { today } = useToday()
  return computed(() => user.value?.role === 'OWNER' || (today.value?.sites.length ?? 0) > 1)
}

/** Tek şantiyesi olan sorumlu için ana ekran doğrudan kendi şantiyesinin sayfasıdır. */
export function useSoleSiteRedirect() {
  const router = useRouter()
  const { today } = useToday()
  const hasSiteList = useHasSiteList()
  watch([today, hasSiteList], ([view, hasList]) => {
    const only = view?.sites.length === 1 ? view.sites[0] : undefined
    if (only && !hasList) void router.replace({ name: 'siteFeed', params: { siteId: only.siteId } })
  }, { immediate: true })
}
