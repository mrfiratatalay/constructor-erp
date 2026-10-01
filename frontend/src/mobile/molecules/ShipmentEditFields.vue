<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import { fullDate } from '@/core/format/dates'

const day = defineModel<string>('day', { required: true })
const description = defineModel<string>('description', { required: true })
const { disabled } = defineProps<{ disabled: boolean }>()
const choosingDay = ref(false)
const dateParts = ref<string[]>([])
const selectedDay = computed(() => dayjs(day.value).toDate())
const dateBounds = computed(() => {
  const selectedYear = selectedDay.value.getFullYear()
  return { min: new Date(Math.min(1900, selectedYear), 0, 1),
    max: new Date(Math.max(new Date().getFullYear() + 10, selectedYear), 11, 31) }
})

function openDatePicker() {
  if (disabled) return
  dateParts.value = day.value.split('-')
  choosingDay.value = true
}

function pickDay({ selectedValues }: { selectedValues: string[] }) {
  if (!disabled) day.value = selectedValues.join('-')
  choosingDay.value = false
}
</script>

<template>
  <section class="movement-edit">
    <h3>HAREKETİ DÜZENLE</h3>
    <van-cell-group inset>
      <van-field :model-value="fullDate(day)" label="Hareket tarihi" required readonly is-link :disabled="disabled"
        @click="openDatePicker" />
      <van-field v-model="description" label="Açıklama" type="textarea" rows="3" autosize maxlength="500"
        show-word-limit placeholder="Teslim alan kişi veya not..." :disabled="disabled" />
    </van-cell-group>
    <van-popup v-model:show="choosingDay" position="bottom" round teleport="body" safe-area-inset-bottom>
      <van-date-picker v-model="dateParts" title="Hareket tarihi" :min-date="dateBounds.min"
        :max-date="dateBounds.max" confirm-button-text="Seç" cancel-button-text="Vazgeç" :readonly="disabled"
        @confirm="pickDay" @cancel="choosingDay = false" />
    </van-popup>
  </section>
</template>

<style scoped>
.movement-edit { padding: var(--space-3); border-radius: var(--radius-md); background: var(--surface-muted); margin-bottom: var(--space-5); }
.movement-edit h3 { margin: 0 0 var(--space-2); font-size: var(--text-xs); color: var(--text-muted); letter-spacing: .05em; }
.movement-edit .van-cell { background: var(--surface-muted); }
.movement-edit :deep(.van-field__label) { width: 85px; font-size: var(--text-xs); }
</style>
