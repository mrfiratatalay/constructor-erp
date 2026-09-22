<script setup lang="ts">
import { Mic } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'
import { LIMITS } from '@/core/posts/attachments'
import { useVoiceRecorder } from '@/core/posts/useVoiceRecorder'

/** Basılı tut, konuş, bırak: WhatsApp'taki gibi. Düğme Vant'tan; kayıt mantığı core'dan. */
const emit = defineEmits<{ recorded: [file: File]; failed: [message: string] }>()
const { isSupported, isRecording, seconds, start, stop } = useVoiceRecorder((file) => emit('recorded', file))

async function begin() {
  try {
    await start()
  } catch {
    emit('failed', 'Mikrofona izin verilmedi. Tarayıcı ayarlarından mikrofon iznini aç.')
  }
}
</script>

<template>
  <van-button v-if="isSupported" block round :type="isRecording ? 'danger' : 'default'" :icon="undefined"
    class="voice-field" @touchstart.prevent="begin" @touchend="stop" @touchcancel="stop"
    @mousedown.prevent="begin" @mouseup="stop" @mouseleave="stop">
    <Mic :size="18" class="voice-field__icon" />
    <span v-if="isRecording">{{ durationLabel(seconds) }} / {{ durationLabel(LIMITS.voiceSeconds) }} · bırakınca eklenir</span>
    <span v-else>Sesli not için basılı tut</span>
  </van-button>
  <p v-else class="voice-field__unsupported">
    Sesli not için uygulamanın güvenli bağlantıyla (https) açılması gerekir.
  </p>
</template>

<style scoped>
.voice-field {
  /* Uzun basınca telefonun metin seçme menüsü açılmasın. */
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.voice-field__icon {
  margin-right: var(--space-2);
  vertical-align: -4px;
}

.voice-field__unsupported {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
