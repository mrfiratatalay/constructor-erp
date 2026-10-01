<script setup lang="ts">
import { computed, ref } from 'vue'
import { dayWithYear, isoDayOf } from '@/core/format/dates'

const dates = defineModel<[string, string] | null>({ required: true })
const choosing = ref(false)
const initial = computed(() => dates.value?.map((day) => new Date(`${day}T00:00:00`)) ?? null)
const minDate = computed(() => new Date(Math.min(new Date(2000, 0, 1).getTime(), initial.value?.[0]?.getTime() ?? Infinity)))
const maxDate = computed(() => new Date(Math.max(new Date(new Date().getFullYear() + 2, 11, 31).getTime(), initial.value?.[1]?.getTime() ?? 0)))
const label = computed(() => dates.value ? dates.value.map(dayWithYear).join(' – ') : 'Tüm tarihler')

function select(value: Date | Date[]) {
  if (!Array.isArray(value) || value.length !== 2) return
  dates.value = [isoDayOf(value[0]!), isoDayOf(value[1]!)]
  choosing.value = false
}
</script>

<template>
  <van-field :model-value="label" label="Tarih" readonly is-link @click="choosing = true" />
  <van-calendar v-model:show="choosing" type="range" switch-mode="year-month" first-day-of-week="1" title="Hareket tarihi" :default-date="initial"
    :min-date="minDate" :max-date="maxDate" :allow-same-day="true" teleport="body" @confirm="select" />
</template>
