<script setup lang="ts">
import { computed, ref } from 'vue'
import { Pause, Play } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'

const { src, duration } = defineProps<{ src: string; duration: number }>()

const audio = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const position = ref(0)
const progress = computed(() => (duration > 0 ? Math.min(1, position.value / duration) : 0))

function toggle() {
  if (!audio.value) return
  if (isPlaying.value) audio.value.pause()
  else void audio.value.play()
}

/** Çubuğun neresine dokunulursa oraya atlar. */
function seek(event: MouseEvent) {
  const bar = event.currentTarget as HTMLElement
  if (!audio.value || duration <= 0) return
  audio.value.currentTime = ((event.clientX - bar.getBoundingClientRect().left) / bar.clientWidth) * duration
}
</script>

<template>
  <div class="audio-note">
    <button class="audio-note__toggle" type="button" :aria-label="isPlaying ? 'Durdur' : 'Sesli notu oynat'"
      @click="toggle">
      <Pause v-if="isPlaying" :size="18" />
      <Play v-else :size="18" />
    </button>
    <div class="audio-note__track" role="slider" aria-label="Sesli not konumu" :aria-valuenow="Math.round(position)"
      aria-valuemin="0" :aria-valuemax="Math.round(duration)" @click="seek">
      <span class="audio-note__fill" :style="{ width: `${progress * 100}%` }" />
    </div>
    <span class="audio-note__time">{{ durationLabel(isPlaying || position > 0 ? position : duration) }}</span>
    <audio ref="audio" :src="src" preload="metadata" @play="isPlaying = true" @pause="isPlaying = false"
      @ended="(isPlaying = false), (position = 0)" @timeupdate="position = audio?.currentTime ?? 0" />
  </div>
</template>

<style scoped>
.audio-note {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3) var(--space-2) var(--space-2);
  border-radius: 999px;
  background: var(--surface-muted);
}

.audio-note__toggle {
  display: grid;
  place-items: center;
  flex: none;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: var(--brand-primary);
  color: var(--brand-on-primary);
  cursor: pointer;
}

.audio-note__track {
  position: relative;
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: var(--border-soft);
  cursor: pointer;
}

.audio-note__fill {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  background: var(--brand-primary);
}

.audio-note__time {
  min-width: 36px;
  color: var(--text-muted);
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
</style>
