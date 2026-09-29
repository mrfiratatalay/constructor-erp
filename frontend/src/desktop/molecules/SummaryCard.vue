<script setup lang="ts">
import type { Component } from 'vue'
import type { MovementTone } from '@/core/materials/materialLabels'

/**
 * Özet kartı: renkli daire içinde simge, başlık, büyük sayı ve birimi ("42 kalem"), altında ne saydığı. Tıklanınca
 * listeyi o konuya süzer ya da ilgili paneli açar; üstüne gelince kart hafifçe yükselir (tıklanır olduğu görünür).
 */
const {
  title,
  value,
  unit,
  caption,
  icon,
  tone,
  alert = false,
} = defineProps<{
  title: string
  value: number | undefined
  unit: string
  caption: string
  icon: Component
  tone: MovementTone
  alert?: boolean
}>()
const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <el-card shadow="hover" class="summary-card" :class="`summary-card--${tone}`" role="button" tabindex="0"
    @click="emit('open')" @keydown.enter="emit('open')">
    <el-space :size="16" alignment="flex-start">
      <span class="summary-card__icon" aria-hidden="true"><component :is="icon" :size="22" :stroke-width="2" /></span>
      <el-space direction="vertical" alignment="flex-start" :size="6">
        <el-text tag="b">{{ title }}</el-text>
        <span class="summary-card__value">
          <el-skeleton v-if="value === undefined" :rows="0" animated style="width: 80px" />
          <template v-else><strong>{{ value }}</strong> {{ unit }}</template>
        </span>
        <el-text :type="alert ? 'danger' : 'info'" size="small">{{ caption }}</el-text>
      </el-space>
    </el-space>
  </el-card>
</template>

<style scoped>
.summary-card {
  height: 100%;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.summary-card__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--tone-bg);
  color: var(--tone-fg);
}

.summary-card__value {
  color: var(--text-strong);
  font-size: var(--text-md);
  font-weight: var(--weight-semibold);
}

.summary-card__value strong {
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
  letter-spacing: -0.02em;
}

.summary-card--site { --tone-fg: var(--move-site); --tone-bg: var(--move-site-bg); }
.summary-card--used { --tone-fg: var(--move-used); --tone-bg: var(--move-used-bg); }
.summary-card--out { --tone-fg: var(--move-out); --tone-bg: var(--move-out-bg); }
.summary-card--return { --tone-fg: var(--move-return); --tone-bg: var(--move-return-bg); }
</style>
