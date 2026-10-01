<script setup lang="ts">
import { PackageSearch } from 'lucide-vue-next'
import { usePublicPlans } from '@/core/marketing/usePublicPlans'
import PublicPlanCard from '@/desktop/molecules/PublicPlanCard.vue'

const { plans, isLoading, isError, refetch } = usePublicPlans()
</script>

<template>
  <div v-if="isLoading" class="plan-grid" aria-busy="true" aria-label="Paketler yükleniyor">
    <el-skeleton v-for="placeholder in 3" :key="placeholder" :rows="7" animated class="plan-grid__skeleton" />
  </div>
  <div v-else-if="isError" class="plan-grid__state" role="status">
    <el-empty description="Paketler şu an yüklenemedi." :image-size="64">
      <template #image><PackageSearch :size="40" aria-hidden="true" /></template>
      <div class="plan-grid__state-actions">
        <el-button @click="refetch()">Yeniden deneyin</el-button>
        <RouterLink :to="{ name: 'apply' }"><el-button type="primary">Tanıtım isteyin</el-button></RouterLink>
      </div>
    </el-empty>
  </div>
  <div v-else-if="!plans.length" class="plan-grid__state">
    <el-empty description="Henüz yayınlanmış paket yok." :image-size="64">
      <template #image><PackageSearch :size="40" aria-hidden="true" /></template>
      <p class="plan-grid__empty-note">Firmanıza uygun seçenekleri birlikte değerlendirebiliriz.</p>
      <RouterLink :to="{ name: 'apply' }"><el-button type="primary">Tanıtım isteyin</el-button></RouterLink>
    </el-empty>
  </div>
  <div v-else class="plan-grid">
    <PublicPlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
  </div>
</template>

<style scoped>
.plan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); align-items: stretch; gap: 24px; }
.plan-grid__skeleton { min-height: 440px; padding: 28px; border: 1px solid var(--mk-line); border-radius: 16px; background: var(--surface); }
.plan-grid__state { padding: 16px 24px; border: 1px solid var(--mk-line); border-radius: 16px; background: var(--surface); }
.plan-grid__state :deep(.el-empty__image) { display: grid; place-items: center; color: var(--mk-muted); }
.plan-grid__state :deep(.el-empty__description p) { color: var(--mk-muted); font-size: 14px; }
.plan-grid__state-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
.plan-grid__state-actions a { text-decoration: none; }
.plan-grid__empty-note { margin: 0 0 20px; color: var(--mk-muted); font-size: 13px; line-height: 1.7; }
</style>
