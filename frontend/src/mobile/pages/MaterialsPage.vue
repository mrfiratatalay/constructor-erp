<script setup lang="ts">
import { computed, ref } from 'vue'
import { Ellipsis, Plus } from 'lucide-vue-next'
import type { MaterialView, MovementRow } from '@/core/api/generated/model'
import { useMaterialOptions } from '@/core/materials/useMaterialOptions'
import { useMaterialPanels } from '@/core/materials/useMaterialPanels'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useMaterialsView } from '@/core/materials/useMaterialsView'
import { useMovementFilters } from '@/core/materials/useMovementFilters'
import { useMaterialSummary } from '@/core/materials/useMovementList'
import { ROLE_LABELS } from '@/core/team/roles'
import MaterialTabs from '@/mobile/molecules/MaterialTabs.vue'
import SummaryGrid from '@/mobile/molecules/SummaryGrid.vue'
import AdjustmentSheet from '@/mobile/organisms/AdjustmentSheet.vue'
import CancelMovementDialog from '@/mobile/organisms/CancelMovementDialog.vue'
import ExportSheet from '@/mobile/organisms/ExportSheet.vue'
import MaterialDetailSheet from '@/mobile/organisms/MaterialDetailSheet.vue'
import MaterialFormSheet from '@/mobile/organisms/MaterialFormSheet.vue'
import MovementDetailSheet from '@/mobile/organisms/MovementDetailSheet.vue'
import MovementSheet from '@/mobile/organisms/MovementSheet.vue'
import MovementsPanel from '@/mobile/organisms/MovementsPanel.vue'
import ReturnsSheet from '@/mobile/organisms/ReturnsSheet.vue'
import StockPanel from '@/mobile/organisms/StockPanel.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

type MenuKey = 'returns' | 'export' | 'material'

/**
 * Telefonda Malzemeler: başlığın altında sabit Hareketler · Stok sekmeleri, üstte 2 × 2 özet. Sağ üstte ＋ yeni
 * hareket (tam ekran form), ⋯ ile beklenen iadeler, Excel ve yeni malzeme kartı. Sekme, süzgeçler, açık hareket ve
 * açık malzeme kartı adreste durur (masaüstüyle aynı adresler: Saha kartı ikisinde de aynı yere bağlanır).
 */
const view = useMaterialsView()
const panels = useMaterialPanels()
const { summary } = useMaterialSummary()
const { can, user } = useMaterialPermissions()
const { filters, update } = useMovementFilters()
const options = useMaterialOptions()
const menuOpen = ref(false)
const cancelling = ref<MovementRow | null>(null)
const sheet = ref<InstanceType<typeof MovementSheet>>()
const role = computed(() => (user.value ? `Rol: ${ROLE_LABELS[user.value.role]}` : ''))
const menu = computed(() =>
  [
    { key: 'returns', name: 'Beklenen iadeler', show: true },
    { key: 'export', name: 'Excel indir', show: can('EXPORT_MATERIALS') },
    { key: 'material', name: 'Yeni malzeme kartı', show: can('MANAGE_MATERIAL_CATALOG') },
  ].filter((item) => item.show),
)

function onSummary(key: 'materials' | 'toSite' | 'outbound' | 'returns') {
  if (key === 'returns') return (panels.returnsOpen.value = true)
  if (key === 'materials') return view.setTab('stock')
  update({ type: key === 'toSite' ? 'TO_SITE' : 'OUTBOUND', preset: 'thisMonth' })
}

function onMenu({ key }: { key: MenuKey }) {
  if (key === 'returns') panels.returnsOpen.value = true
  if (key === 'export') panels.exportOpen.value = true
  if (key === 'material') panels.editMaterial(null)
}

/** Kart hareket formunun içinden açıldıysa yeni malzeme formda seçili gelir. */
function onMaterialSaved(material: MaterialView) {
  if (panels.movementOpen.value && !panels.editingMaterial.value) sheet.value?.pickMaterial(material.id)
}

function showMovements(materialId: string) {
  view.closeMaterial()
  view.setTab('movements')
  update({ materialId, preset: 'all' })
}

function takeReturn(loanId: string) {
  view.closeMovement()
  panels.takeReturn(loanId)
}
</script>

<template>
  <MobilePage title="Malzemeler" :subtitle="role">
    <template #action>
      <van-space :size="8" align="center">
        <van-button size="small" round plain type="primary" aria-label="Diğer işler" @click="menuOpen = true">
          <Ellipsis :size="18" />
        </van-button>
        <van-button v-if="can('CREATE_MATERIAL_MOVEMENT')" type="primary" size="small" round
          aria-label="Malzeme hareketi" @click="panels.createMovement()">
          <Plus :size="18" />
        </van-button>
      </van-space>
    </template>
    <template #subbar><MaterialTabs :active="view.tab.value" @change="view.setTab" /></template>
    <template v-if="view.tab.value === 'movements'">
      <SummaryGrid :summary="summary" @open="onSummary" />
      <MovementsPanel :empty="summary?.movementCount === 0" @open="view.openMovement" @create="panels.createMovement()" />
    </template>
    <StockPanel v-else @open="view.openMaterial" @adjust="panels.adjust" />
    <van-action-sheet v-model:show="menuOpen" :actions="menu" cancel-text="Vazgeç" close-on-click-action teleport="body"
      @select="onMenu" />
    <MovementSheet ref="sheet" v-model:open="panels.movementOpen.value" :initial="panels.movementInitial.value"
      @create-material="(name) => panels.editMaterial(null, name)" />
    <MovementDetailSheet :movement-id="view.movementId.value" @close="view.closeMovement" @open="view.openMovement"
      @take-return="takeReturn" @cancel="(row) => (cancelling = row)" />
    <CancelMovementDialog v-model="cancelling" />
    <MaterialDetailSheet :material-id="view.materialId.value" @close="view.closeMaterial"
      @open-movement="view.openMovement" @show-movements="showMovements"
      @edit="(material) => panels.editMaterial(material)" @adjust="panels.adjust" @take-return="takeReturn" />
    <ReturnsSheet v-model:open="panels.returnsOpen.value" @open-movement="view.openMovement" @take-return="takeReturn" />
    <ExportSheet v-model:open="panels.exportOpen.value" :filters="filters" />
    <MaterialFormSheet v-model:open="panels.materialFormOpen.value" :material="panels.editingMaterial.value"
      :name="panels.materialName.value" :categories="options.categories.value" @saved="onMaterialSaved" />
    <AdjustmentSheet v-model="panels.adjusting.value" :locations="options.locations.value" />
  </MobilePage>
</template>
