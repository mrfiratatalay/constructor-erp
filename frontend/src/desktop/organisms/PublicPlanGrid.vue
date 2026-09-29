<script setup lang="ts">
import { usePublicPlans } from '@/core/marketing/usePublicPlans'
import PublicPlanCard from '@/desktop/molecules/PublicPlanCard.vue'

/** Sitede görünen paketler yan yana. Paketler platform yönetiminden değişir; sayfa sunucudan okur. */
const { plans, isLoading, isError } = usePublicPlans()
</script>

<template>
  <el-skeleton v-if="isLoading" :rows="8" animated />
  <el-alert v-else-if="isError" type="warning" :closable="false" show-icon
    title="Paketler şu an yüklenemedi. Başvuru formundan bize ulaşabilirsiniz." />
  <div v-else class="plan-grid">
    <PublicPlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
  </div>
</template>

<style scoped>
.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
  align-items: start;
}
</style>
