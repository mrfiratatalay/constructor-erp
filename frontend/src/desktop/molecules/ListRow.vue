<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

/**
 * Liste satırı: üstte başlık ve sağda küçük bilgi, altında tek satır ayrıntı. Seçili satır lacivert zeminli.
 * to verilirse bağlantıdır (adres değişir, paylaşılabilir), verilmezse düğmedir (select yayar).
 */
const { selected = false, to } = defineProps<{
  selected?: boolean
  to?: RouteLocationRaw
}>()
const emit = defineEmits<{ select: [] }>()
</script>

<template>
  <component :is="to ? RouterLink : 'button'" :to="to" :type="to ? undefined : 'button'" class="list-row"
    :class="{ 'list-row--selected': selected }" :aria-current="selected || undefined"
    @click="to || emit('select')">
    <span class="list-row__top">
      <span class="list-row__title"><slot name="title" /></span>
      <span class="list-row__meta"><slot name="meta" /></span>
    </span>
    <span v-if="$slots.default" class="list-row__detail"><slot /></span>
  </component>
</template>

<style scoped>
.list-row {
  display: grid;
  gap: 4px;
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 0;
  border-bottom: 1px solid var(--border-soft);
  border-left: 3px solid transparent;
  background: var(--surface);
  color: inherit;
  font: inherit;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.12s;
}

.list-row:hover {
  background: var(--surface-muted);
}

.list-row--selected,
.list-row--selected:hover {
  background: var(--brand-tint);
}

.list-row__top {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.list-row__title {
  flex: 1;
  overflow: hidden;
  font-weight: var(--weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-row__meta {
  display: flex;
  flex: none;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-subtle);
  font-size: var(--text-sm);
}

.list-row__detail {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
