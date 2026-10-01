<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { ProductionItemView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { productionExportUrl } from '@/core/production/productionAccess'
import { recentRows } from '@/core/production/productionBoard'
import { canEnterProduction } from '@/core/production/productionPermissions'
import { useProductionBoard } from '@/core/production/useProductionBoard'
import { useProductionItemEditor } from '@/core/production/useProductionItemEditor'
import { confirmAction } from '@/desktop/confirmAction'
import ProductionFilters from '@/desktop/molecules/ProductionFilters.vue'
import ProductionItemRow from '@/desktop/molecules/ProductionItemRow.vue'
import ProductionSummary from '@/desktop/molecules/ProductionSummary.vue'
import ProductionDetailDrawer from '@/desktop/organisms/ProductionDetailDrawer.vue'
import ProductionEntryDrawer from '@/desktop/organisms/ProductionEntryDrawer.vue'
import ProductionItemDrawer from '@/desktop/organisms/ProductionItemDrawer.vue'
import ProductionRecentEntries from '@/desktop/organisms/ProductionRecentEntries.vue'

/**
 * Şantiyenin İmalat sekmesi (TASARIM.md "İmalat"): başlıkta Rapor / Excel ve (şefte) İmalat ekle; özet kartları,
 * durum süzgeci ve taşeron / tür / arama; imalat kartları; en altta son günlük girişler. İmalat ekleme, günlük giriş
 * ve detay sağdan çekmecede açılır: sayfa değişmez. Yüklenirken iskelet, hata olursa "Tekrar dene", boşsa ilk
 * imalatı açmaya çağrı.
 */
const { siteId } = defineProps<{ siteId: string }>()
const { data: user } = useCurrentUser()
const canEnter = computed(() => canEnterProduction(user.value))
const { isLoading, isError, retry, items, recentEntries, summary, counts, options, shown, filter, clearFilter } =
  useProductionBoard(() => siteId)
const rows = computed(() => recentRows(recentEntries.value, items.value))
const itemOpen = ref(false)
const editor = useProductionItemEditor(() => siteId, itemOpen)
const entryOpen = ref(false)
const entryItem = ref<ProductionItemView | null>(null)
const detailOpen = ref(false)
const detailId = ref<string | null>(null)

function openItem(item: ProductionItemView | null) {
  editor.open(item)
  itemOpen.value = true
}

function openEntry(item: ProductionItemView) {
  entryItem.value = item
  entryOpen.value = true
}

function openDetail(itemId: string) {
  detailId.value = itemId
  detailOpen.value = true
}

/** Detaydaki "Güncelle": detay kapanır, aynı imalatın günlük girişi açılır. */
function updateFromDetail() {
  const item = items.value.find((candidate) => candidate.id === detailId.value)
  detailOpen.value = false
  if (item) openEntry(item)
}

async function remove(item: ProductionItemView) {
  const message = 'Girişi olmayan iş kalemi silinir; girişi olan silinmez.'
  const agreed = await confirmAction({ title: `${item.name} silinsin mi?`, message, confirm: 'Sil' })
  if (!agreed) return
  await editor.removeItem(item).then(() => ElMessage.success('İş kalemi silindi'), (error) => ElMessage.error(errorMessage(error)))
}
</script>

<template>
  <div class="production" data-testid="production-panel">
    <el-row justify="space-between" class="production__head">
      <div class="production__intro">
        <h2 class="production__title">İlerleme Takibi</h2>
        <el-text type="info">İş kalemlerinin ilerlemesi, taşeronların günlük girişleri ve gerçekleşen üretim.</el-text>
      </div>
      <el-space :size="8" class="production__actions">
        <el-button tag="a" :href="productionExportUrl(siteId)" download :icon="Download">Rapor / Excel</el-button>
        <el-button v-if="canEnter" type="primary" :icon="Plus" @click="openItem(null)">İş kalemi ekle</el-button>
      </el-space>
    </el-row>
    <el-result v-if="isError" icon="error" title="İlerleme verileri yüklenemedi."
      sub-title="Bağlantıyı kontrol edip tekrar deneyin.">
      <template #extra><el-button type="primary" @click="retry">Tekrar dene</el-button></template>
    </el-result>
    <el-skeleton v-else-if="isLoading" :rows="8" animated />
    <el-empty v-else-if="!items.length" description="Henüz iş kalemi yok">
      <el-text v-if="!canEnter" type="info">Şantiye şefi ilk iş kalemini açınca burada görünür.</el-text>
      <el-button v-else type="primary" :icon="Plus" @click="openItem(null)">İlk iş kalemini ekle</el-button>
    </el-empty>
    <template v-else>
      <ProductionSummary :summary="summary" />
      <ProductionFilters v-model:status="filter.status" v-model:crew-id="filter.crewId" v-model:trade="filter.trade"
        v-model:query="filter.query" :counts="counts" :crews="options.crews" :trades="options.trades" />
      <el-empty v-if="!shown.length" :image-size="64" description="Süzgece uyan iş kalemi yok">
        <el-button @click="clearFilter">Süzgeci temizle</el-button>
      </el-empty>
      <ProductionItemRow v-for="item in shown" :key="item.id" :item="item" :can-enter="canEnter"
        @detail="openDetail(item.id)" @update="openEntry(item)" @edit="openItem(item)" @remove="remove(item)" />
      <ProductionRecentEntries :rows="rows" @open="openDetail" />
    </template>
    <ProductionItemDrawer v-model:show="itemOpen" :editor="editor" :items="items" />
    <ProductionEntryDrawer v-model:show="entryOpen" :site-id="siteId" :item="entryItem" />
    <ProductionDetailDrawer v-model:show="detailOpen" :site-id="siteId" :item-id="detailId" :can-enter="canEnter"
      @update="updateFromDetail" />
  </div>
</template>

<style scoped>
.production {
  container: production / inline-size;
  display: grid;
  gap: var(--space-4);
}

/* Düğmeler sağda kalır; dar panelde açıklama kendi içinde alt satıra geçer. */
.production__head {
  flex-wrap: nowrap;
  gap: var(--space-4);
}

.production__intro {
  flex: 1;
  min-width: 0;
}

.production__actions {
  flex: none;
  align-self: flex-start;
}

.production__title {
  margin: 0 0 var(--space-1);
}
</style>
