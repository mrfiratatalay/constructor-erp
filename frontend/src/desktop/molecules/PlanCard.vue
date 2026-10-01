<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import type { FeatureInfo, PlanAdminView } from '@/core/api/generated/model'
import { formatMoney } from '@/core/format/money'

/** Platform yönetiminde paket kartı: fiyat, sınırlar, modüller ve bu pakette açık olan firma sayısı. */
const { plan, features = [] } = defineProps<{ plan: PlanAdminView; features?: FeatureInfo[] }>()
const emit = defineEmits<{ edit: [] }>()
</script>

<template>
  <el-card shadow="never" class="plan-card" :class="{ 'plan-card--highlighted': plan.highlighted }">
    <div class="plan-card__head">
      <strong>{{ plan.name }}</strong>
      <el-tag v-if="plan.highlighted" type="warning" size="small">Önerilen</el-tag>
      <el-tag v-if="plan.status === 'ARCHIVED'" type="info" size="small">Arşivde</el-tag>
      <el-tag v-else-if="!plan.visible" type="info" size="small" effect="plain">Sitede gizli</el-tag>
    </div>
    <p class="plan-card__tagline">{{ plan.tagline }}</p>
    <div class="plan-card__price">
      {{ plan.monthlyPrice == null ? 'Teklifle' : formatMoney(plan.monthlyPrice) }}<small v-if="plan.monthlyPrice != null"> / ay</small>
    </div>
    <p class="plan-card__limits">
      {{ plan.maxUsers ?? 'Sınırsız' }} kişi · {{ plan.maxSites ?? 'sınırsız' }} aktif şantiye
    </p>
    <ul>
      <li v-for="feature in features" :key="feature.key" :class="{ 'is-off': !plan.features.includes(feature.key) }">
        <Check v-if="plan.features.includes(feature.key)" :size="16" /><X v-else :size="16" /> {{ feature.name }}
      </li>
    </ul>
    <div class="plan-card__foot">
      <span>{{ plan.activeTenants }} açık firma</span>
      <el-button @click="emit('edit')">Düzenle</el-button>
    </div>
  </el-card>
</template>

<style scoped>
/* Kartlar ızgarada aynı boydadır; açıklaması uzun olan kartta Düzenle aşağı kayıp hizayı bozmasın, en alta oturur. */
.plan-card {
  height: 100%;
}

.plan-card :deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
}

.plan-card--highlighted {
  border-color: var(--brand-signature);
  box-shadow: 0 0 0 2px rgb(250 204 21 / 0.35);
}

.plan-card__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-lg);
}

.plan-card__tagline,
.plan-card__limits {
  min-height: 1.5em;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.plan-card__price {
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
}

.plan-card__price small {
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
}

ul {
  display: grid;
  gap: var(--space-2);
  margin: var(--space-3) 0;
  padding: 0;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

li svg {
  color: var(--status-success);
}

li.is-off {
  color: var(--text-subtle);
}

li.is-off svg {
  color: var(--text-subtle);
}

.plan-card__foot {
  display: flex;
  margin-top: auto;
  align-items: center;
  justify-content: space-between;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
