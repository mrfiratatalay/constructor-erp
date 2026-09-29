<script setup lang="ts">
import { computed } from 'vue'
import type { MovementDetail } from '@/core/api/generated/model'
import { movementFacts } from '@/core/materials/movementFacts'

/** Hareketin bilgileri, yalnızca dolu olanlar (İlke 3); en altta kaydı kim, ne zaman girdi. */
const { detail } = defineProps<{ detail: MovementDetail }>()
const facts = computed(() => movementFacts(detail, ['material', 'category']))
</script>

<template>
  <van-cell-group inset>
    <van-cell v-for="[label, value] in facts" :key="label" :title="label" :value="value" />
  </van-cell-group>
</template>
