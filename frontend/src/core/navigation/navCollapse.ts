import { computed, ref, watch } from 'vue'
import { MEDIA_QUERIES, useMediaQuery } from '@/core/platform'

const STORAGE_KEY = 'santiye.navCollapsed'

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
  } catch {
    // Kaydedilemezse menü bir sonraki açılışta açık gelir; engellemeye değmez.
  }
}

/**
 * Masaüstü sol menüsü ikonlara daralabilir; bir kere kapatan hep kapalı görür. Dar pencerede menü
 * kendiliğinden daralır ki liste ve akış sıkışmasın; orada açmak geçicidir, kayıtlı tercihi değiştirmez.
 */
export function useNavCollapse() {
  const preferred = ref(readCollapsed())
  const compact = useMediaQuery(MEDIA_QUERIES.compactDesktop)
  const openedWhileCompact = ref(false)
  watch(preferred, writeCollapsed)
  watch(compact, () => (openedWhileCompact.value = false))

  const collapsed = computed(() => (compact.value ? !openedWhileCompact.value : preferred.value))
  function toggle() {
    if (compact.value) openedWhileCompact.value = !openedWhileCompact.value
    else preferred.value = !preferred.value
  }
  return { collapsed, toggle }
}
