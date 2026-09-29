<script setup lang="ts">
import type { MaterialsTab } from '@/core/materials/useMaterialsView'

/** Malzemelerin iki sekmesi, başlığın hemen altında sabit: Hareketler ve Stok. Sayfa kayarken yerinde kalır. */
const { active } = defineProps<{ active: MaterialsTab }>()
const emit = defineEmits<{ change: [tab: MaterialsTab] }>()
</script>

<template>
  <van-tabs :active="active" @change="(name: string | number) => emit('change', name as MaterialsTab)">
    <van-tab title="Hareketler" name="movements" />
    <van-tab title="Stok" name="stock" />
  </van-tabs>
</template>
