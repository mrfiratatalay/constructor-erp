<script setup lang="ts">
import type { DayMarkView } from '@/core/api/generated/model'

/**
 * Bugünün mesaisi, satırın içinde: yalnızca Geldi gününde, yarım saatlik adımla (en çok 16). Şef paneli açmadan
 * yazar; değer değişince kaydedilir. Başka durumda mesai olmaz, "—" durur; işaretsiz satırda hücre boştur.
 */
const { mark = undefined, disabled = false } = defineProps<{ mark?: DayMarkView; disabled?: boolean }>()
const emit = defineEmits<{ change: [hours: number] }>()
/** Element Plus sayı kutusunun varsayılanı 150 px; "16" ve oklar için 124 px yeter, satır dizüstüne sığsın. */
const WIDTH = { width: '124px' }
</script>

<template>
  <el-input-number v-if="mark?.status === 'PRESENT'" :model-value="mark.overtimeHours ?? undefined" :style="WIDTH"
    :min="0" :max="16" :step="0.5" step-strictly controls-position="right" placeholder="Yok"
    aria-label="Mesai (saat)" :disabled="disabled"
    @change="(hours: number | undefined) => emit('change', hours ?? 0)" />
  <el-text v-else-if="mark" type="info">—</el-text>
</template>
