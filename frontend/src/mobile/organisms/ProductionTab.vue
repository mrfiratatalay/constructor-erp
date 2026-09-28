<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProductionItemView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { shortDay } from '@/core/format/dates'
import { productionExportUrl } from '@/core/production/productionAccess'
import { recentRows, STATUS_FILTERS, type RecentRow } from '@/core/production/productionBoard'
import { entryAmount } from '@/core/production/productionFormat'
import { canEnterProduction } from '@/core/production/productionRoles'
import { useProductionBoard } from '@/core/production/useProductionBoard'
import { useProductionItemEditor } from '@/core/production/useProductionItemEditor'
import ProductionItemCard from '@/mobile/molecules/ProductionItemCard.vue'
import ProductionSummaryGrid from '@/mobile/molecules/ProductionSummaryGrid.vue'
import ProductionDetailSheet from '@/mobile/organisms/ProductionDetailSheet.vue'
import ProductionEntrySheet from '@/mobile/organisms/ProductionEntrySheet.vue'
import ProductionItemSheet from '@/mobile/organisms/ProductionItemSheet.vue'

/**
 * Şantiyenin İmalat sekmesi, telefonda (TASARIM.md "İmalat"): özet 2 × 2, şefte "İmalat ekle", Excel; arama ve
 * Vant'ın süzgeç menüsü (durum sayılarıyla, taşeron, tür); imalat kartları (dokununca detay, şefte "Güncelle"); son
 * günlük girişler. Formlar alttan açılır. Yüklenirken iskelet, hata olursa "Tekrar dene", boşsa ilk imalata çağrı.
 */
const { siteId } = defineProps<{ siteId: string }>()
const { data: user } = useCurrentUser()
const canEnter = computed(() => canEnterProduction(user.value?.role))
const { isLoading, isError, retry, items, recentEntries, summary, counts, options, shown, filter, clearFilter } =
  useProductionBoard(() => siteId)
const rows = computed(() => recentRows(recentEntries.value, items.value))
const itemOpen = ref(false)
const editor = useProductionItemEditor(() => siteId, itemOpen)
const entryOpen = ref(false)
const entryItem = ref<ProductionItemView | null>(null)
const detailOpen = ref(false)
const detailId = ref<string | null>(null)

/** Vant'ın süzgeç menüsü "hepsi"ni boş değerle seçer; süzgeçte seçilmemiş undefined'dır. */
const statusOptions = computed(() =>
  STATUS_FILTERS.map((option) => ({ text: `${option.label} (${counts.value[option.value]})`, value: option.value })))
const crewOptions = computed(() => [{ text: 'Tüm taşeronlar', value: '' },
  ...options.value.crews.map((crew) => ({ text: crew.name, value: crew.id }))])
const tradeOptions = computed(() => [{ text: 'Tüm türler', value: '' },
  ...options.value.trades.map((name) => ({ text: name, value: name }))])
const crew = computed({ get: () => filter.crewId ?? '', set: (value: string) => (filter.crewId = value || undefined) })
const trade = computed({ get: () => filter.trade ?? '', set: (value: string) => (filter.trade = value || undefined) })
const recentLabel = ({ entry, item }: RecentRow) =>
  [shortDay(entry.day), item.crew?.name, entry.note].filter(Boolean).join(' · ')

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

function updateFromDetail() {
  const item = items.value.find((candidate) => candidate.id === detailId.value)
  detailOpen.value = false
  if (item) openEntry(item)
}
</script>

<template>
  <div class="production-tab" data-testid="production-panel">
    <van-empty v-if="isError" image="error" description="İmalat verileri yüklenemedi.">
      <van-button round type="primary" @click="retry">Tekrar dene</van-button>
    </van-empty>
    <van-skeleton v-else-if="isLoading" title :row="6" />
    <van-empty v-else-if="!items.length" description="Henüz imalat bulunmuyor">
      <van-button v-if="canEnter" round type="primary" icon="plus" @click="openItem(null)">İlk imalatı ekle</van-button>
      <p v-else class="production-tab__hint">Şantiye şefi ilk imalatı açınca burada görünür.</p>
    </van-empty>
    <template v-else>
      <ProductionSummaryGrid :summary="summary" />
      <div class="production-tab__actions">
        <van-button v-if="canEnter" type="primary" round icon="plus" @click="openItem(null)">İmalat ekle</van-button>
        <van-button round plain icon="description" :url="productionExportUrl(siteId)">Excel</van-button>
      </div>
      <van-search v-model="filter.query" shape="round" placeholder="İmalat, tür ya da taşeron ara" class="production-tab__search" />
      <van-dropdown-menu class="production-tab__filters">
        <van-dropdown-item v-model="filter.status" :options="statusOptions" />
        <van-dropdown-item v-model="crew" :options="crewOptions" />
        <van-dropdown-item v-model="trade" :options="tradeOptions" />
      </van-dropdown-menu>
      <van-empty v-if="!shown.length" image-size="64" description="Süzgece uyan imalat yok">
        <van-button round @click="clearFilter">Süzgeci temizle</van-button>
      </van-empty>
      <ProductionItemCard v-for="item in shown" :key="item.id" :item="item" :can-enter="canEnter"
        @detail="openDetail(item.id)" @update="openEntry(item)" />
      <van-cell-group v-if="rows.length" inset title="Son günlük girişler">
        <van-cell v-for="row in rows" :key="row.entry.id" :title="row.item.name" :label="recentLabel(row)"
          :value="entryAmount(row.entry.quantity, row.item.unit)" is-link @click="openDetail(row.item.id)" />
      </van-cell-group>
    </template>
    <ProductionItemSheet v-model:show="itemOpen" :editor="editor" :items="items" />
    <ProductionEntrySheet v-model:show="entryOpen" :site-id="siteId" :item="entryItem" />
    <ProductionDetailSheet v-model:show="detailOpen" :site-id="siteId" :item-id="detailId" :can-enter="canEnter"
      @update="updateFromDetail" />
  </div>
</template>

<style scoped>
.production-tab {
  display: grid;
  gap: var(--space-3);
}

.production-tab__actions {
  display: flex;
  gap: var(--space-2);
}

.production-tab__actions > * {
  flex: 1;
}

/* Arama ve süzgeç sayfanın zemininde; Vant'ın kendi beyaz şeridi ve kenar boşluğu yok. */
.production-tab__search {
  --van-search-background: transparent;
  --van-search-padding: 0;
}

.production-tab__filters {
  --van-dropdown-menu-shadow: none;
}

.production-tab__filters :deep(.van-dropdown-menu__bar) {
  border-radius: var(--radius-md);
}

.production-tab__hint {
  margin: 0;
  color: var(--text-muted);
}
</style>
