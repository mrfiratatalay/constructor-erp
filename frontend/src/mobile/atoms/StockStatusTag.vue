<script setup lang="ts">
import type { StockRowStatus } from '@/core/api/generated/model'
import { STOCK_LOOKS } from '@/core/materials/materialLabels'
import { VAN_TAG } from '@/mobile/vanTones'

/** Stok durumu: Normal, Kritik ya da Tükendi. */
const { status } = defineProps<{ status: StockRowStatus }>()
</script>

<template>
  <van-tag round :type="VAN_TAG[STOCK_LOOKS[status].tone]">{{ STOCK_LOOKS[status].label }}</van-tag>
</template>
