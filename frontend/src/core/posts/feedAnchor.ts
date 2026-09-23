import { nextTick } from 'vue'

/**
 * Sohbet yönündeki akışın kaydırma işleri. Kaydıran öğe mobilde sayfanın kendisidir (null),
 * masaüstünde sağ panelin gövdesidir.
 */
export type Scroller = HTMLElement | null

/** Dibe bu kadar yakınsa kullanıcı "son haberlere bakıyor" sayılır ve yeni gönderi takip edilir. */
const NEAR_BOTTOM = 160

const heightOf = (scroller: Scroller) => (scroller ? scroller.scrollHeight : document.documentElement.scrollHeight)
const offsetOf = (scroller: Scroller) => (scroller ? scroller.scrollTop : window.scrollY)
const viewportOf = (scroller: Scroller) => (scroller ? scroller.clientHeight : window.innerHeight)

function moveBy(scroller: Scroller, delta: number) {
  if (scroller) scroller.scrollTop += delta
  else window.scrollBy(0, delta)
}

/** Akış açılınca en yeni gönderinin durduğu yer: dip. */
export function scrollToBottom(scroller: Scroller): void {
  if (scroller) scroller.scrollTop = scroller.scrollHeight
  else window.scrollTo(0, document.documentElement.scrollHeight)
}

export function isNearBottom(scroller: Scroller): boolean {
  return heightOf(scroller) - offsetOf(scroller) - viewportOf(scroller) < NEAR_BOTTOM
}

/**
 * Yukarıya eski gönderiler eklenirken ekran zıplamasın: eklenen yükseklik kadar aşağı kaydırılır,
 * kullanıcının okuduğu gönderi gözünün önünde kalır.
 */
export async function keepPosition(scroller: Scroller, load: () => Promise<unknown>): Promise<void> {
  const before = heightOf(scroller)
  await load()
  await nextTick()
  moveBy(scroller, heightOf(scroller) - before)
}
