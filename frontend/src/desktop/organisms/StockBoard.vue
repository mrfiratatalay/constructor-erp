<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { useMaterialCatalog } from '@/core/materials/useMaterialCatalog'
import { useMaterialOptions } from '@/core/materials/useMaterialOptions'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useStockRows } from '@/core/materials/useStockRows'
import VerticalStack from '@/desktop/atoms/VerticalStack.vue'
import StockToolbar from '@/desktop/molecules/StockToolbar.vue'
import StockTable from '@/desktop/organisms/StockTable.vue'

/**
 * Stok sekmesi: "Bu malzeme şu an nerede?" Hareket geçmişi değil, bugünkü durum. Kritik ya da tükenen malzeme varsa
 * üstte yazar (tıklanınca yalnızca onlar kalır). Satırdan lokasyon kırılımı ve sayım düzeltmesi; ada tıklayınca kart.
 */
const emit = defineEmits<{
  open: [materialId: string]
  createMaterial: []
  adjust: [materialId: string, locationId: string]
}>()
const stock = useStockRows()
const { filters, rows, warnings } = stock
const options = useMaterialOptions()
const catalog = useMaterialCatalog()
const { can } = useMaterialPermissions()
async function createDepot() {
  try {
    const { value } = await ElMessageBox.prompt('Depolar hareket formunda şantiyelerin üstünde listelenir.', 'Yeni depo', {
      confirmButtonText: 'Ekle',
      cancelButtonText: 'Vazgeç',
      inputPlaceholder: 'Ör. Kartal Deposu',
      inputValidator: (text: string) => text.trim().length > 0 || 'Deponun adını yaz.',
    })
    await catalog.createDepot(value.trim())
    ElMessage.success('Depo eklendi')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <VerticalStack>
    <StockToolbar v-model="filters" :categories="options.categories.value" :locations="options.locations.value"
      :can-manage="can('MANAGE_MATERIAL_CATALOG')" @create-material="emit('createMaterial')" @create-depot="createDepot" />
    <el-alert v-if="warnings" type="warning" show-icon :closable="false">
      <template #title>
        {{ warnings }} malzeme kritik seviyede ya da tükendi.
        <el-button link type="warning" @click="filters.status = 'CRITICAL'">Kritikleri göster</el-button>
      </template>
    </el-alert>
    <el-result v-if="stock.error.value" icon="error" title="Stok yüklenemedi" sub-title="Bağlantını kontrol edip tekrar dene.">
      <template #extra><el-button type="primary" @click="stock.refetch()">Tekrar dene</el-button></template>
    </el-result>
    <el-card v-else shadow="never" body-style="padding: 0">
      <el-skeleton v-if="stock.isPending.value" :rows="6" animated style="padding: 24px" />
      <StockTable v-else :rows="rows" :can-adjust="can('STOCK_ADJUSTMENT')" @open="(id) => emit('open', id)"
        @adjust="(materialId, locationId) => emit('adjust', materialId, locationId)">
        <template #empty>
          <el-empty :image-size="80" :description="stock.hasFilters.value ? 'Bu süzgeçlere uyan malzeme yok' : 'Henüz malzeme kartı yok'">
            <el-button v-if="stock.hasFilters.value" @click="stock.clearFilters()">Filtreleri temizle</el-button>
            <el-button v-else-if="can('MANAGE_MATERIAL_CATALOG')" type="primary" @click="emit('createMaterial')">
              İlk malzemeyi ekle
            </el-button>
          </el-empty>
        </template>
      </StockTable>
    </el-card>
  </VerticalStack>
</template>
