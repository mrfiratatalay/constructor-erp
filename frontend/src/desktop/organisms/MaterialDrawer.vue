<script setup lang="ts">
import { ClipboardList, Pencil } from 'lucide-vue-next'
import type { MaterialView } from '@/core/api/generated/model'
import { dayWithYear } from '@/core/format/dates'
import { TYPE_LOOKS } from '@/core/materials/materialLabels'
import { movementNumber, withUnit } from '@/core/materials/quantity'
import { dueText } from '@/core/materials/useAwaitingReturns'
import { useMaterialOverview } from '@/core/materials/useMaterialOverview'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import StockStatusTag from '@/desktop/atoms/StockStatusTag.vue'
import VerticalStack from '@/desktop/atoms/VerticalStack.vue'
import DocumentList from '@/desktop/molecules/DocumentList.vue'
import MaterialCell from '@/desktop/molecules/MaterialCell.vue'
import MaterialStats from '@/desktop/molecules/MaterialStats.vue'
import RecentMovements from '@/desktop/molecules/RecentMovements.vue'
import StockBreakdown from '@/desktop/molecules/StockBreakdown.vue'

/**
 * Malzeme detayı (adres: ?kart=…): özet sayılar, lokasyon dağılımı, son hareketler, iadesi beklenen ödünçler ve
 * belgeler. "Tüm hareketleri gör" listeyi bu malzemeyle süzer. Yetkili kişi kartı düzeltir ve sayım girer.
 */
const { materialId } = defineProps<{ materialId: string | null }>()
const emit = defineEmits<{
  close: []
  openMovement: [movementId: string]
  showMovements: [materialId: string]
  edit: [material: MaterialView]
  adjust: [materialId: string, locationId: string | null]
  takeReturn: [loanId: string]
}>()
const { overview, isPending, recent, totals } = useMaterialOverview(() => materialId)
const { can } = useMaterialPermissions()
</script>

<template>
  <el-drawer :model-value="!!materialId" size="760px" @close="emit('close')">
    <template #header>
      <el-space v-if="overview" :size="12">
        <MaterialCell :name="overview.material.name" :code="overview.material.code" />
        <el-text type="info">{{ overview.material.category }} · {{ overview.material.unit }}</el-text>
        <StockStatusTag :status="overview.stock.status" />
        <el-tag v-if="!overview.material.active" type="info" round>Pasif</el-tag>
      </el-space>
    </template>
    <el-skeleton v-if="isPending && materialId" :rows="10" animated />
    <VerticalStack v-else-if="overview" :gap="20">
      <MaterialStats :stock="overview.stock" :depots="totals.depots" :sites="totals.sites"
        :returns="overview.awaitingReturns.length" />
      <el-card shadow="never" header="Lokasyon dağılımı" body-style="padding: 8px 0">
        <StockBreakdown :row="overview.stock" :can-adjust="can('STOCK_ADJUSTMENT')"
          @adjust="(locationId) => emit('adjust', overview!.material.id, locationId)" />
      </el-card>
      <el-card shadow="never">
        <template #header>
          <el-row justify="space-between" align="middle">
            <el-text tag="b">Son hareketler</el-text>
            <el-button link type="primary" @click="emit('showMovements', overview.material.id)">Tüm hareketleri gör</el-button>
          </el-row>
        </template>
        <RecentMovements :rows="recent" @open="(id) => emit('openMovement', id)" />
      </el-card>
      <el-card v-if="overview.awaitingReturns.length" shadow="never" header="Beklenen iadeler">
        <el-row v-for="loan in overview.awaitingReturns" :key="loan.movementId" justify="space-between" align="middle"
          style="padding: 6px 0">
          <el-link type="primary" @click="emit('openMovement', loan.movementId)">{{ movementNumber(loan.number) }}</el-link>
          <el-text>{{ loan.partyName }}</el-text>
          <el-text tag="b">{{ withUnit(loan.remaining, loan.unit) }} bekliyor</el-text>
          <el-text type="info" size="small">{{ dueText(loan) }}</el-text>
          <el-button v-if="can('CREATE_MATERIAL_MOVEMENT')" size="small" type="primary" plain
            @click="emit('takeReturn', loan.movementId)">İade al</el-button>
        </el-row>
      </el-card>
      <el-card shadow="never" header="Belgeler">
        <el-space direction="vertical" alignment="stretch" :size="10" fill style="width: 100%">
          <el-row v-for="line in overview.documents" :key="line.document.id" justify="space-between" align="middle">
            <DocumentList :documents="[line.document]" />
            <el-text type="info" size="small">
              {{ movementNumber(line.movementNumber) }} · {{ TYPE_LOOKS[line.type].label }} · {{ dayWithYear(line.day) }}
            </el-text>
          </el-row>
          <DocumentList v-if="!overview.documents.length" :documents="[]" />
        </el-space>
      </el-card>
    </VerticalStack>
    <template v-if="overview" #footer>
      <el-button v-if="can('STOCK_ADJUSTMENT')" :icon="ClipboardList" @click="emit('adjust', overview.material.id, null)">
        Sayım düzeltmesi
      </el-button>
      <el-button v-if="can('MANAGE_MATERIAL_CATALOG')" type="primary" plain :icon="Pencil"
        @click="emit('edit', overview.material)">Kartı düzenle</el-button>
    </template>
  </el-drawer>
</template>
