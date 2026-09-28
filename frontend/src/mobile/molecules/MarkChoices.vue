<script setup lang="ts">
import { STATUS_LOOKS, type DayStatus } from '@/core/puantaj/puantajLabels'
import { vanType } from '@/mobile/markTones'

/**
 * Durum seçimi, büyük düğmelerle (sahada eldivenle de basılır): Geldi · Yarım gün · Gelmedi · İzinli, ekipte ikisi.
 * Her düğme kendi renginde; seçili olan dolu, öbürleri çerçeveli. Tek dokunuş yeter, seçiliye yeniden basmak bir şey
 * değiştirmez. İki sütun alttan açılan seçimde; dört sütun toplu işaretleme çubuğunda, orada kısa adla ("Yarım").
 */
const {
  choices,
  current = null,
  disabled = false,
  columns = 2,
} = defineProps<{
  choices: DayStatus[]
  current?: DayStatus | null
  disabled?: boolean
  columns?: 2 | 4
}>()
const emit = defineEmits<{ choose: [status: DayStatus] }>()
</script>

<template>
  <van-row :gutter="[10, 10]">
    <van-col v-for="status in choices" :key="status" :span="24 / Math.min(columns, choices.length)">
      <van-button block round :type="vanType(STATUS_LOOKS[status].tone)" :plain="status !== current"
        :disabled="disabled" :size="columns === 2 ? 'large' : 'small'" :aria-pressed="status === current"
        @click="status !== current && emit('choose', status)">
        {{ columns === 2 ? STATUS_LOOKS[status].label : STATUS_LOOKS[status].brief }}
      </van-button>
    </van-col>
  </van-row>
</template>
