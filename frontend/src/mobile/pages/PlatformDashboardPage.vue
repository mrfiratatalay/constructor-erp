<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'
import { AUDIT_ACTIONS } from '@/core/admin/adminLabels'
import { useAdminDashboard } from '@/core/admin/useAdminDashboard'
import { useLogout } from '@/core/auth/useLogout'
import { fullDate, timeAgo } from '@/core/format/dates'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import CollectionsChart from '@/shared/molecules/CollectionsChart.vue'

/** Platformun özeti telefonda: sayılar, tahsilat, yakında bitecek abonelikler ve son işlemler. */
const { dashboard, isPending, isError, refetch, stats, hasCollections } = useAdminDashboard()
const { logout } = useLogout()
</script>

<template>
  <MobilePage title="Constructor ERP · Platform" brand>
    <template #action>
      <van-button round size="small" class="admin-home__logout" aria-label="Çıkış yap" @click="logout"><LogOut :size="18" /></van-button>
    </template>
    <van-notice-bar v-if="dashboard?.newSalesRequests" left-icon="bell" mode="link" class="admin-home__notice"
      :text="`${dashboard.newSalesRequests} yeni başvuru sizi bekliyor`" @click="$router.push({ name: 'platformLeads' })" />
    <van-loading v-if="isPending" class="admin-home__state" vertical>Yükleniyor…</van-loading>
    <van-empty v-else-if="isError" image="error" description="Özet yüklenemedi">
      <van-button round size="small" @click="refetch()">Tekrar dene</van-button>
    </van-empty>
    <van-grid :column-num="2" :border="false" :gutter="10" class="admin-home__stats">
      <van-grid-item v-for="stat in stats" :key="stat.key">
        <span class="admin-home__stat" :class="`is-${stat.tone}`">
          <small>{{ stat.label }}</small><strong>{{ stat.value }}</strong><em>{{ stat.hint }}</em>
        </span>
      </van-grid-item>
    </van-grid>
    <van-cell-group v-if="dashboard" inset title="Tahsilat · son 6 ay">
      <div v-if="hasCollections" class="admin-home__chart"><CollectionsChart :months="dashboard.collections" /></div>
      <van-cell v-else title="Son 6 ayda kaydedilen ödeme yok" />
    </van-cell-group>
    <van-cell-group v-if="dashboard" inset title="Yakında bitecek abonelikler">
      <van-cell v-if="!dashboard.expiringSoon.length" title="Önümüzdeki 14 günde biten yok" />
      <van-cell v-for="tenant in dashboard.expiringSoon" :key="tenant.id" :title="tenant.name" is-link
        :label="`${tenant.planName} · ${fullDate(tenant.endsOn!)}`" :value="`${tenant.daysLeft} gün`"
        :to="{ name: 'platformTenant', params: { companyId: tenant.id } }" />
    </van-cell-group>
    <van-cell-group v-if="dashboard" inset title="Son işlemler">
      <van-cell v-if="!dashboard.recentActivity.length" title="Henüz işlem yok" />
      <van-cell v-for="entry in dashboard.recentActivity" :key="entry.id" :title="entry.summary"
        :label="[AUDIT_ACTIONS[entry.action] ?? entry.action, entry.companyName].filter(Boolean).join(' · ')" :value="timeAgo(entry.createdAt)" />
    </van-cell-group>
  </MobilePage>
</template>

<style scoped>
.admin-home__state {
  padding: var(--space-8) 0;
}

.admin-home__logout {
  border: 0;
  background: rgb(255 255 255 / 0.14);
  color: var(--brand-on-deep);
}

.admin-home__notice {
  border-radius: var(--radius-md);
}

.admin-home__stats {
  margin: 0 calc(var(--space-2) * -1);
}

.admin-home__stat {
  display: grid;
  gap: 2px;
  width: 100%;
  padding-left: var(--space-3);
  border-left: 4px solid var(--brand-primary);
  text-align: left;
}

.admin-home__stat.is-success { border-left-color: var(--status-success); }
.admin-home__stat.is-warning { border-left-color: var(--status-warning); }
.admin-home__stat.is-danger { border-left-color: var(--status-danger); }

.admin-home__stat small,
.admin-home__stat em {
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-style: normal;
}

.admin-home__stat strong {
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
}

.admin-home__chart {
  padding: var(--space-4) var(--space-3) var(--space-3) 0;
}
</style>
