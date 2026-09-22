<script setup lang="ts">
import { Mic } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'
import { LIMITS } from '@/core/posts/attachments'
import { useVoiceRecorder } from '@/core/posts/useVoiceRecorder'

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
  <el-button v-if="isSupported" :type="isRecording ? 'danger' : 'default'" size="large" class="voice-button"
    @mousedown="begin" @mouseup="stop" @mouseleave="stop">
    <Mic :size="18" />
    <span v-if="isRecording">{{ durationLabel(seconds) }} / {{ durationLabel(LIMITS.voiceSeconds) }}</span>
    <span v-else>Sesli not için basılı tut</span>
  </el-button>
  <span v-else class="voice-button__unsupported">Sesli not için https gerekir.</span>
</template>

<style scoped>
.voice-button {
  gap: var(--space-2);
  user-select: none;
}

.voice-button__unsupported {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
