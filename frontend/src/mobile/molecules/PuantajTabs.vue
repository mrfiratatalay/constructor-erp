<script setup lang="ts">
import type { PuantajTab } from '@/core/puantaj/usePuantajTab'

/**
 * Yoklamanın iki sekmesi, başlığın hemen altında sabit (şantiyedeki Sohbet / Saha gibi): Bugün ve Puantaj. İçerik
 * sekmelerin altında değil, sayfanın kendisinde; sayfa kayarken sekmeler yerinde kalır.
 */
const { active } = defineProps<{ active: PuantajTab }>()
const emit = defineEmits<{ change: [tab: PuantajTab] }>()
</script>

<template>
  <van-tabs :active="active" @change="(name: string | number) => emit('change', name as PuantajTab)">
    <van-tab title="Bugün" name="today" />
    <van-tab title="Puantaj" name="month" />
  </van-tabs>
</template>
