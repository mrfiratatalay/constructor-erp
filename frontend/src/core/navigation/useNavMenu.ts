import { computed, onScopeDispose, ref, watch } from 'vue'
import { MEDIA_QUERIES, useMediaQuery } from '@/core/platform'

const STORAGE_KEY = 'santiye.navOpen'

/** Kayıt yoksa menü açık gelir: ilk bakışta ikonların adları görünsün (TASARIM.md İlke 2). */
function readPreferredOpen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== '0'
  } catch {
    return true
  }
}

function writePreferredOpen(open: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, open ? '1' : '0')
  } catch {
    // Kaydedilemezse menü bir sonraki açılışta yine açık gelir; engellemeye değmez.
  }
}

/**
 * Masaüstü sol menüsü, Gmail'deki gibi ☰ ile açılır ve kapanır. Geniş pencerede açık menü yer kaplar,
 * içerik yana kayar; tercih hatırlanır. Dar pencerede (liste ve akışa yer az) menü ince başlar ve ☰ onu
 * içeriğin üstüne kaydırır: bir öğe seçilince, boşluğa tıklanınca ya da Esc'e basınca kapanır. O geçici
 * açılış kayıtlı tercihi değiştirmez.
 */
export function useNavMenu() {
  const preferredOpen = ref(readPreferredOpen())
  const compact = useMediaQuery(MEDIA_QUERIES.compactDesktop)
  const floatingOpen = ref(false)
  watch(preferredOpen, writePreferredOpen)
  watch(compact, () => (floatingOpen.value = false))

  const closeFloating = () => (floatingOpen.value = false)
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') closeFloating()
  }
  window.addEventListener('keydown', onKey)
  onScopeDispose(() => window.removeEventListener('keydown', onKey))

  const open = computed(() => (compact.value ? floatingOpen.value : preferredOpen.value))
  const floating = computed(() => compact.value && floatingOpen.value)
  function toggle() {
    if (compact.value) floatingOpen.value = !floatingOpen.value
    else preferredOpen.value = !preferredOpen.value
  }
  return { open, floating, toggle, closeFloating }
}
