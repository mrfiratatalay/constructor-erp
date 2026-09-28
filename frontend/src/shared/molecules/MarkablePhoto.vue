<script setup lang="ts">
/**
 * Fotoğraf ve üstünde eksik olan yeri gösteren kırmızı nokta (🔴). editable verilirse şef fotoğrafa dokunur, nokta
 * oraya konur (yeniden dokununca yer değiştirir). Nokta fotoğrafın genişliğine ve yüksekliğine oranla (0-1) tutulur:
 * fotoğraf hangi ekranda hangi boyutta açılırsa açılsın aynı yere düşer. Kütüphanesizdir: iki kabuk aynı görür.
 */
export interface PhotoPoint {
  x: number
  y: number
}

const { src, editable = false } = defineProps<{ src: string; editable?: boolean }>()
const mark = defineModel<PhotoPoint | null>('mark', { default: null })

function place(event: MouseEvent) {
  if (!editable) return
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const within = (value: number) => Math.min(1, Math.max(0, Number(value.toFixed(3))))
  mark.value = { x: within((event.clientX - box.left) / box.width), y: within((event.clientY - box.top) / box.height) }
}
</script>

<template>
  <div class="markable-photo" :class="{ 'markable-photo--editable': editable }" data-testid="markable-photo"
    @click="place">
    <img :src="src" :alt="editable ? 'Eksik olan yere dokun' : 'Eksik olan yer işaretli fotoğraf'"
      draggable="false" />
    <span v-if="mark" class="markable-photo__dot" aria-hidden="true"
      :style="{ left: `${mark.x * 100}%`, top: `${mark.y * 100}%` }" />
  </div>
</template>

<style scoped>
.markable-photo {
  position: relative;
  display: inline-block;
  max-width: 100%;
  line-height: 0;
}

.markable-photo--editable {
  cursor: crosshair;
  touch-action: manipulation;
}

.markable-photo img {
  display: block;
  max-width: 100%;
  max-height: 50vh;
  border-radius: var(--radius-md);
  user-select: none;
}

/* Kırmızı nokta, beyaz halkalı: fotoğrafın açık da koyu da her yerinde seçilir. */
.markable-photo__dot {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  background: var(--status-danger);
  box-shadow: 0 0 0 2px rgb(0 0 0 / 0.25);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
