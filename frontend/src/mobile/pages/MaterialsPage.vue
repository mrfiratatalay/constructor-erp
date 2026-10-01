<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download, PackageSearch, SlidersHorizontal } from 'lucide-vue-next'
import { useMaterialPermissions } from '@/core/shipments/useMaterialPermissions'
import { useMovementBoard } from '@/core/shipments/useMovementBoard'
import { useMovementSelection } from '@/core/shipments/useMovementSelection'
import { MOVEMENT_TABS, type MovementScope } from '@/core/shipments/movementFilters'
import { movementTypeLabel, type MovementKind } from '@/core/shipments/movementPresentation'
import { dayWithYear } from '@/core/format/dates'
import { useWorkspace } from '@/core/tenant/useWorkspace'
import MovementFilterSheet from '@/mobile/molecules/MovementFilterSheet.vue'
import MovementSummary from '@/mobile/molecules/MovementSummary.vue'
import ShipmentCell from '@/mobile/molecules/ShipmentCell.vue'
import ShipmentFormSheet from '@/mobile/organisms/ShipmentFormSheet.vue'
import ShipmentSheet from '@/mobile/organisms/ShipmentSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

const { search, filter, rows, page, pageSize, shown, summary, summaryLoading, summaryError, points,
  isLoading, isError, retry, hasFilters, exportUrl, clear } = useMovementBoard()
const { canCreate, canExport } = useMaterialPermissions()
const { workspace } = useWorkspace()
const formOpen = ref(false)
const chooserOpen = ref(false)
const filtersOpen = ref(false)
const initialKind = ref<MovementKind>('SITE')
const openId = useMovementSelection()
const listHeading = ref<HTMLElement | null>(null)
const filterCount = computed(() => Number(!!filter.dates) + Number(!!filter.type) + Number(!!filter.point))
const movementChoices: { name: string; kind: MovementKind; subname: string }[] = [
  { name: 'Şantiyeye gönder', kind: 'SITE', subname: 'Ana depodan şantiyeye malzeme çıkışı' },
  { name: 'Harici firmaya gönder', kind: 'OUTSIDE', subname: 'Firma veya kişiye malzeme çıkışı' },
  { name: 'Malzeme geri geldi', kind: 'RETURN', subname: 'Geri beklenen bir çıkışın iadesi' },
  { name: 'Depoya giriş', kind: 'INBOUND', subname: 'Dışarıdan ana depoya gelen malzemeler' },
]

function create(choice: { kind: MovementKind }) {
  chooserOpen.value = false
  initialKind.value = choice.kind
  formOpen.value = true
}

function focus(scope: MovementScope) {
  clear()
  filter.scope = scope
}

function scrollToList() {
  listHeading.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <MobilePage title="Malzeme Yönetimi" :logo-name="workspace?.name" :logo-url="workspace?.logoUrl" brand>
    <p class="materials__intro">Malzeme giriş, çıkış ve geri dönüş hareketlerini takip edin.</p>
    <div class="materials__actions">
      <van-button v-if="canCreate" type="primary" block round icon="plus" @click="chooserOpen = true">Yeni Hareket</van-button>
      <van-button v-if="canExport" tag="a" :href="exportUrl" round class="materials__export" aria-label="Filtreli hareketleri Excel olarak indir">
        <Download :size="18" aria-hidden="true" /> Excel
      </van-button>
    </div>
    <MovementSummary :summary="summary" :loading="summaryLoading" :unavailable="summaryError" @focus="focus" />
    <div class="materials__workspace">
      <van-tabs v-model:active="filter.scope" class="materials__tabs" :swipe-threshold="3" shrink>
        <van-tab v-for="tab in MOVEMENT_TABS" :key="tab.value" :name="tab.value" :title="tab.label" />
      </van-tabs>
      <div class="materials__search">
        <van-search v-model="search" placeholder="Malzeme, firma veya sevkiyat ara…" shape="round" aria-label="Hareket ara" />
        <van-button round class="materials__filter-button" :class="{ 'materials__filter-button--active': filterCount }"
          :aria-label="filterCount ? `Filtreler, ${filterCount} filtre etkin` : 'Hareket filtrelerini aç'" @click="filtersOpen = true">
          <SlidersHorizontal :size="18" aria-hidden="true" /><span v-if="filterCount">{{ filterCount }}</span>
        </van-button>
      </div>
      <div v-if="hasFilters" class="materials__filters">
        <van-tag v-if="filter.type" closeable @close="filter.type = ''">{{ movementTypeLabel(filter.type) }}</van-tag>
        <van-tag v-if="filter.point" closeable @close="filter.point = ''">{{ filter.point }}</van-tag>
        <van-tag v-if="filter.dates" closeable @close="filter.dates = null">{{ filter.dates.map(dayWithYear).join(' – ') }}</van-tag>
        <van-button size="mini" plain round @click="clear">Temizle</van-button>
      </div>
      <div ref="listHeading" class="materials__list-heading">
        <h2>{{ filter.scope === 'returns' ? 'Geri Beklenen Hareketler' : 'Son Hareketler' }}</h2>
        <span v-if="!isLoading && !isError">{{ rows.length }} hareket</span>
      </div>
      <van-skeleton v-if="isLoading" :row="5" class="materials__loading" />
      <van-empty v-else-if="isError" description="Hareketler yüklenemedi. Yeniden deneyin." image="error">
        <van-button type="primary" size="small" round @click="retry()">Yeniden dene</van-button>
      </van-empty>
      <van-empty v-else-if="!rows.length" :description="hasFilters ? 'Bu filtrelere uygun hareket bulunamadı.' : 'Henüz malzeme hareketi yok.'">
        <template #image><PackageSearch :size="48" /></template>
        <van-button v-if="hasFilters" size="small" round @click="clear">Filtreleri temizle</van-button>
        <van-button v-else-if="canCreate" type="primary" size="small" round @click="chooserOpen = true">Yeni hareket oluştur</van-button>
      </van-empty>
      <div v-else class="materials__list">
        <ShipmentCell v-for="row in shown" :key="row.id" :row="row" @open="openId = $event" />
        <van-pagination v-if="rows.length > pageSize" v-model="page" :total-items="rows.length" :items-per-page="pageSize"
          :show-page-size="3" class="materials__pagination" @change="scrollToList" />
      </div>
    </div>
    <van-action-sheet v-model:show="chooserOpen" title="Ne yapmak istiyorsunuz?" :actions="movementChoices" cancel-text="Vazgeç"
      close-on-click-action @select="create" />
    <MovementFilterSheet v-model:show="filtersOpen" :filter="filter" :points="points" @change="Object.assign(filter, $event)" @clear="clear" />
    <ShipmentFormSheet v-model:show="formOpen" :initial-kind="initialKind" @saved="openId = $event" />
    <ShipmentSheet v-model:shipment-id="openId" />
  </MobilePage>
</template>

<style scoped src="@/mobile/styles/materialsPage.css"></style>
