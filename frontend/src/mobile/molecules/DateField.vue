<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { isoDayOf } from '@/core/format/dates'

/**
 * Tarih alanı: dokununca Vant takvimi alttan açılır, güne dokununca seçilir. future=false ileri günü kapatır
 * (hareket tarihi), true yalnızca ileriyi açar (beklenen iade tarihi), anyDay ikisini de açar (iş kaleminin
 * başlangıcı ve planlanan bitişi). min takvimi o günden başlatır (bitiş başlangıçtan önce olamaz). clearable:
 * takvimin altında "Tarihi kaldır" durur, alan boş bırakılabilir.
 */
const model = defineModel<string | null>({ required: true })
const {
  label,
  future = false,
  anyDay = false,
  min,
  clearable = false,
  required = false,
} = defineProps<{ label: string; future?: boolean; anyDay?: boolean; min?: Date; clearable?: boolean; required?: boolean }>()
const open = ref(false)
const range = computed(() => {
  const today = dayjs()
  const [first, last] = anyDay
    ? [today.subtract(1, 'year'), today.add(2, 'year')]
    : future
      ? [today, today.add(1, 'year')]
      : [today.subtract(1, 'year'), today]
  return { min: min ?? first.toDate(), max: last.toDate() }
})
const text = computed(() => (model.value ? dayjs(model.value).format('DD.MM.YYYY') : ''))

function pick(date: Date | null) {
  model.value = date ? isoDayOf(date) : null
  open.value = false
}
</script>

<template>
  <van-field :model-value="text" :label="label" placeholder="Tarih seç" readonly is-link :required="required"
    @click="open = true" />
  <van-calendar v-model:show="open" :title="label" :min-date="range.min" :max-date="range.max"
    :default-date="model ? dayjs(model).toDate() : null" :show-confirm="false" first-day-of-week="1" teleport="body"
    @confirm="pick">
    <template v-if="clearable && model" #footer>
      <van-button round block @click="pick(null)">Tarihi kaldır</van-button>
    </template>
  </van-calendar>
</template>
