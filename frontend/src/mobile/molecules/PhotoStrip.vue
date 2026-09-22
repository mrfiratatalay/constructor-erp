<script setup lang="ts">
/** Günün son fotoğrafları yan yana kare; gösterilenden fazlası son karenin üstünde "+N". */
const { urls, total } = defineProps<{ urls: string[]; total: number }>()
</script>

<template>
  <span class="photo-strip">
    <van-image v-for="(url, index) in urls" :key="url" :src="url" fit="cover" class="photo-strip__photo">
      <span v-if="index === urls.length - 1 && total > urls.length" class="photo-strip__more">
        +{{ total - urls.length }}
      </span>
    </van-image>
  </span>
</template>

<style scoped>
/* Üç sütun sabit: bir ya da iki fotoğrafta da kareler aynı boyda kalır. */
.photo-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.photo-strip__photo {
  display: block;
  overflow: hidden;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
}

.photo-strip__more {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(15 23 42 / 0.55);
  color: #fff;
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
}
</style>
