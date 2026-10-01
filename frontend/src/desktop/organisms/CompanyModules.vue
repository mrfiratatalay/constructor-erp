<script setup lang="ts">
import { computed } from 'vue'
import { Boxes, ClipboardCheck, Layers3, ListTodo, TrendingUp } from 'lucide-vue-next'
import { featureCards } from '@/core/tenant/companyPresentation'
import { useCompanySubscription } from '@/core/tenant/useCompanySubscription'

const { subscription } = useCompanySubscription()
const modules = computed(() => featureCards(subscription.value?.features ?? []))
const icons = { tasks: ListTodo, attendance: ClipboardCheck, materials: Boxes, production: TrendingUp }
const iconFor = (key: string) => icons[key as keyof typeof icons] ?? Layers3
</script>

<template>
  <el-card v-if="modules.length" shadow="never" class="company-modules">
    <header class="company-modules__heading">
      <h2>Paketinizdeki modüller</h2>
      <p>Firmanızın kullanabildiği çalışma araçları.</p>
    </header>
    <div class="company-modules__grid">
      <article v-for="module in modules" :key="module.key" class="company-modules__item">
        <span class="company-modules__icon"><component :is="iconFor(module.key)" :size="21" /></span>
        <div class="company-modules__copy">
          <div class="company-modules__title">
            <h3>{{ module.title }}</h3>
            <el-tag :type="module.included ? 'success' : 'info'" effect="light" size="small" round>
              {{ module.included ? 'Dahil' : 'Pakette yok' }}
            </el-tag>
          </div>
          <p>{{ module.description }}</p>
        </div>
      </article>
    </div>
  </el-card>
</template>

<style scoped>
.company-modules { border-radius: var(--radius-lg); }
.company-modules :deep(.el-card__body) { padding: var(--space-6); }
.company-modules__heading h2 { margin: 0; font-size: var(--text-md); }
.company-modules__heading p { margin: 6px 0 0; color: var(--text-muted); font-size: var(--text-sm); }
.company-modules__grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); margin-top: var(--space-5); }
.company-modules__item { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-4); border: 1px solid var(--border-soft); border-radius: var(--radius-md); }
.company-modules__icon { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--brand-tint); color: var(--brand-primary); }
.company-modules__copy { min-width: 0; flex: 1; }
.company-modules__title { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); }
.company-modules__title h3 { margin: 0; font-size: var(--text-base); }
.company-modules__copy p { margin: var(--space-2) 0 0; font-size: var(--text-sm); line-height: 1.65; color: var(--text-muted); }
@media (max-width: 960px) { .company-modules__grid { grid-template-columns: minmax(0, 1fr); } }
</style>
