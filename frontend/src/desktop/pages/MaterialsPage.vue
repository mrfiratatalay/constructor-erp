<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRightLeft, Boxes } from 'lucide-vue-next'
import type { MaterialView, MovementRow } from '@/core/api/generated/model'
import { useMaterialOptions } from '@/core/materials/useMaterialOptions'
import { useMaterialPanels } from '@/core/materials/useMaterialPanels'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useMaterialsView, type MaterialsTab } from '@/core/materials/useMaterialsView'
import { useMovementFilters } from '@/core/materials/useMovementFilters'
import { useMaterialSummary } from '@/core/materials/useMovementList'
import { ROLE_LABELS } from '@/core/team/roles'
import VerticalStack from '@/desktop/atoms/VerticalStack.vue'
import MaterialsHeader from '@/desktop/molecules/MaterialsHeader.vue'
import { useMovementPrompts } from '@/desktop/movementPrompts'
import AdjustmentDialog from '@/desktop/organisms/AdjustmentDialog.vue'
import ExportDialog from '@/desktop/organisms/ExportDialog.vue'
import MaterialDrawer from '@/desktop/organisms/MaterialDrawer.vue'
import MaterialFormDialog from '@/desktop/organisms/MaterialFormDialog.vue'
import MovementDetailDrawer from '@/desktop/organisms/MovementDetailDrawer.vue'
import MovementDrawer from '@/desktop/organisms/MovementDrawer.vue'
import MovementsBoard from '@/desktop/organisms/MovementsBoard.vue'
import ReturnsDrawer from '@/desktop/organisms/ReturnsDrawer.vue'
import StockBoard from '@/desktop/organisms/StockBoard.vue'
import SummaryCards from '@/desktop/organisms/SummaryCards.vue'

type Command = 'open' | 'deliver' | 'takeReturn' | 'cancel'

/**
 * Malzemeler (TASARIM.md "Malzemeler"): firmanın global modülü, şantiye listesi kolonu yoktur. Üstte özet kartları,
 * altında Hareketler ve Stok sekmeleri; birincil iş "+ Malzeme Hareketi" sağdan çekmece açar. Sekme, süzgeçler,
 * açık hareket (?hareket=) ve açık malzeme kartı (?kart=) adreste durur.
 */
const view = useMaterialsView()
const panels = useMaterialPanels()
const { summary } = useMaterialSummary()
const { can, user } = useMaterialPermissions()
const { filters, update } = useMovementFilters()
const options = useMaterialOptions()
const prompts = useMovementPrompts()
const movementDrawer = ref<InstanceType<typeof MovementDrawer>>()
const role = computed(() => (user.value ? ROLE_LABELS[user.value.role] : ''))

function onSummary(key: 'materials' | 'toSite' | 'outbound' | 'returns') {
  if (key === 'returns') return (panels.returnsOpen.value = true)
  if (key === 'materials') return view.setTab('stock')
  view.setTab('movements')
  update({ type: key === 'toSite' ? 'TO_SITE' : 'OUTBOUND', preset: 'thisMonth' })
}

function onCommand(command: Command, row: MovementRow) {
  if (command === 'open') return view.openMovement(row.id)
  if (command === 'deliver') return prompts.deliver(row)
  if (command === 'cancel') return prompts.cancel(row)
  panels.takeReturn(row.id)
}

/** Kart hareket formunun içinden açıldıysa yeni malzeme formda seçili gelir. */
function onMaterialSaved(material: MaterialView) {
  if (panels.movementOpen.value && !panels.editingMaterial.value) movementDrawer.value?.pickMaterial(material.id)
}

function showMovements(materialId: string) {
  view.closeMaterial()
  view.setTab('movements')
  update({ materialId, preset: 'all' })
}
</script>

<template>
  <el-scrollbar>
    <el-main>
      <VerticalStack :gap="24">
        <MaterialsHeader :role="role" :can-export="can('EXPORT_MATERIALS')"
          :can-create="can('CREATE_MATERIAL_MOVEMENT')" @create="panels.createMovement()"
          @export="panels.exportOpen.value = true" />
        <SummaryCards :summary="summary" @open="onSummary" />
        <el-tabs :model-value="view.tab.value" @tab-change="(name) => view.setTab(name as MaterialsTab)">
          <el-tab-pane name="movements">
            <template #label><el-space :size="6"><ArrowRightLeft :size="16" />Hareketler</el-space></template>
            <MovementsBoard :empty="summary?.movementCount === 0" @command="onCommand"
              @create="panels.createMovement()" />
          </el-tab-pane>
          <el-tab-pane name="stock" lazy>
            <template #label><el-space :size="6"><Boxes :size="16" />Stok</el-space></template>
            <StockBoard @open="view.openMaterial" @create-material="panels.editMaterial(null)"
              @adjust="panels.adjust" />
          </el-tab-pane>
        </el-tabs>
      </VerticalStack>
    </el-main>
  </el-scrollbar>
  <MovementDrawer ref="movementDrawer" v-model:open="panels.movementOpen.value" :initial="panels.movementInitial.value"
    @create-material="(name) => panels.editMaterial(null, name)" />
  <MovementDetailDrawer :movement-id="view.movementId.value" @close="view.closeMovement" @open="view.openMovement"
    @take-return="panels.takeReturn" />
  <MaterialDrawer :material-id="view.materialId.value" @close="view.closeMaterial" @open-movement="view.openMovement"
    @show-movements="showMovements" @edit="(material) => panels.editMaterial(material)" @adjust="panels.adjust"
    @take-return="panels.takeReturn" />
  <ReturnsDrawer v-model:open="panels.returnsOpen.value" @open-movement="view.openMovement"
    @take-return="panels.takeReturn" />
  <MaterialFormDialog v-model:open="panels.materialFormOpen.value" :material="panels.editingMaterial.value"
    :name="panels.materialName.value" :categories="options.categories.value" @saved="onMaterialSaved" />
  <AdjustmentDialog v-model="panels.adjusting.value" :locations="options.locations.value" />
  <ExportDialog v-model:open="panels.exportOpen.value" :filters="filters" />
</template>
