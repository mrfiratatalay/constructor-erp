<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { usePlanAdmin } from '@/core/admin/usePlanAdmin'
import PlanCard from '@/desktop/molecules/PlanCard.vue'
import PlanEditDialog from '@/desktop/organisms/PlanEditDialog.vue'

/** Paketler: fiyat ve modüller koddan değil buradan gelir; tanıtım sitesinin fiyat tablosu da bu veridir. */
const { plans, features, editing, edit, save, isSaving } = usePlanAdmin()

async function onSave() {
  try {
    await save()
    ElMessage.success('Paket güncellendi; tanıtım sitesi ve firmaların modülleri hemen yenilendi.')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-scrollbar>
    <el-main class="plans">
      <header>
        <h1>Paketler</h1>
        <p>Fiyat değişikliği yeni dönemlere yansır; açık dönemler kendi fiyatını korur. Modül değişikliği hemen geçerlidir.</p>
      </header>
      <div class="plans__grid">
        <PlanCard v-for="plan in plans ?? []" :key="plan.id" :plan="plan" :features="features ?? []" @edit="edit(plan)" />
      </div>
    </el-main>
    <PlanEditDialog v-model:form="editing.form" :features="features ?? []" :saving="isSaving" @save="onSave" />
  </el-scrollbar>
</template>

<style scoped>
.plans {
  display: grid;
  gap: var(--space-5);
  max-width: 1320px;
  padding: var(--space-8);
}

.plans h1 {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
}

.plans header p {
  margin: var(--space-1) 0 0;
  color: var(--text-muted);
}

.plans__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-5);
  align-items: start;
}
</style>
