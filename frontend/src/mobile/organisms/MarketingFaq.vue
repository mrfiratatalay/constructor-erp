<script setup lang="ts">
import { ref } from 'vue'
import { FAQ } from '@/core/marketing/marketingCopy'

/** Sık sorulanlar telefonda: tek seferde bir cevap açık. */
const open = ref<string>(FAQ[0].question)
</script>

<template>
  <van-collapse v-model="open" accordion class="faq">
    <van-collapse-item v-for="item in FAQ" :key="item.question" :name="item.question" :title="item.question">
      {{ item.answer }}
    </van-collapse-item>
  </van-collapse>
</template>

<style scoped>
.faq {
  overflow: hidden;
  border-radius: var(--radius-lg);
  --van-collapse-item-content-font-size: var(--text-base);
  --van-collapse-item-content-line-height: 1.6;
}

.faq :deep(.van-cell__title) {
  font-weight: var(--weight-bold);
}
</style>
