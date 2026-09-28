<script setup lang="ts">
import { computed } from 'vue'
import { activeFilters } from '@/core/materials/activeFilters'
import type { MovementType } from '@/core/materials/materialLabels'
import { useMaterialOptions } from '@/core/materials/useMaterialOptions'
import { useMovementFeed } from '@/core/materials/useMovementFeed'
import { useMovementFilters } from '@/core/materials/useMovementFilters'
import { COUNT_OF } from '@/core/materials/useMovementList'
import { useSearchText } from '@/core/materials/useSearchText'
import FilterTags from '@/mobile/molecules/FilterTags.vue'
import MovementCell from '@/mobile/molecules/MovementCell.vue'
import MovementFilterBar from '@/mobile/molecules/MovementFilterBar.vue'
import TypeChipRow from '@/mobile/molecules/TypeChipRow.vue'

/**
 * Telefonda Hareketler: arama, kayan tür çipleri, süzgeç menüsü, seçili süzgeç etiketleri ve aşağı kaydırdıkça
 * uzayan liste. Süzgeçler masaüstündekiyle aynıdır ve adreste durur. Boş liste iki ayrı durumdur: hiç hareket yok ya
 * da süzgeçlere uyan yok.
 */
const { empty } = defineProps<{ empty: boolean }>()
/** Kutu sayfanın gri zemininde kaybolmasın: beyaz, sayfa kenarına dayalı. */
const SEARCH_STYLE = { padding: 0, '--van-search-content-background': 'var(--surface)' }
const emit = defineEmits<{ open: [movementId: string]; create: [] }>()
const { filters, params, update, setDates, hasActive, clear } = useMovementFilters()
const feed = useMovementFeed(params)
const options = useMaterialOptions()
const text = useSearchText(() => filters.value.q, (q) => update({ q }))
const type = computed({ get: () => filters.value.type, set: (next: MovementType | null) => update({ type: next }) })
const countOf = (key: MovementType | null) => {
  const counts = feed.counts.value
  if (!counts) return 0
  return key ? counts[COUNT_OF[key]] : counts.all
}
const tags = computed(() =>
  activeFilters(filters.value, {
    location: (id) => options.locationOf(id)?.name,
    material: (id) => options.materialOf(id)?.name,
    party: (id) => options.partyName(id),
  }).filter((tag) => tag.key !== 'q'),
)
</script>

<template>
  <van-search v-model="text" placeholder="Malzeme, firma ya da MH-no ara" shape="round" background="transparent"
    :style="SEARCH_STYLE" />
  <TypeChipRow v-model="type" :count-of="countOf" />
  <van-cell-group inset>
    <MovementFilterBar :filters="filters" :locations="options.locations.value" @update="update"
      @dates="(preset) => setDates(preset)" />
  </van-cell-group>
  <FilterTags :tags="tags" @remove="(tag) => update(tag.reset)" @clear="clear" />
  <van-skeleton v-if="feed.isPending.value" :row="6" />
  <van-empty v-else-if="feed.error.value" image="error" description="Malzeme verileri yüklenemedi">
    <van-button round type="primary" size="small" @click="feed.refetch()">Tekrar dene</van-button>
  </van-empty>
  <van-empty v-else-if="!feed.rows.value.length"
    :description="!empty || hasActive ? 'Bu filtrelere uygun kayıt bulunamadı' : 'Henüz malzeme hareketi bulunmuyor'">
    <van-button v-if="!empty || hasActive" round size="small" @click="clear">Filtreleri temizle</van-button>
    <van-button v-else round type="primary" size="small" @click="emit('create')">Malzeme Hareketi</van-button>
  </van-empty>
  <van-list v-else :loading="feed.isLoadingMore.value" :finished="!feed.hasMore.value" finished-text="Hepsi bu kadar"
    @load="feed.loadMore()">
    <van-cell-group inset>
      <MovementCell v-for="row in feed.rows.value" :key="row.id" :row="row" @open="emit('open', row.id)" />
    </van-cell-group>
  </van-list>
</template>
