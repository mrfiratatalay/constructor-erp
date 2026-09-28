<script setup lang="ts">
import { computed } from 'vue'
import { TYPE_LOOKS, type MovementType } from '@/core/materials/materialLabels'
import { TYPE_ICONS } from '@/shared/materials/materialIcons'

/**
 * Hareket türü rozeti: türün kendi tonunda açık zemin, koyu yazı ve simge ("→ Şantiyeye Gönderildi"). İki kütüphane
 * de mor ve teal tonu taşımadığı için kütüphanesiz çizilir; durum etiketi ise kütüphanenin etiketiyle çizilir, böylece
 * tür ile durum yan yana karışmaz.
 */
const { type, size = 'default' } = defineProps<{ type: MovementType; size?: 'small' | 'default' }>()
const look = computed(() => TYPE_LOOKS[type])
</script>

<template>
  <span class="movement-badge" :class="[`movement-badge--${look.tone}`, `movement-badge--${size}`]">
    <component :is="TYPE_ICONS[type]" :size="size === 'small' ? 13 : 15" :stroke-width="2.25" aria-hidden="true" />
    {{ look.label }}
  </span>
</template>

<style scoped>
.movement-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--badge-bg);
  color: var(--badge-fg);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  line-height: 18px;
  white-space: nowrap;
}

.movement-badge--small {
  gap: 4px;
  padding: 2px 8px;
  font-size: var(--text-xs);
}

.movement-badge--site { --badge-fg: var(--move-site); --badge-bg: var(--move-site-bg); }
.movement-badge--used { --badge-fg: var(--move-used); --badge-bg: var(--move-used-bg); }
.movement-badge--out { --badge-fg: var(--move-out); --badge-bg: var(--move-out-bg); }
.movement-badge--transfer { --badge-fg: var(--move-transfer); --badge-bg: var(--move-transfer-bg); }
.movement-badge--in { --badge-fg: var(--move-in); --badge-bg: var(--move-in-bg); }
.movement-badge--return { --badge-fg: var(--move-return); --badge-bg: var(--move-return-bg); }
.movement-badge--count { --badge-fg: var(--move-count); --badge-bg: var(--move-count-bg); }
</style>
