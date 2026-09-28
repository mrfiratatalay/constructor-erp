<script setup lang="ts">
import { computed, ref } from 'vue'
import { dayProgress, type DayCounts } from '@/core/puantaj/puantajBook'
import { STATUS_LOOKS, UNMARKED, type DayStatus, type StatusLook } from '@/core/puantaj/puantajLabels'
import type { StatusKey } from '@/core/puantaj/useRowFilter'
import { vanColor, vanType } from '@/mobile/markTones'

/**
 * Bugünün özeti, şefin sabahı: halka kaçının işaretlendiğini gösterir ("10/15"), işaretledikçe dolar, bitince
 * yeşerir. Altında durum sayıları; aynı zamanda süzgeç: "○ 5 Kalan"a dokununca yalnızca işaretlenmeyenler kalır.
 * Seçili süzgeç kendi renginde dolar, öbürleri çerçeveli.
 */
const { counts, selected } = defineProps<{ counts: DayCounts; selected: StatusKey[] }>()
const emit = defineEmits<{ toggle: [key: StatusKey] }>()
const progress = computed(() => dayProgress(counts))
const complete = computed(() => progress.value.total > 0 && counts.unmarked === 0)
const shownRate = ref(0)
const CHIPS: { key: StatusKey; look: StatusLook }[] = [
  ...(Object.keys(STATUS_LOOKS) as DayStatus[]).map((key) => ({ key, look: STATUS_LOOKS[key] })),
  { key: 'UNMARKED', look: UNMARKED },
]
const countOf = (key: StatusKey) => (key === 'UNMARKED' ? counts.unmarked : counts[key])
/** Vant'ta gri düğme türü yok: seçili "Kalan" gri tonla dolar, yoksa seçilince öncekinden farkı görünmezdi. */
const fillOf = (chip: { key: StatusKey; look: StatusLook }) =>
  chip.look.tone === 'info' && selected.includes(chip.key) ? vanColor('info') : undefined
const title = computed(() => (complete.value ? 'Bugünün yoklaması tamam' : 'Bugünün yoklaması'))
const label = computed(() =>
  complete.value ? 'Herkes işaretlendi.' : `${counts.unmarked} kişi ya da ekip işaretlenmedi`,
)
</script>

<template>
  <van-cell-group inset>
    <van-cell center :title="title" :label="label">
      <template #value>
        <van-circle v-model:current-rate="shownRate" :rate="progress.percent" :speed="120" :size="60"
          :stroke-width="90" :color="vanColor(complete ? 'success' : 'primary')" layer-color="var(--van-gray-2)"
          :text="`${progress.marked}/${progress.total}`" />
      </template>
    </van-cell>
    <van-cell>
      <template #title>
        <van-space wrap :size="8">
          <van-button v-for="chip in CHIPS" :key="chip.key" size="small" round :type="vanType(chip.look.tone)"
            :plain="!selected.includes(chip.key)" :color="fillOf(chip)" :aria-pressed="selected.includes(chip.key)"
            @click="emit('toggle', chip.key)">
            {{ chip.look.brief }} {{ countOf(chip.key) }}
          </van-button>
        </van-space>
      </template>
    </van-cell>
  </van-cell-group>
</template>
