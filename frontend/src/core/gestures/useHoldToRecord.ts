import { ref } from 'vue'

/** Parmak mikrofondan bu kadar yukarı kayarsa kayıt kilitlenir (WhatsApp'taki kilit). */
const LOCK_DISTANCE_PX = 70

interface Recorder {
  start: () => Promise<void>
  stop: () => void
  cancel: () => void
}

/**
 * Mikrofon düğmesinin hareketi, WhatsApp'taki gibi: basılı tut, konuş, bırak → gider. Basılıyken yukarı
 * kaydırırsan kilitlenir: parmağını kaldırsan da kayıt sürer, sonra Gönder ya da çöp kutusu. Pointer olayları
 * parmakta ve farede aynı çalışır; yakalama sayesinde parmak düğmenin dışına çıksa da olaylar kaybolmaz.
 */
export function useHoldToRecord(recorder: Recorder, onDenied: () => void) {
  const locked = ref(false)
  let startY = 0
  let pressing = false

  async function begin(event: PointerEvent) {
    event.preventDefault()
    ;(event.currentTarget as Element).setPointerCapture?.(event.pointerId)
    locked.value = false
    pressing = true
    startY = event.clientY
    await recorder.start().catch(onDenied)
  }

  function slide(event: PointerEvent) {
    if (pressing && startY - event.clientY > LOCK_DISTANCE_PX) locked.value = true
  }

  function release() {
    pressing = false
    if (!locked.value) recorder.stop()
  }

  /** Kilitli kayıt, Gönder ya da çöp kutusuyla biter. */
  function finish(action: () => void) {
    locked.value = false
    action()
  }

  return {
    locked,
    handlers: pointerHandlers(begin, slide, release),
    send: () => finish(recorder.stop),
    cancel: () => finish(recorder.cancel),
  }
}

/** Düğmeye v-bind ile verilecek olaylar; telefonun kendi uzun basma menüsü açılmasın. */
function pointerHandlers(begin: (event: PointerEvent) => Promise<void>, slide: (event: PointerEvent) => void,
  release: () => void) {
  return {
    onPointerdown: (event: PointerEvent) => void begin(event),
    onPointermove: slide,
    onPointerup: release,
    onPointercancel: release,
    onContextmenu: (event: Event) => event.preventDefault(),
  }
}
