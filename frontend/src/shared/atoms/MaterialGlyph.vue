<script setup lang="ts">
import { computed } from 'vue'
import { materialIcon } from '@/shared/materials/materialIcons'

/** Malzemenin küçük simgesi, yumuşak kare içinde (tabloda adın solunda): göz satırı adından önce yakalar. */
const { name, size = 32 } = defineProps<{ name: string; size?: number }>()
const icon = computed(() => materialIcon(name))
</script>

<template>
  <span class="material-glyph" :style="{ width: `${size}px`, height: `${size}px` }" aria-hidden="true">
    <component :is="icon" :size="Math.round(size * 0.52)" :stroke-width="1.9" />
  </span>
</template>

<style scoped>
.material-glyph {
  display: inline-grid;
  flex: none;
  place-items: center;
  border: 1px solid var(--border-soft);
  border-radius: 9px;
  background: var(--surface-muted);
  color: var(--text-muted);
}
</style>
