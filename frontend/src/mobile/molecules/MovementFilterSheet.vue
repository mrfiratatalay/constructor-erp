<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ShipmentRowType } from '@/core/api/generated/model'
import type { MovementFilter } from '@/core/shipments/movementFilters'
import { movementTypeLabel } from '@/core/shipments/movementPresentation'
import MovementDateRange from '@/mobile/molecules/MovementDateRange.vue'
import MovementPointPicker from '@/mobile/molecules/MovementPointPicker.vue'

const show = defineModel<boolean>('show', { required: true })
const { filter, points } = defineProps<{ filter: MovementFilter; points: string[] }>()
const emit = defineEmits<{ change: [patch: Partial<MovementFilter>]; clear: [] }>()
const draft = reactive<MovementFilter>({ ...filter })
const choosingPoint = ref(false)
const count = computed(() => Number(!!draft.dates) + Number(!!draft.type) + Number(!!draft.point))
watch(show, (open) => { if (open) Object.assign(draft, { ...filter, dates: filter.dates ? [...filter.dates] : null }) })

function apply() {
  emit('change', { dates: draft.dates, type: draft.type, point: draft.point })
  show.value = false
}

function clear() {
  emit('clear')
  show.value = false
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round teleport="body" class="movement-filters">
    <van-nav-bar title="Hareket filtreleri" left-text="Vazgeç" right-text="Temizle"
      @click-left="show = false" @click-right="clear" />
    <div class="movement-filters__body">
      <section>
        <h3>Tarih ve nokta</h3>
        <van-cell-group inset>
          <MovementDateRange v-model="draft.dates" />
          <van-field :model-value="draft.point || 'Tüm noktalar'" label="Nokta" readonly is-link @click="choosingPoint = true" />
        </van-cell-group>
      </section>
      <section>
        <h3>Hareket türü</h3>
        <van-radio-group v-model="draft.type">
          <van-cell-group inset>
            <van-cell title="Tüm hareket türleri" clickable @click="draft.type = ''">
              <template #right-icon><van-radio name="" /></template>
            </van-cell>
            <van-cell v-for="type in ShipmentRowType" :key="type" :title="movementTypeLabel(type)" clickable @click="draft.type = type">
              <template #right-icon><van-radio :name="type" /></template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </section>
    </div>
    <div class="movement-filters__footer">
      <van-button type="primary" block round @click="apply">{{ count ? `${count} filtreyi uygula` : 'Hareketleri göster' }}</van-button>
    </div>
    <MovementPointPicker v-model:show="choosingPoint" v-model:point="draft.point" :points="points" />
  </van-popup>
</template>

<style scoped>
.movement-filters { display: flex; flex-direction: column; max-height: 88dvh; background: var(--canvas); }
.movement-filters__body { display: grid; gap: var(--space-5); padding: var(--space-4); overflow-y: auto; min-height: 0; }
.movement-filters__body h3 { margin: 0 0 var(--space-3); color: var(--text-muted); font-size: var(--text-xs); letter-spacing: .06em; text-transform: uppercase; }
.movement-filters__footer { flex: none; padding: var(--space-4); padding-bottom: calc(var(--space-4) + env(safe-area-inset-bottom, 0px)); border-top: 1px solid var(--border-soft); background: var(--surface); }
</style>
