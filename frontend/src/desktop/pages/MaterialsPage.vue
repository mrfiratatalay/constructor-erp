<script setup lang="ts">
import { ref } from 'vue'
import { Download, PackageSearch } from 'lucide-vue-next'
import { useMaterialPermissions } from '@/core/shipments/useMaterialPermissions'
import { useMovementBoard } from '@/core/shipments/useMovementBoard'
import { useMovementSelection } from '@/core/shipments/useMovementSelection'
import { MOVEMENT_TABS, type MovementScope } from '@/core/shipments/movementFilters'
import type { MovementKind } from '@/core/shipments/movementPresentation'
import MovementChooser from '@/desktop/molecules/MovementChooser.vue'
import MovementSummary from '@/desktop/molecules/MovementSummary.vue'
import MovementToolbar from '@/desktop/molecules/MovementToolbar.vue'
import ShipmentDialog from '@/desktop/organisms/ShipmentDialog.vue'
import ShipmentDrawer from '@/desktop/organisms/ShipmentDrawer.vue'
import ShipmentTable from '@/desktop/organisms/ShipmentTable.vue'

const { search, filter, rows, page, pageSize, summary, summaryLoading, summaryError, points, shown, isLoading, isError, retry, hasFilters, exportUrl, clear } = useMovementBoard()
const { canCreate, canExport } = useMaterialPermissions()
const formOpen = ref(false)
const initialKind = ref<MovementKind>('SITE')
const openId = useMovementSelection()

function create(kind: MovementKind) {
  initialKind.value = kind
  formOpen.value = true
}

function focus(scope: MovementScope) {
  clear()
  filter.scope = scope
}
</script>

<template>
  <el-scrollbar>
    <section class="materials">
      <header class="materials__head">
        <div><h1>Malzeme Yönetimi</h1><p>Malzeme giriş, çıkış ve geri dönüş hareketlerini takip edin.</p></div>
        <div class="materials__actions">
          <el-button v-if="canExport" tag="a" :href="exportUrl" :icon="Download">Excel</el-button>
          <MovementChooser v-if="canCreate" @choose="create" />
        </div>
      </header>
      <MovementSummary :summary="summary" :loading="summaryLoading" :unavailable="summaryError" @focus="focus" />
      <div class="materials__workspace">
        <el-tabs :model-value="filter.scope" class="materials__tabs" @tab-change="filter.scope = $event as MovementScope">
          <el-tab-pane v-for="tab in MOVEMENT_TABS" :key="tab.value" :name="tab.value" :label="tab.label" />
        </el-tabs>
        <MovementToolbar v-model:search="search" :filter="filter" :points="points" :has-filters="hasFilters"
          @change="Object.assign(filter, $event)" @clear="clear" />
        <el-alert v-if="isError" title="Hareketler yüklenemedi. Yeniden deneyin." type="error" :closable="false" show-icon>
          <el-button link type="primary" @click="retry">Yeniden dene</el-button>
        </el-alert>
        <div class="materials__table-card">
          <header class="materials__table-head">
            <h2>{{ filter.scope === 'returns' ? 'Geri Beklenen Hareketler' : 'Son Hareketler' }}</h2>
            <span v-if="!isLoading && !isError" class="materials__count">{{ rows.length }} hareket</span>
          </header>
          <el-empty v-if="!isLoading && !isError && !rows.length"
            :description="hasFilters ? 'Bu filtrelere uygun hareket bulunamadı.' : 'Henüz malzeme hareketi yok.'">
            <template #image><PackageSearch :size="52" class="materials__empty-icon" /></template>
            <el-button v-if="hasFilters" @click="clear">Filtreleri temizle</el-button>
            <el-button v-else-if="canCreate" type="primary" @click="create('SITE')">Yeni hareket oluştur</el-button>
          </el-empty>
          <ShipmentTable v-else-if="!isError" :rows="shown" :loading="isLoading" @open="openId = $event" />
          <footer v-if="rows.length" class="materials__table-footer">
            <span>{{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, rows.length) }} / {{ rows.length }} hareket</span>
            <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :total="rows.length"
              :page-sizes="[10, 25, 50]" layout="sizes, prev, pager, next" background small />
          </footer>
        </div>
      </div>
    </section>
  </el-scrollbar>
  <ShipmentDialog v-model:show="formOpen" :initial-kind="initialKind" @saved="openId = $event" />
  <ShipmentDrawer v-model:shipment-id="openId" />
</template>

<style scoped src="@/desktop/styles/materialsPage.css"></style>
