<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

/**
 * Yoklama listesinde bir kişi: adına tıklayınca sağda takvimi açılır (bağlantı, adres paylaşılabilir); sağdaki
 * eylem (işaretleme) bağlantının dışında durur: tıklanabilir bir şeyin içine ikinci tıklanabilir konmaz.
 */
const { to, selected = false } = defineProps<{ to: RouteLocationRaw; selected?: boolean }>()
</script>

<template>
  <div class="roll-member-row" :class="{ 'roll-member-row--selected': selected }">
    <RouterLink :to="to" class="roll-member-row__link" :aria-current="selected || undefined">
      <span class="roll-member-row__name"><slot name="title" /></span>
      <span v-if="$slots.default" class="roll-member-row__detail"><slot /></span>
    </RouterLink>
    <span class="roll-member-row__action"><slot name="action" /></span>
  </div>
</template>

<style scoped>
.roll-member-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-right: var(--space-4);
  border-bottom: 1px solid var(--border-soft);
  border-left: 3px solid transparent;
  background: var(--surface);
  transition: background 0.12s;
}

.roll-member-row:hover {
  background: var(--surface-muted);
}

.roll-member-row--selected,
.roll-member-row--selected:hover {
  background: var(--brand-tint);
}

.roll-member-row__link {
  display: grid;
  flex: 1;
  min-width: 0;
  gap: 2px;
  padding: var(--space-3) 0 var(--space-3) var(--space-4);
  color: inherit;
  text-decoration: none;
}

.roll-member-row__name {
  overflow: hidden;
  font-weight: var(--weight-semibold);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.roll-member-row__detail {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.roll-member-row__action {
  flex-shrink: 0;
}
</style>
