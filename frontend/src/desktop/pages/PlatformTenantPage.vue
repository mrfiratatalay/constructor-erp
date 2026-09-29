<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { useTenantDetail } from '@/core/admin/useTenantDetail'
import AuditTimeline from '@/desktop/organisms/AuditTimeline.vue'
import InvitesPanel from '@/desktop/organisms/InvitesPanel.vue'
import PaymentsPanel from '@/desktop/organisms/PaymentsPanel.vue'
import SubscriptionPanel from '@/desktop/organisms/SubscriptionPanel.vue'
import TenantHeader from '@/desktop/organisms/TenantHeader.vue'
import TenantMembersTable from '@/desktop/organisms/TenantMembersTable.vue'

/** Bir firmanın bütün hikâyesi: kimlik ve durum; abonelik, ödemeler, kişiler, kurulum ve işlem geçmişi sekmelerde. */
const route = useRoute()
const companyId = computed(() => String(route.params.companyId))
const { tenant, isPending, loadError, members, audit } = useTenantDetail(companyId)
</script>

<template>
  <el-scrollbar>
    <el-main class="tenant-page">
      <RouterLink :to="{ name: 'platformTenants' }" class="tenant-page__back"><ArrowLeft :size="16" /> Firmalar</RouterLink>
      <el-skeleton v-if="isPending" :rows="8" animated />
      <el-result v-else-if="loadError || !tenant" icon="warning" title="Firma bulunamadı" />
      <template v-else>
        <TenantHeader :tenant="tenant" />
        <el-card shadow="never">
          <el-tabs>
            <el-tab-pane :label="`Abonelik (${tenant.subscriptions.length})`"><SubscriptionPanel :tenant="tenant" /></el-tab-pane>
            <el-tab-pane :label="`Ödemeler (${tenant.payments.length})`"><PaymentsPanel :tenant="tenant" /></el-tab-pane>
            <el-tab-pane :label="`Kişiler (${members?.length ?? 0})`"><TenantMembersTable :members="members" /></el-tab-pane>
            <el-tab-pane label="Kurulum"><InvitesPanel :tenant="tenant" /></el-tab-pane>
            <el-tab-pane label="İşlem geçmişi"><AuditTimeline :entries="audit ?? []" /></el-tab-pane>
          </el-tabs>
        </el-card>
      </template>
    </el-main>
  </el-scrollbar>
</template>

<style scoped>
.tenant-page {
  display: grid;
  gap: var(--space-5);
  max-width: 1320px;
  padding: var(--space-6) var(--space-8) var(--space-8);
}

.tenant-page__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  justify-self: start;
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}
</style>
