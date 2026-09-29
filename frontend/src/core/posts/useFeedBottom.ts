import { nextTick, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { isNearBottom, scrollToBottom, type Scroller } from '@/core/posts/feedAnchor'

/**
 * Akış sohbet gibi açılır: sayfa dibe iner, orada en yeni gönderi durur. Sonrasında yeni gönderi geldiğinde
 * ekran ancak kullanıcı dipteyse onu takip eder; yukarıda eski günleri okuyanı yerinden oynatmaz.
 *
 * bottom: akışın dibinin imzası (feedBottomKey). Değişmesi akışa bir şey eklendi demektir: yeni mesaj, sonradan
 * yüklenen mesaj ya da sistem satırı. Kullanıcı dipteyse dipte kalır.
 */
export function useFeedBottom(scroller: () => Scroller, bottom: MaybeRefOrGetter<string | undefined>): void {
  let landed = false
  watch(
    () => toValue(bottom),
    async (key) => {
      if (!key || (landed && !isNearBottom(scroller()))) return
      await nextTick()
      scrollToBottom(scroller())
      landed = true
    },
    { immediate: true },
  )
}
