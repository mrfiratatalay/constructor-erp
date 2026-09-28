<script setup lang="ts">
import type { RosterEntryView } from '@/core/api/generated/model'
import { STATUS_LOOKS, statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'

/**
 * Bir günün durumu, tek tıkla: yan yana düğmeler (Geldi · Yarım gün · Gelmedi · İzinli; ekipte ikisi). Seçili olan
 * kendi renginde dolar, öbürleri sakin durur. Eskiden her seçili düğme lacivertti: "Gelmedi" ile "Geldi" aynı
 * görünüyordu; şimdi renk de anlatır. Seçiliye yeniden basmak bir şey değiştirmez.
 */
const {
  kind,
  current = null,
  size = 'small',
  disabled = false,
} = defineProps<{
  kind: RosterEntryView['kind']
  current?: DayStatus | null
  size?: 'small' | 'default' | 'large'
  disabled?: boolean
}>()
const emit = defineEmits<{ choose: [status: DayStatus] }>()
</script>

<template>
  <el-button-group :size="size">
    <el-button v-for="status in statusChoices(kind)" :key="status" :disabled="disabled"
      :type="status === current ? STATUS_LOOKS[status].tone : undefined" :aria-pressed="status === current"
      @click="status !== current && emit('choose', status)">
      {{ STATUS_LOOKS[status].label }}
    </el-button>
  </el-button-group>
</template>
