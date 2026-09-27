<script setup lang="ts">
import { computed } from 'vue'
import type { DayCounts } from '@/core/puantaj/puantajBook'

/**
 * Bugünün özeti, dört renkli sayı: geldi, gelmedi, izinli ve kalan (işaretlenmedi). Kalan sıfıra inince yoklama
 * kendiliğinden tamamdır. Yarım gün "Geldi"nin altında yazar.
 */
const { counts } = defineProps<{ counts: DayCounts }>()

const items = computed(() => [
  {
    key: 'present',
    label: counts.HALF_DAY ? `Geldi (+${counts.HALF_DAY} yarım)` : 'Geldi',
    value: counts.PRESENT,
    type: 'success' as const,
  },
  { key: 'absent', label: 'Gelmedi', value: counts.ABSENT, type: 'danger' as const },
  { key: 'leave', label: 'İzinli', value: counts.LEAVE, type: 'primary' as const },
  { key: 'unmarked', label: 'Kalan', value: counts.unmarked, type: 'default' as const },
])
</script>

<template>
  <van-grid :column-num="4" :border="false">
    <van-grid-item v-for="item in items" :key="item.key" :text="item.label">
      <template #icon>
        <van-tag :type="item.type" :plain="item.type === 'primary'" size="large" round>{{ item.value }}</van-tag>
      </template>
    </van-grid-item>
  </van-grid>
</template>
