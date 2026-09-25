import { computed } from 'vue'
import { useHoldToRecord } from '@/core/gestures/useHoldToRecord'
import type { Composer } from '@/core/posts/useComposer'
import { useVoiceRecorder } from '@/core/posts/useVoiceRecorder'

const MIC_DENIED = 'Mikrofona izin verilmedi. Tarayıcı ayarlarından mikrofon iznini aç.'

/**
 * Gönderme çubuğunun sesli notu: 🎤 basılı tut, konuş, bırak → gider (WhatsApp gibi); yukarı kaydırınca
 * kilitlenir. Not, çubuktaki taslağa eklenip hemen gönderilir. 🎤 yalnızca gönderilecek bir şey yokken görünür:
 * yazı ya da ek varken yerinde ➤ durur. onProblem: kullanıcıya gösterilecek hata (mikrofon izni yok, not eklenemedi).
 */
export function useVoiceNote(composer: Composer, onProblem: (message: string) => void) {
  const recorder = useVoiceRecorder((file) => void send(file))
  const hold = useHoldToRecord(recorder, () => onProblem(MIC_DENIED))

  async function send(file: File) {
    const problems = await composer.addFiles([file])
    if (problems.length) onProblem(problems.join('\n'))
    else await composer.submit()
  }

  return {
    showMic: computed(() => !composer.canSend.value && recorder.isSupported),
    isRecording: recorder.isRecording,
    seconds: recorder.seconds,
    locked: hold.locked,
    handlers: hold.handlers,
    send: hold.send,
    cancel: hold.cancel,
  }
}
