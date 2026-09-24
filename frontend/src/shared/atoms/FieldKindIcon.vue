<script setup lang="ts">
import type { Component } from 'vue'
import { Check, Clock, Package, RefreshCw } from 'lucide-vue-next'
import type { FieldKind } from '@/core/field/fieldKind'

/**
 * Saha satırının eksendeki simgesi: yeşil ✓ yapıldı, mavi ↻ devam ediyor, kahve 📦 teslimat, sarı ! sorun.
 * Düz notta yalnızca küçük gri nokta; pending: bu telefondan henüz gitmedi (🕓). Anlamı satırın yazısı taşır,
 * simge yalnızca göz gezdirmeyi kolaylaştırır (TASARIM.md İlke 2).
 */
const { kind } = defineProps<{ kind: FieldKind | 'pending' }>()

const ICONS: Partial<Record<FieldKind | 'pending', Component>> = {
  done: Check,
  progress: RefreshCw,
  delivery: Package,
  pending: Clock,
}
const LABELS: Record<FieldKind | 'pending', string> = {
  done: 'Yapıldı',
  progress: 'Devam ediyor',
  delivery: 'Teslimat',
  issue: 'Sorun',
  note: 'Not',
  pending: 'Gönderiliyor',
}
</script>

<template>
  <span class="field-icon" :class="`field-icon--${kind}`" role="img" :aria-label="LABELS[kind]">
    <component :is="ICONS[kind]" v-if="ICONS[kind]" :size="15" :stroke-width="2.5" />
    <b v-else-if="kind === 'issue'" aria-hidden="true">!</b>
  </span>
</template>

<style scoped>
.field-icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #fff;
  font-size: 16px;
  line-height: 1;
}

.field-icon--done {
  background: var(--field-done);
}

.field-icon--progress {
  background: var(--field-progress);
}

.field-icon--delivery {
  background: var(--field-delivery);
}

.field-icon--issue {
  background: var(--field-issue);
}

.field-icon--pending {
  background: var(--field-quiet);
}

/* Düz not: eksende sessiz bir nokta; çizgi kesilmesin diye zemin rengiyle çevrili. */
.field-icon--note::before {
  content: '';
  width: 10px;
  height: 10px;
  border: 2px solid var(--canvas);
  border-radius: 50%;
  background: var(--field-quiet);
}
</style>
