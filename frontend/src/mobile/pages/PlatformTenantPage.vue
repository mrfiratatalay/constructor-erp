<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import { lifecycleActions, type LifecycleAction } from '@/core/admin/tenantLifecycle'
import { tenantBadge } from '@/core/admin/tenantStatus'
import { useTenantActions } from '@/core/admin/useTenantActions'
import { useTenantDetail } from '@/core/admin/useTenantDetail'
import { useTenantInvites } from '@/core/admin/useTenantInvites'
import { dayWithYear, timeAgo } from '@/core/format/dates'
import { confirmAction } from '@/mobile/confirmAction'
import ExtendPeriodPopup from '@/mobile/organisms/ExtendPeriodPopup.vue'
import OnboardingLinkPopup from '@/mobile/organisms/OnboardingLinkPopup.vue'
import PaymentPopup from '@/mobile/organisms/PaymentPopup.vue'
import TenantHistory from '@/mobile/organisms/TenantHistory.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/** Bir firma telefonda: durumu, uzat, ödeme kaydet, kurulum bağlantısı, firma durumu ve geçmiş. */
const route = useRoute()
const companyId = computed(() => String(route.params.companyId))
const { tenant, members, audit } = useTenantDetail(companyId)
const { changeStatus } = useTenantActions(companyId)
const { fresh, issue } = useTenantInvites(companyId)
const extending = ref(false)
const paying = ref(false)
const choosing = ref(false)
const actions = computed(() => lifecycleActions(tenant.value?.summary.status ?? '').map((action) => ({ name: action.label, action })))

async function apply({ action }: { action: LifecycleAction }) {
  choosing.value = false
  const danger = action.status !== 'ACTIVE'
  if (!(await confirmAction({ title: action.label, message: action.confirm, confirm: action.label, danger }))) return
  await changeStatus({ status: action.status, reason: null })
    .then(() => showSuccessToast('Güncellendi'), (error) => showFailToast(errorMessage(error)))
}
</script>

<template>
  <MobilePage :title="tenant?.summary.name ?? 'Firma'" back :tabbar="false">
    <template v-if="tenant">
      <div class="tenant__head">
        <CompanyLogo :name="tenant.summary.name" :logo-url="tenant.logoUrl" :size="64" />
        <strong>{{ tenant.summary.name }}</strong>
        <van-tag round :type="tenant.summary.open ? 'success' : 'warning'">{{ tenantBadge(tenant.summary).label }}</van-tag>
      </div>
      <van-cell-group inset>
        <van-cell title="Paket" :value="tenant.summary.planName ?? '—'"
          :label="tenant.summary.endsOn ? `Dönem sonu ${dayWithYear(tenant.summary.endsOn)} · ${tenant.summary.daysLeft} gün` : ''" />
        <van-cell title="Kişi / şantiye" :value="`${tenant.summary.userCount} / ${tenant.summary.siteCount}`" />
        <van-cell title="Son aktivite" :value="tenant.summary.lastActivityAt ? timeAgo(tenant.summary.lastActivityAt) : 'Hiç'" />
        <van-cell v-if="tenant.phone" title="Telefon" :value="tenant.phone" is-link :url="`tel:${tenant.phone}`" />
        <van-cell title="Kurulum" :value="tenant.summary.setupCompleted ? 'Tamamlandı' : 'Bekliyor'" />
      </van-cell-group>
      <van-grid :column-num="2" :gutter="10" class="tenant__actions">
        <van-grid-item icon="calendar-o" text="Uzat" @click="extending = true" />
        <van-grid-item icon="balance-o" text="Ödeme kaydet" @click="paying = true" />
        <van-grid-item icon="link-o" text="Kurulum bağlantısı" @click="issue" />
        <van-grid-item icon="setting-o" text="Firma durumu" @click="choosing = true" />
      </van-grid>
      <TenantHistory :tenant="tenant" :members="members" :audit="audit" />
      <ExtendPeriodPopup v-model:show="extending" :tenant="tenant" />
      <PaymentPopup v-model:show="paying" :tenant="tenant" />
      <OnboardingLinkPopup :link="fresh" :company-name="tenant.summary.name" :email="tenant.email" @close="fresh = null" />
      <van-action-sheet v-model:show="choosing" :actions="actions" cancel-text="Vazgeç" @select="apply" />
    </template>
    <van-loading v-else class="tenant__loading" />
  </MobilePage>
</template>

<style scoped>
.tenant__head {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
  padding: var(--space-2) 0;
}

.tenant__head strong {
  font-size: var(--text-lg);
  font-weight: var(--weight-black);
}

.tenant__actions {
  margin: 0 calc(var(--space-2) * -1);
}

.tenant__loading {
  justify-self: center;
}
</style>
