import { nextTick, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { isNearBottom, scrollToBottom, type Scroller } from '@/core/posts/feedAnchor'

/**
 * Akış sohbet gibi açılır: sayfa dibe iner, orada en yeni gönderi durur. Sonrasında yeni gönderi geldiğinde
 * ekran ancak kullanıcı dipteyse onu takip eder; yukarıda eski günleri okuyanı yerinden oynatmaz.
 *
 * newestId: akıştaki son gönderinin kimliği. Değişmesi yeni gönderi geldi demektir.
 */
export function useFeedBottom(scroller: () => Scroller, newestId: MaybeRefOrGetter<string | undefined>): void {
  let landed = false
  watch(
    () => toValue(newestId),
    async (id) => {
      if (!id || (landed && !isNearBottom(scroller()))) return
      await nextTick()
      scrollToBottom(scroller())
      landed = true
    },
    { immediate: true },
  )
}
