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

/** Mikrofonu açar; kayıt durunca mikrofon kapanır ve kayıt dosya olarak teslim edilir. */
async function openRecorder(onStopped: (file: File) => void): Promise<MediaRecorder> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const chunks: Blob[] = []
  const recorder = new MediaRecorder(stream, { mimeType: MIME_PREFERENCE.find((t) => MediaRecorder.isTypeSupported(t)) })
  recorder.ondataavailable = (event) => chunks.push(event.data)
  recorder.onstop = () => {
    stream.getTracks().forEach((track) => track.stop())
    onStopped(voiceFile(chunks, recorder.mimeType))
  }
  return recorder
}

/**
 * Basılı tut, konuş, bırak: WhatsApp'taki gibi. Bir saniyeden kısa kayıt yanlışlıkla dokunma sayılır.
 * cancel: kayıt durur ve gönderilmez (kilitli kayıtta çöp kutusu).
 */
export function useVoiceRecorder(onFinished: (file: File) => void) {
  const isRecording = ref(false)
  const seconds = ref(0)
  let recorder: MediaRecorder | null = null
  let timer: ReturnType<typeof setInterval> | undefined
  let discard = false

  function finish(file: File) {
    isRecording.value = false
    if (!discard && seconds.value >= MIN_SECONDS && file.size > 0) onFinished(file)
  }

  async function start() {
    if (!recordingSupported() || isRecording.value) return
    recorder = await openRecorder(finish)
    discard = false
    recorder.start()
    seconds.value = 0
    isRecording.value = true
    timer = setInterval(() => (++seconds.value >= LIMITS.voiceSeconds ? stop() : undefined), 1000)
  }

  function stop() {
    clearInterval(timer)
    if (recorder?.state === 'recording') recorder.stop()
  }

  function cancel() {
    discard = true
    stop()
  }

  onBeforeUnmount(cancel)
  return { isSupported: recordingSupported(), isRecording, seconds, start, stop, cancel }
}
