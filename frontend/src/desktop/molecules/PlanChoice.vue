<script setup lang="ts">
import type { PlanAdminView } from '@/core/api/generated/model'
import { MONTH_CHOICES } from '@/core/admin/adminLabels'
import { formatMoney } from '@/core/format/money'

/** Paket ve süre seçimi: paket kartları (fiyatıyla) ve 1/3/6/12 ay. */
const { plans } = defineProps<{ plans: PlanAdminView[] }>()
const planId = defineModel<string>('planId', { required: true })
const months = defineModel<number>('months', { required: true })
const monthOptions = MONTH_CHOICES.map((value) => ({ label: `${value} ay`, value }))
</script>

<template>
  <el-form-item label="Paket" required>
    <el-radio-group v-model="planId" class="plan-choice">
      <el-radio-button v-for="plan in plans" :key="plan.id" :value="plan.id">
        <strong>{{ plan.name }}</strong>
        <small>{{ plan.monthlyPrice == null ? 'Teklifle' : `${formatMoney(plan.monthlyPrice)} / ay` }}</small>
      </el-radio-button>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="Süre">
    <el-segmented v-model="months" :options="monthOptions" />
  </el-form-item>
</template>

<style scoped>
.plan-choice :deep(.el-radio-button__inner) {
  display: grid;
  gap: 2px;
  min-width: 140px;
}

.plan-choice small {
  font-weight: var(--weight-medium);
  opacity: 0.8;
}
</style>
