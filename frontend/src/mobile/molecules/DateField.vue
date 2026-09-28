<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { isoDayOf } from '@/core/format/dates'

/**
 * Tarih alanı: dokununca Vant takvimi alttan açılır, güne dokununca seçilir. future=false ileri günü kapatır
 * (hareket tarihi), true yalnızca ileriyi açar (beklenen iade tarihi).
 */
const model = defineModel<string | null>({ required: true })
const { label, future = false, required = false } = defineProps<{ label: string; future?: boolean; required?: boolean }>()
const open = ref(false)
const range = computed(() =>
  future
    ? { min: dayjs().toDate(), max: dayjs().add(1, 'year').toDate() }
    : { min: dayjs().subtract(1, 'year').toDate(), max: dayjs().toDate() },
)
const text = computed(() => (model.value ? dayjs(model.value).format('DD.MM.YYYY') : ''))
</script>

<template>
  <van-field :model-value="text" :label="label" placeholder="Tarih seç" readonly is-link :required="required"
    @click="open = true" />
  <van-calendar v-model:show="open" :title="label" :min-date="range.min" :max-date="range.max"
    :default-date="model ? dayjs(model).toDate() : null" :show-confirm="false" first-day-of-week="1" teleport="body"
    @confirm="(date: Date) => ((model = isoDayOf(date)), (open = false))" />
</template>
