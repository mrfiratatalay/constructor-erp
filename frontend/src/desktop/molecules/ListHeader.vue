<script setup lang="ts">
/** Liste sütununun başlığı: ad, yanında küçük bilgi (tarih, sayı) ve eylem (＋). Altına tek satır eklenebilir. */
const { title, meta } = defineProps<{ title: string; meta?: string }>()
</script>

<template>
  <header class="list-header">
    <div class="list-header__top">
      <h1 class="list-header__title" :title="title">{{ title }}</h1>
      <span v-if="meta" class="list-header__meta">{{ meta }}</span>
      <span v-if="$slots.action" class="list-header__action"><slot name="action" /></span>
    </div>
    <slot />
  </header>
</template>

<style scoped>
.list-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-2);
}

.list-header__top {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 32px;
}

/* Uzun firma adı (ör. "… Anonim Şirketi") üç satıra kırılıp listeyi aşağı itiyordu: tek satır, tamamı title'da. */
.list-header__title {
  min-width: 0;
  overflow: hidden;
  margin: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

/* Eylem (＋) sağda durur; yanında küçük bilgi olmasa da. */
.list-header__action {
  flex: none;
  margin-left: auto;
}

.list-header__meta {
  flex: 1;
  color: var(--text-subtle);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}
</style>
