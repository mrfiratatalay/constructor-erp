<script setup lang="ts">
import { computed } from 'vue'
import type { MovementRow } from '@/core/api/generated/model'
import { activeFilters } from '@/core/materials/activeFilters'
import type { MovementType } from '@/core/materials/materialLabels'
import { useMaterialOptions } from '@/core/materials/useMaterialOptions'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { PAGE_SIZE, useMovementFilters } from '@/core/materials/useMovementFilters'
import { useMovementList } from '@/core/materials/useMovementList'
import ActiveFilters from '@/desktop/molecules/ActiveFilters.vue'
import MovementChips from '@/desktop/molecules/MovementChips.vue'
import MovementsEmpty from '@/desktop/molecules/MovementsEmpty.vue'
import MovementToolbar from '@/desktop/molecules/MovementToolbar.vue'
import MovementTable from '@/desktop/organisms/MovementTable.vue'
import PageStack from '@/desktop/templates/PageStack.vue'

type Command = 'open' | 'deliver' | 'takeReturn' | 'cancel'

/**
 * Hareketler sekmesi: tür çipleri, süzgeç satırı, seçili süzgeçlerin etiketleri, tablo ve sayfalar. Süzgeçler adreste
 * durur; liste sunucuda süzülür ve sayfalanır. İlk yüklemede iskelet, hata olursa "Tekrar dene" gösterilir.
 */
const { empty } = defineProps<{ empty: boolean }>()
const emit = defineEmits<{ command: [command: Command, row: MovementRow]; create: [] }>()
const { filters, params, update, setPage, setDates, hasActive, clear } = useMovementFilters()
const { rows, total, countOf, isPending, isFetching, error, refetch } = useMovementList(params)
const options = useMaterialOptions()
const { can } = useMaterialPermissions()
const type = computed({ get: () => filters.value.type, set: (next: MovementType | null) => update({ type: next }) })
const tags = computed(() =>
  activeFilters(filters.value, {
    location: (id) => options.locationOf(id)?.name,
    material: (id) => options.materialOf(id)?.name,
    party: (id) => options.partyName(id),
  }),
)
</script>

<template>
  <PageStack>
    <MovementChips v-model="type" :count-of="countOf" />
    <MovementToolbar :filters="filters" :locations="options.locations.value" :materials="options.materials.value"
      :parties="options.parties.value" @update="update" @dates="setDates" />
    <ActiveFilters :tags="tags" @remove="(tag) => update(tag.reset)" @clear="clear" />
    <el-result v-if="error" icon="error" title="Malzeme verileri yüklenemedi"
      sub-title="İnternet bağlantını kontrol edip tekrar dene.">
      <template #extra><el-button type="primary" @click="refetch()">Tekrar dene</el-button></template>
    </el-result>
    <el-card v-else shadow="never" body-style="padding: 0">
      <el-skeleton v-if="isPending" :rows="8" animated style="padding: 24px" />
      <MovementTable v-else :rows="rows" :sort="filters.sort" :ascending="filters.ascending"
        :loading="isFetching && !isPending" @sort="(sort, ascending) => update({ sort, ascending })"
        @command="(command, row) => emit('command', command, row)">
        <template #empty>
          <MovementsEmpty :filtered="!empty || hasActive" :can-create="can('CREATE_MATERIAL_MOVEMENT')"
            @create="emit('create')" @clear="clear" />
        </template>
      </MovementTable>
    </el-card>
    <el-row v-if="total > 0" justify="space-between" align="middle">
      <el-text type="info">{{ total }} hareket</el-text>
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="PAGE_SIZE"
        :current-page="filters.page + 1" @current-change="(page: number) => setPage(page - 1)" />
    </el-row>
  </PageStack>
</template>
