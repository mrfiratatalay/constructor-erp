import { onBeforeUnmount, ref } from 'vue'
import { LIMITS } from '@/core/posts/attachments'

/** iPhone (Safari) mp4, Android (Chrome) webm kaydeder; sunucu ikisini de her cihazda çalan biçime çevirir. */
const MIME_PREFERENCE = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']
const MIN_SECONDS = 1

/** Mikrofon yalnızca güvenli bağlamda (https, localhost) açılır. */
function recordingSupported(): boolean {
  return typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
}

function voiceFile(chunks: Blob[], mimeType: string): File {
  const type = mimeType || 'audio/webm'
  return new File(chunks, `sesli-not.${type.includes('mp4') ? 'm4a' : 'webm'}`, { type })
}

/** Basılı tut, konuş, bırak: WhatsApp'taki gibi. Bir saniyeden kısa kayıt yanlışlıkla dokunma sayılır. */
export function useVoiceRecorder(onFinished: (file: File) => void) {
  const isRecording = ref(false)
  const seconds = ref(0)
  let recorder: MediaRecorder | null = null
  let timer: ReturnType<typeof setInterval> | undefined

  async function start() {
    if (!recordingSupported() || isRecording.value) return
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const chunks: Blob[] = []
    recorder = new MediaRecorder(stream, { mimeType: MIME_PREFERENCE.find((t) => MediaRecorder.isTypeSupported(t)) })
    recorder.ondataavailable = (event) => chunks.push(event.data)
    recorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop())
      isRecording.value = false
      if (seconds.value >= MIN_SECONDS && chunks.length) onFinished(voiceFile(chunks, recorder?.mimeType ?? ''))
    }
    recorder.start()
    seconds.value = 0
    isRecording.value = true
    timer = setInterval(() => (++seconds.value >= LIMITS.voiceSeconds ? stop() : undefined), 1000)
  }

  function stop() {
    clearInterval(timer)
    if (recorder?.state === 'recording') recorder.stop()
  }

  onBeforeUnmount(stop)
  return { isSupported: recordingSupported(), isRecording, seconds, start, stop }
}
