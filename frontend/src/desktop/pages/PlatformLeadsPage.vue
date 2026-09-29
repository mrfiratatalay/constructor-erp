<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FollowSalesRequestStatus, SalesRequestView } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import type { TenantPrefill } from '@/core/admin/tenantForm'
import { useSalesRequests } from '@/core/admin/useSalesRequests'
import type { CreatedTenant } from '@/core/admin/useTenantCreation'
import OnboardingLinkDialog from '@/desktop/organisms/OnboardingLinkDialog.vue'
import SalesRequestTable from '@/desktop/organisms/SalesRequestTable.vue'
import TenantCreateDialog from '@/desktop/organisms/TenantCreateDialog.vue'

/**
 * Tanıtım sitesinden gelen başvurular (POS yok: satış buradan başlar). Ekip arar, notunu yazar; anlaşınca "Firmaya
 * dönüştür" başvurunun bilgileriyle yeni firma penceresini açar ve başvuru firmaya bağlanır.
 */
const router = useRouter()
const { requests, filter, isPending, follow } = useSalesRequests()
const FILTERS = [
  { label: 'Açık', value: 'open' }, { label: 'Yeni', value: 'NEW' }, { label: 'Arandı', value: 'CONTACTED' },
  { label: 'Kazanıldı', value: 'WON' }, { label: 'Kaybedildi', value: 'LOST' }, { label: 'Tümü', value: 'all' },
]
const converting = ref(false)
const prefill = ref<TenantPrefill>({})
const created = ref<CreatedTenant | null>(null)

async function onFollow(id: string, status: FollowSalesRequestStatus, notes: string | null) {
  try {
    await follow(id, status, notes)
    ElMessage.success('Başvuru güncellendi.')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

function convert(request: SalesRequestView) {
  prefill.value = {
    name: request.companyName, phone: request.phone, email: request.email ?? '', city: request.city ?? '',
    planId: request.planId ?? undefined, salesRequestId: request.id,
  }
  converting.value = true
}

function afterLink() {
  const companyId = created.value?.companyId
  created.value = null
  if (companyId) void router.push({ name: 'platformTenant', params: { companyId } })
}
</script>

<template>
  <el-scrollbar>
    <el-main class="leads">
      <header><h1>Başvurular</h1><p>Tanıtım sitesindeki "Paketi seç" ve "Demo iste" formları.</p></header>
      <el-segmented v-model="filter" :options="FILTERS" class="leads__filter" />
      <el-card shadow="never" body-class="leads__card">
        <SalesRequestTable :requests="requests" :loading="isPending" @follow="onFollow" @convert="convert" />
      </el-card>
    </el-main>
    <TenantCreateDialog v-model:show="converting" :prefill="prefill" @created="created = $event" />
    <OnboardingLinkDialog :link="created?.link ?? null" :company-name="created?.name ?? ''" :email="created?.email"
      @close="afterLink" />
  </el-scrollbar>
</template>

<style scoped>
.leads {
  display: grid;
  gap: var(--space-5);
  max-width: 1320px;
  padding: var(--space-8);
}

.leads h1 {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
}

.leads header p {
  margin: var(--space-1) 0 0;
  color: var(--text-muted);
}

.leads__filter {
  justify-self: start;
}

:deep(.leads__card) {
  padding: 0;
}
</style>
