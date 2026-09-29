<script setup lang="ts">
import type { StockRowStatus } from '@/core/api/generated/model'
import { STOCK_LOOKS } from '@/core/materials/materialLabels'

/** Stok durumu: Normal, Kritik (eşiğin altında) ya da Tükendi. */
const { status } = defineProps<{ status: StockRowStatus }>()
</script>

<template>
  <el-tag :type="STOCK_LOOKS[status].tone" effect="light" round disable-transitions>
    {{ STOCK_LOOKS[status].label }}
  </el-tag>
</template>
