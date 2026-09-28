<script setup lang="ts">
import { ref } from 'vue'
import { fullDate, isoDayOf } from '@/core/format/dates'

/**
 * Tarih alanı, telefonda: "25 Eylül 2026" yazar; dokununca alttan tarih çarkı açılır (Vant). max: bu günden sonrası
 * çarkta yoktur (ör. imalat girişinde ileri gün). clearable: çarkın ikinci düğmesi "Kaldır"dır, tarih silinir.
 */
const date = defineModel<string | null>({ required: true })
const { label, min, max, clearable = false, required = false } = defineProps<{
  label: string
  min?: Date
  max?: Date
  clearable?: boolean
  required?: boolean
}>()
const open = ref(false)
const parts = ref<string[]>([])

function show() {
  parts.value = (date.value ?? isoDayOf(max ?? new Date())).split('-')
  open.value = true
}

function pick({ selectedValues }: { selectedValues: string[] }) {
  date.value = selectedValues.join('-')
  open.value = false
}

function cancel() {
  if (clearable) date.value = null
  open.value = false
}
</script>

<template>
  <van-field :model-value="date ? fullDate(date) : ''" :label="label" placeholder="Seç" readonly is-link
    :required="required" @click="show" />
  <van-popup v-model:show="open" position="bottom" round teleport="body">
    <van-date-picker v-model="parts" :title="label" :min-date="min" :max-date="max" confirm-button-text="Seç"
      :cancel-button-text="clearable ? 'Kaldır' : 'Vazgeç'" @confirm="pick" @cancel="cancel" />
  </van-popup>
</template>
