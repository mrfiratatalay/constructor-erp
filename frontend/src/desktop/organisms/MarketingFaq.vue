<script setup lang="ts">
import { ref } from 'vue'
import { FAQ } from '@/core/marketing/marketingCopy'

const open = ref(FAQ[0]?.question ?? '')
</script>

<template>
  <el-collapse v-model="open" accordion class="marketing-faq">
    <el-collapse-item v-for="(item, index) in FAQ" :key="item.question" :name="item.question">
      <template #title>
        <span class="marketing-faq__question">
          <span class="marketing-faq__number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span>{{ item.question }}</span>
        </span>
      </template>
      <p>{{ item.answer }}</p>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.marketing-faq { max-width: 920px; margin-inline: auto; --el-collapse-border-color: var(--mk-line); --el-collapse-header-bg-color: transparent; --el-collapse-content-bg-color: transparent; --el-collapse-header-text-color: var(--mk-ink); }
.marketing-faq :deep(.el-collapse-item__header) { min-height: 78px; height: auto; padding-block: 22px; font-size: 16px; font-weight: var(--weight-semibold); line-height: 1.6; }
.marketing-faq :deep(.el-collapse-item__content) { padding: 0 0 24px; }
.marketing-faq :deep(.el-collapse-item__arrow) { flex: none; margin-left: 20px; color: var(--mk-muted); }
.marketing-faq__question { display: flex; align-items: baseline; gap: 24px; min-width: 0; text-align: left; }
.marketing-faq__number { flex: none; width: 24px; color: var(--mk-muted); font-size: 12px; font-weight: 500; font-variant-numeric: tabular-nums; }
.marketing-faq p { max-width: 70ch; margin: 0 32px 0 48px; color: var(--mk-muted); font-size: 14px; line-height: 1.9; }
</style>
