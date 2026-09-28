<script setup lang="ts">
import { MOVEMENT_CHOICES, TYPE_LOOKS, type MovementType } from '@/core/materials/materialLabels'
import { TYPE_ICONS } from '@/shared/materials/materialIcons'

/**
 * İşlem türü: altı kart (3 × 2), her biri türün simgesi ve adıyla; seçili kart türün kendi renginde çerçeveli.
 * Tür değişince form yalnızca o türün alanlarını gösterir; kısa amacı ipucu olarak yazar. İki kabuk da bunu
 * kullanır (kütüphanesiz: kartların tür renkleri kütüphanelerde yok). locked: iade ödünçten açıldıysa tür değişmez.
 */
const type = defineModel<MovementType>({ required: true })
const { locked = false } = defineProps<{ locked?: boolean }>()
</script>

<template>
  <div class="type-chooser" role="radiogroup" aria-label="İşlem türü">
    <button v-for="choice in MOVEMENT_CHOICES" :key="choice" type="button" role="radio" class="type-chooser__card"
      :class="[`type-chooser__card--${TYPE_LOOKS[choice].tone}`, { 'type-chooser__card--active': type === choice }]"
      :aria-checked="type === choice" :title="TYPE_LOOKS[choice].hint" :disabled="locked && type !== choice"
      @click="type = choice">
      <component :is="TYPE_ICONS[choice]" :size="19" :stroke-width="2" aria-hidden="true" class="type-chooser__icon" />
      <span>{{ TYPE_LOOKS[choice].label }}</span>
    </button>
  </div>
</template>

<style scoped>
.type-chooser {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
}

.type-chooser__card {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 56px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
  color: var(--text-muted);
  font: inherit;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  line-height: 1.25;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.type-chooser__icon {
  flex: none;
}

.type-chooser__card:hover:not(:disabled) {
  border-color: var(--tone-fg);
  color: var(--tone-fg);
}

.type-chooser__card:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.type-chooser__card--active {
  border-color: var(--tone-fg);
  background: var(--tone-bg);
  box-shadow: 0 0 0 1px var(--tone-fg);
  color: var(--tone-fg);
}

.type-chooser__card--site { --tone-fg: var(--move-site); --tone-bg: var(--move-site-bg); }
.type-chooser__card--used { --tone-fg: var(--move-used); --tone-bg: var(--move-used-bg); }
.type-chooser__card--out { --tone-fg: var(--move-out); --tone-bg: var(--move-out-bg); }
.type-chooser__card--transfer { --tone-fg: var(--move-transfer); --tone-bg: var(--move-transfer-bg); }
.type-chooser__card--in { --tone-fg: var(--move-in); --tone-bg: var(--move-in-bg); }
.type-chooser__card--return { --tone-fg: var(--move-return); --tone-bg: var(--move-return-bg); }
</style>
