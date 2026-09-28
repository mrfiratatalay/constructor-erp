<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRightLeft, Boxes } from 'lucide-vue-next'
import type { MovementRow } from '@/core/api/generated/model'
import type { MovementForm } from '@/core/materials/movementForm'
import { ROLE_LABELS } from '@/core/team/roles'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useMaterialsView, type MaterialsTab } from '@/core/materials/useMaterialsView'
import { useMaterialSummary } from '@/core/materials/useMovementList'
import { useMovementFilters } from '@/core/materials/useMovementFilters'
import { useMovementPrompts } from '@/desktop/movementPrompts'
import MaterialsHeader from '@/desktop/molecules/MaterialsHeader.vue'
import MovementDrawer from '@/desktop/organisms/MovementDrawer.vue'
import MovementsBoard from '@/desktop/organisms/MovementsBoard.vue'
import SummaryCards from '@/desktop/organisms/SummaryCards.vue'
import PageStack from '@/desktop/templates/PageStack.vue'

type Command = 'open' | 'deliver' | 'takeReturn' | 'cancel'

/**
 * Malzemeler (TASARIM.md "Malzemeler"): firmanın global modülü, şantiye listesi kolonu yoktur. Üstte özet kartları,
 * altında Hareketler ve Stok sekmeleri; birincil iş "+ Malzeme Hareketi" sağdan çekmece açar. Açık hareket, açık
 * malzeme kartı, sekme ve süzgeçler adreste durur.
 */
const view = useMaterialsView()
const { summary } = useMaterialSummary()
const { can, user } = useMaterialPermissions()
const { update } = useMovementFilters()
const prompts = useMovementPrompts()
const movementOpen = ref(false)
const initial = ref<MovementForm | null>(null)
const role = computed(() => (user.value ? ROLE_LABELS[user.value.role] : ''))

function createMovement(form: MovementForm | null = null) {
  initial.value = form
  movementOpen.value = true
}

function onSummary(key: 'materials' | 'toSite' | 'outbound' | 'returns') {
  if (key === 'materials') return view.setTab('stock')
  view.setTab('movements')
  if (key === 'toSite') update({ type: 'TO_SITE', preset: 'thisMonth', ...{} })
  if (key === 'outbound') update({ type: 'OUTBOUND', preset: 'thisMonth' })
}

function onCommand(command: Command, row: MovementRow) {
  if (command === 'open') return view.openMovement(row.id)
  if (command === 'deliver') return prompts.deliver(row)
  if (command === 'cancel') return prompts.cancel(row)
}
</script>

<template>
  <el-scrollbar>
    <el-main>
      <PageStack :gap="24">
        <MaterialsHeader :role="role" :can-export="can('EXPORT_MATERIALS')"
          :can-create="can('CREATE_MATERIAL_MOVEMENT')" @create="createMovement()" />
        <SummaryCards :summary="summary" @open="onSummary" />
        <el-tabs :model-value="view.tab.value" @tab-change="(name) => view.setTab(name as MaterialsTab)">
          <el-tab-pane name="movements">
            <template #label><el-space :size="6"><ArrowRightLeft :size="16" />Hareketler</el-space></template>
            <MovementsBoard :empty="summary?.movementCount === 0" @command="onCommand" @create="createMovement()" />
          </el-tab-pane>
          <el-tab-pane name="stock" lazy>
            <template #label><el-space :size="6"><Boxes :size="16" />Stok</el-space></template>
          </el-tab-pane>
        </el-tabs>
      </PageStack>
    </el-main>
  </el-scrollbar>
  <MovementDrawer v-model:open="movementOpen" :initial="initial" />
</template>
