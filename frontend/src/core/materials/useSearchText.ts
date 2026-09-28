import { onScopeDispose, ref, watch } from 'vue'

const DELAY = 300

/**
 * Arama kutusunun yazısı: kutu kendi yazısını tutar (her tuşta adres değişmez), yazmayı bırakınca süzgece yazılır.
 * Süzgeç dışarıdan değişirse (etiket kapatıldı, "Temizle") kutu da güncellenir.
 */
export function useSearchText(current: () => string, apply: (text: string) => void) {
  const text = ref(current())
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(current, (value) => (text.value = value))
  watch(text, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => value !== current() && apply(value), DELAY)
  })
  onScopeDispose(() => clearTimeout(timer))
  return text
}
