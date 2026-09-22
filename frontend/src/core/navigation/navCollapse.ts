import { ref, watch } from 'vue'

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

/** Masaüstü sol menüsü ikonlara daralabilir; bir kere kapatan hep kapalı görür. */
export function useNavCollapse() {
  const collapsed = ref(readCollapsed())
  watch(collapsed, writeCollapsed)
  return { collapsed, toggle: () => (collapsed.value = !collapsed.value) }
}
