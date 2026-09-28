<script setup lang="ts">
import { STATUS_LOOKS, type MovementStatus } from '@/core/materials/materialLabels'
import { VAN_TAG } from '@/mobile/vanTones'
import { STATUS_ICONS } from '@/shared/materials/materialIcons'

/** Hareketin durumu: Vant'ın yumuşak durum etiketinde simge ve yazı ("✓ Tamamlandı", "◷ Yolda"). */
const { status } = defineProps<{ status: MovementStatus }>()
</script>

<template>
  <van-tag round :type="VAN_TAG[STATUS_LOOKS[status].tone]">
    <van-space :size="3" align="center">
      <component :is="STATUS_ICONS[status]" :size="12" :stroke-width="2.4" aria-hidden="true" />
      {{ STATUS_LOOKS[status].label }}
    </van-space>
  </van-tag>
</template>
