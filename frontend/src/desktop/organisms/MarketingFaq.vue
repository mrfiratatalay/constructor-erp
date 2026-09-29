<script setup lang="ts">
import { ref } from 'vue'
import { FAQ } from '@/core/marketing/marketingCopy'

/** Sık sorulanlar: satın almadan önce en çok sorulan beş soru. İlki açık gelir. */
const open = ref<string[]>([FAQ[0].question])
</script>

<template>
  <el-collapse v-model="open" class="faq">
    <el-collapse-item v-for="item in FAQ" :key="item.question" :name="item.question" :title="item.question">
      <p>{{ item.answer }}</p>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
.faq {
  max-width: var(--layout-reading-width);
  margin-inline: auto;
  --el-collapse-header-font-size: var(--text-md);
  --el-collapse-header-height: 64px;
}

.faq :deep(.el-collapse-item__header) {
  font-weight: var(--weight-bold);
}

.faq p {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-base);
  line-height: 1.7;
}
</style>
