import { onBeforeUnmount } from 'vue'

const HOLD_MS = 500
/** Parmak bundan fazla kayarsa kullanıcı kaydırıyordur, basılı tutmuyordur. */
const MOVE_TOLERANCE_PX = 10

interface Point {
  x: number
  y: number
}

const touchPoint = (event: TouchEvent): Point => ({ x: event.touches[0]!.clientX, y: event.touches[0]!.clientY })
const movedAway = (from: Point, to: Point) => Math.hypot(to.x - from.x, to.y - from.y) > MOVE_TOLERANCE_PX

/**
 * Uzun basma (WhatsApp'taki gibi): parmak yarım saniye yerinde durursa çalışır, kaydırma iptal eder.
 * Uzun basmanın ardından gelen tıklama yutulur: altında kalan fotoğraf da açılmasın.
 * Dönen fonksiyon, bir öğeye v-bind ile verilecek dokunma olaylarını üretir.
 */
export function useLongPress() {
  let timer: ReturnType<typeof setTimeout> | undefined
  let origin: Point = { x: 0, y: 0 }
  let fired = false

  const cancel = () => clearTimeout(timer)
  onBeforeUnmount(cancel)

  function start(event: TouchEvent, onLongPress: () => void) {
    fired = false
    origin = touchPoint(event)
    timer = setTimeout(() => {
      fired = true
      navigator.vibrate?.(15)
      onLongPress()
    }, HOLD_MS)
  }

  function swallowClickAfterPress(event: Event) {
    if (!fired) return
    event.stopPropagation()
    event.preventDefault()
    fired = false
  }

  return (onLongPress: () => void) => ({
    onTouchstart: (event: TouchEvent) => start(event, onLongPress),
    onTouchmove: (event: TouchEvent) => movedAway(origin, touchPoint(event)) && cancel(),
    onTouchend: cancel,
    onTouchcancel: cancel,
    // Telefonun kendi uzun basma menüsü (resmi kaydet, metni seç) bizimkinin önüne geçmesin.
    onContextmenu: (event: Event) => event.preventDefault(),
    onClickCapture: swallowClickAfterPress,
  })
}
