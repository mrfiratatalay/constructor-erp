<script setup lang="ts">
import { ref } from 'vue'
import { FAQ } from '@/core/marketing/marketingCopy'

const open = ref('')
</script>

<template>
  <van-collapse v-model="open" accordion :border="false" class="marketing-faq">
    <van-collapse-item v-for="item in FAQ" :key="item.question" :name="item.question" :title="item.question" :border="false">
      {{ item.answer }}
    </van-collapse-item>
  </van-collapse>
</template>

<style scoped>
.marketing-faq { overflow: hidden; max-width: 760px; margin-inline: auto; border: 1px solid var(--mk-line); border-radius: 16px; background: #fff; --van-collapse-item-content-font-size: 13px; --van-collapse-item-content-line-height: 1.85; --van-collapse-item-content-text-color: var(--mk-muted); }
.marketing-faq :deep(.van-collapse-item + .van-collapse-item) { border-top: 1px solid var(--mk-line); }
.marketing-faq :deep(.van-cell) { padding: 20px 18px; gap: 12px; background: transparent; }
.marketing-faq :deep(.van-cell__title) { color: var(--mk-ink); font-size: 13px; font-weight: 650; line-height: 1.65; }
.marketing-faq :deep(.van-collapse-item__content) { padding: 0 18px 22px; background: transparent; }
.marketing-faq :deep(.van-cell__right-icon) { color: var(--mk-muted); }
</style>
