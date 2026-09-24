<script setup lang="ts">
import type { MediaView } from '@/core/api/generated/model'

/** Bilgi ekranında "Medya ve belgeler · 124 ›" ve son fotoğrafların yatay şeridi (WhatsApp gibi). */
const { count, strip } = defineProps<{ count: number; strip: MediaView[] }>()
const emit = defineEmits<{ open: []; openPhoto: [index: number] }>()
</script>

<template>
  <van-cell-group inset class="media-row">
    <van-cell title="Medya ve belgeler" :value="String(count)" is-link @click="emit('open')" />
    <van-cell v-if="strip.length">
      <div class="media-row__strip">
        <img v-for="(item, index) in strip" :key="item.id" :src="item.thumbnailUrl ?? ''" alt=""
          class="media-row__thumb" loading="lazy" @click="emit('openPhoto', index)" />
      </div>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.media-row {
  --van-cell-background: var(--surface-muted);
}

.media-row__strip {
  display: flex;
  gap: 4px;
  overflow-x: auto;
}

.media-row__thumb {
  flex: none;
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}
</style>
