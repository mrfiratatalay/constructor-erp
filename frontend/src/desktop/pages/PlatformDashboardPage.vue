<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { useAdminDashboard } from '@/core/admin/useAdminDashboard'
import type { CreatedTenant } from '@/core/admin/useTenantCreation'
import { fullDate, todayIsoDate } from '@/core/format/dates'
import ExpiringList from '@/desktop/molecules/ExpiringList.vue'
import StatTile from '@/desktop/molecules/StatTile.vue'
import AuditTimeline from '@/desktop/organisms/AuditTimeline.vue'
import OnboardingLinkDialog from '@/desktop/organisms/OnboardingLinkDialog.vue'
import TenantCreateDialog from '@/desktop/organisms/TenantCreateDialog.vue'
import CollectionsChart from '@/shared/molecules/CollectionsChart.vue'

/** Platformun özeti: firmalar, gelir, tahsilat, yakında bitecek abonelikler, son işlemler; yeni firma buradan açılır. */
const router = useRouter()
const { dashboard, isPending, isError, refetch, stats, hasCollections } = useAdminDashboard()
const creating = ref(false)
const created = ref<CreatedTenant | null>(null)
const openTenant = (companyId: string) => router.push({ name: 'platformTenant', params: { companyId } })

function afterLink() {
  const companyId = created.value?.companyId
  created.value = null
  if (companyId) void openTenant(companyId)
}
</script>

<template>
  <el-scrollbar>
    <el-main class="dashboard">
      <header class="dashboard__head">
        <div><h1>Platform özeti</h1><p>{{ fullDate(todayIsoDate()) }}</p></div>
        <el-button type="primary" size="large" @click="creating = true"><Plus :size="18" /> Yeni firma</el-button>
      </header>
      <el-alert v-if="dashboard?.newSalesRequests" type="warning" show-icon :closable="false"
        :title="`${dashboard.newSalesRequests} yeni başvuru sizi bekliyor.`">
        <RouterLink :to="{ name: 'platformLeads' }">Başvurulara git</RouterLink>
      </el-alert>
      <el-skeleton v-if="isPending" :rows="8" animated />
      <el-result v-else-if="isError" icon="error" title="Özet yüklenemedi" sub-title="Bağlantını kontrol edip tekrar dene.">
        <template #extra><el-button @click="refetch()">Tekrar dene</el-button></template>
      </el-result>
      <section class="dashboard__stats">
        <StatTile v-for="stat in stats" :key="stat.key" :label="stat.label" :value="stat.value" :hint="stat.hint"
          :tone="stat.tone" />
      </section>
      <section v-if="dashboard" class="dashboard__grid">
        <el-card shadow="never" header="Tahsilat · son 6 ay">
          <CollectionsChart v-if="hasCollections" :months="dashboard.collections" />
          <el-empty v-else :image-size="64" description="Son 6 ayda kaydedilen ödeme yok" />
        </el-card>
        <el-card shadow="never" header="Yakında bitecek abonelikler">
          <ExpiringList :tenants="dashboard.expiringSoon" @open="openTenant" />
        </el-card>
      </section>
      <el-card v-if="dashboard" shadow="never">
        <template #header>
          <div class="dashboard__card-head">Son işlemler <RouterLink :to="{ name: 'platformAudit' }">Tümü</RouterLink></div>
        </template>
        <AuditTimeline :entries="dashboard.recentActivity" show-company />
      </el-card>
    </el-main>
    <TenantCreateDialog v-model:show="creating" @created="created = $event" />
    <OnboardingLinkDialog :link="created?.link ?? null" :company-name="created?.name ?? ''" :email="created?.email"
      @close="afterLink" />
  </el-scrollbar>
</template>

<style scoped>
.dashboard {
  display: grid;
  gap: var(--space-5);
  max-width: 1320px;
  padding: var(--space-8);
}

.dashboard__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashboard__head h1 {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
}

.dashboard__head p {
  margin: var(--space-1) 0 0;
  color: var(--text-muted);
}

.dashboard__head svg {
  margin-right: var(--space-1);
}

.dashboard__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-4);
}

.dashboard__grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: var(--space-5);
  align-items: start;
}

.dashboard__card-head {
  display: flex;
  justify-content: space-between;
}

.dashboard a {
  color: var(--brand-primary);
  font-weight: var(--weight-semibold);
}
</style>
