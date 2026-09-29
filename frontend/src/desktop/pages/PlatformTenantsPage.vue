<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Search } from 'lucide-vue-next'
import { TENANT_FILTERS, useTenantList } from '@/core/admin/useTenantList'
import type { CreatedTenant } from '@/core/admin/useTenantCreation'
import OnboardingLinkDialog from '@/desktop/organisms/OnboardingLinkDialog.vue'
import TenantCreateDialog from '@/desktop/organisms/TenantCreateDialog.vue'
import TenantTable from '@/desktop/organisms/TenantTable.vue'

/** Bütün firmalar: ara, durumla süz, satıra tıklayıp ayrıntıya geç; yeni firma (manuel satış) buradan da açılır. */
const router = useRouter()
const { tenants, search, filter, counts, isPending } = useTenantList()
const creating = ref(false)
const created = ref<CreatedTenant | null>(null)
const filters = computed(() => TENANT_FILTERS.map((item) => ({ label: `${item.label} (${counts.value[item.key] ?? 0})`, value: item.key })))
const open = (companyId: string) => router.push({ name: 'platformTenant', params: { companyId } })

function afterLink() {
  const companyId = created.value?.companyId
  created.value = null
  if (companyId) void open(companyId)
}
</script>

<template>
  <el-scrollbar>
    <el-main class="tenants">
      <header class="tenants__head">
        <div><h1>Firmalar</h1><p>Constructor ERP'yi kullanan müşteri firmalar ve abonelikleri.</p></div>
        <el-button type="primary" size="large" @click="creating = true"><Plus :size="18" /> Yeni firma</el-button>
      </header>
      <div class="tenants__toolbar">
        <el-input v-model="search" placeholder="Firma, adres, şehir ya da paket ara" clearable class="tenants__search">
          <template #prefix><Search :size="16" /></template>
        </el-input>
        <el-segmented v-model="filter" :options="filters" />
      </div>
      <el-card shadow="never" body-class="tenants__card"><TenantTable :tenants="tenants" :loading="isPending" @open="open" /></el-card>
    </el-main>
    <TenantCreateDialog v-model:show="creating" @created="created = $event" />
    <OnboardingLinkDialog :link="created?.link ?? null" :company-name="created?.name ?? ''" :email="created?.email"
      @close="afterLink" />
  </el-scrollbar>
</template>

<style scoped>
.tenants {
  display: grid;
  gap: var(--space-5);
  max-width: 1320px;
  padding: var(--space-8);
}

.tenants__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tenants__head h1 {
  margin: 0;
  font-size: var(--text-2xl);
  font-weight: var(--weight-black);
}

.tenants__head p {
  margin: var(--space-1) 0 0;
  color: var(--text-muted);
}

.tenants__head svg {
  margin-right: var(--space-1);
}

.tenants__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}

.tenants__search {
  width: 320px;
}

:deep(.tenants__card) {
  padding: 0;
}
</style>
