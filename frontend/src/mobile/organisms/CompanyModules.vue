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
  <section v-if="modules.length" class="company-modules" aria-labelledby="company-modules-title">
    <header>
      <h2 id="company-modules-title">Paketinizdeki modüller</h2>
      <p>Firmanızın çalışma araçları.</p>
    </header>
    <van-cell-group :border="false">
      <van-cell v-for="module in modules" :key="module.key" class="company-modules__row">
        <template #icon><span class="company-modules__icon"><component :is="iconFor(module.key)" :size="20" /></span></template>
        <template #title><strong>{{ module.title }}</strong></template>
        <template #label><p class="company-modules__description">{{ module.description }}</p></template>
        <template #value><van-tag :type="module.included ? 'success' : 'default'" plain round>
          {{ module.included ? 'Dahil' : 'Pakette yok' }}
        </van-tag></template>
      </van-cell>
    </van-cell-group>
  </section>
</template>

<style scoped>
.company-modules { overflow: hidden; border: 1px solid var(--border-soft); border-radius: var(--radius-lg); background: var(--surface); }
.company-modules header { padding: var(--space-4) var(--space-4) var(--space-2); }
.company-modules h2 { margin: 0; font-size: var(--text-base); }
.company-modules header p { margin: var(--space-1) 0 0; font-size: var(--text-sm); color: var(--text-muted); }
.company-modules__row { align-items: flex-start; padding: var(--space-4); }
.company-modules__icon { display: grid; place-items: center; flex: none; width: 36px; height: 36px; margin-right: var(--space-3); border-radius: var(--radius-sm); background: var(--brand-tint); color: var(--brand-primary); }
.company-modules__row :deep(.van-cell__title) { flex: 1; min-width: 0; }
.company-modules__row :deep(.van-cell__value) { flex: none; margin-left: var(--space-2); }
.company-modules__row strong { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
.company-modules__description { margin: var(--space-1) 0 0; line-height: 1.6; font-size: var(--text-sm); color: var(--text-muted); }
</style>
