<script setup lang="ts">
import { TENANT_FILTERS, useTenantList } from '@/core/admin/useTenantList'
import { daysLeftTone, tenantBadge } from '@/core/admin/tenantStatus'
import { dayWithYear } from '@/core/format/dates'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Firmalar telefonda: ara, durumla süz, dokunup ayrıntıya geç. Yeni firma masaüstündeki pencereden açılır. */
const { tenants, search, filter, counts } = useTenantList()
const vantTone = (tone: string) => (tone === 'info' ? 'default' : tone) as 'default'
</script>

<template>
  <MobilePage title="Firmalar">
    <van-search v-model="search" shape="round" placeholder="Firma, şehir ya da paket ara" />
    <van-tabs v-model:active="filter" shrink>
      <van-tab v-for="item in TENANT_FILTERS" :key="item.key" :name="item.key" :title="`${item.label} ${counts[item.key] ?? 0}`" />
    </van-tabs>
    <van-cell-group inset>
      <van-empty v-if="!tenants.length" description="Bu süzgece uyan firma yok" image-size="80" />
      <van-cell v-for="tenant in tenants" :key="tenant.id" center is-link
        :to="{ name: 'platformTenant', params: { companyId: tenant.id } }"
        :label="`${tenant.planName ?? 'Paket yok'}${tenant.endsOn ? ` · ${dayWithYear(tenant.endsOn)}` : ''} · ${tenant.userCount} kişi`">
        <template #icon><CompanyLogo :name="tenant.name" :size="38" class="tenants__logo" /></template>
        <template #title>
          <span class="tenants__name">{{ tenant.name }}</span>
          <van-tag :type="vantTone(tenantBadge(tenant).tone)" plain>{{ tenantBadge(tenant).label }}</van-tag>
        </template>
        <template #value>
          <van-tag v-if="tenant.open && tenant.daysLeft != null" round :type="vantTone(daysLeftTone(tenant.daysLeft))">
            {{ tenant.daysLeft }} gün
          </van-tag>
        </template>
      </van-cell>
    </van-cell-group>
  </MobilePage>
</template>

<style scoped>
.tenants__logo {
  margin-right: var(--space-3);
}

.tenants__name {
  margin-right: var(--space-2);
  font-weight: var(--weight-semibold);
}
</style>
