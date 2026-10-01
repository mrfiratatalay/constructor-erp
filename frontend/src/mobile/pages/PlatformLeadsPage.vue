<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { Phone } from 'lucide-vue-next'
import type { FollowSalesRequestStatus, SalesRequestView } from '@/core/api/generated/model'
import { errorMessage } from '@/core/api/errors'
import { SALES_REQUEST_STATUSES } from '@/core/admin/adminLabels'
import { useSalesRequests } from '@/core/admin/useSalesRequests'
import { dateTime } from '@/core/format/dates'
import { vanType } from '@/mobile/markTones'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/** Başvurular telefonda: ara (tek dokunuş), durumu güncelle. Firmaya dönüştürme masaüstündeki pencereden yapılır. */
const { requests, filter, follow } = useSalesRequests()
const FILTERS = [{ name: 'open', title: 'Açık' }, { name: 'WON', title: 'Kazanıldı' }, { name: 'LOST', title: 'Kaybedildi' }, { name: 'all', title: 'Tümü' }]
const choosing = ref<SalesRequestView | null>(null)
/** Boş alanlar atlanır: e-postası ya da şehri yazılmamış başvuruda "Ad ·  · tarih" gibi sarkan ayraç kalmasın. */
const joined = (...parts: (string | number | null | undefined)[]) => parts.filter((part) => part != null && part !== '').join(' · ')
const ACTIONS = Object.entries(SALES_REQUEST_STATUSES).filter(([key]) => key !== 'WON').map(([key, item]) => ({ name: item.label, key }))

async function choose(action: { key: string }) {
  const request = choosing.value
  choosing.value = null
  if (!request) return
  try {
    await follow(request.id, action.key as FollowSalesRequestStatus, request.notes ?? null)
    showSuccessToast('Güncellendi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <MobilePage title="Başvurular">
    <van-tabs v-model:active="filter" shrink>
      <van-tab v-for="item in FILTERS" :key="item.name" :name="item.name" :title="item.title" />
    </van-tabs>
    <van-empty v-if="!requests.length" description="Bu süzgece uyan başvuru yok" image-size="80" />
    <van-cell-group v-for="request in requests" :key="request.id" inset class="lead">
      <van-cell :title="request.companyName" :label="joined(request.contactName, request.city, dateTime(request.createdAt))">
        <template #value>
          <!-- Renk masaüstüyle aynı tablodan (adminLabels): Kaybedildi burada turuncu, orada griydi. -->
          <van-tag round :type="vanType(SALES_REQUEST_STATUSES[request.status]?.tone ?? 'info')">
            {{ SALES_REQUEST_STATUSES[request.status]?.label }}
          </van-tag>
        </template>
      </van-cell>
      <van-cell v-if="request.message" :title="request.message" class="lead__message" />
      <van-cell :title="joined(request.planName ?? 'Paket seçilmedi', request.siteCount != null ? `${request.siteCount} şantiye` : null)">
        <template #right-icon>
          <van-button tag="a" :href="`tel:${request.phone}`" size="small" round type="success" plain><Phone :size="14" /> Ara</van-button>
          <van-button v-if="!request.companyId" size="small" round plain type="primary" class="lead__status" @click="choosing = request">Durum</van-button>
        </template>
      </van-cell>
    </van-cell-group>
    <van-action-sheet :show="!!choosing" :actions="ACTIONS" cancel-text="Vazgeç" close-on-click-action
      @select="choose" @cancel="choosing = null" @close="choosing = null" />
  </MobilePage>
</template>

<style scoped>
.lead__message {
  color: var(--text-muted);
}

.lead__status {
  margin-left: var(--space-2);
}
</style>
