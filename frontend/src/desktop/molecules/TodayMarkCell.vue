<script setup lang="ts">
import { MessageSquareText, MoreHorizontal } from 'lucide-vue-next'
import type { DayMarkView, RosterEntryView } from '@/core/api/generated/model'
import { hoursText, STATUS_LOOKS, statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'

/**
 * Bugünün hücresi: seçenekler açıkta, tek tıkla işaretlenir (şefin sabahı en sık "Geldi" der). Mesai ve not
 * ⋯ menüsünden, ayrıntı panelinde yazılır; yazılmışsa hücrede görünür. Listeden çıkmış kalem işaretlenmez.
 */
const { entry, mark = undefined, disabled = false } = defineProps<{
  entry: RosterEntryView
  mark?: DayMarkView
  disabled?: boolean
}>()
const emit = defineEmits<{ choose: [status: DayStatus]; details: []; clear: [] }>()

const onMore = (command: 'details' | 'clear') => (command === 'details' ? emit('details') : emit('clear'))
</script>

<template>
  <el-space :size="8">
    <el-radio-group :model-value="mark?.status" size="small" :disabled="disabled"
      @change="(status) => emit('choose', status as DayStatus)">
      <el-radio-button v-for="status in statusChoices(entry.kind)" :key="status" :value="status">
        {{ STATUS_LOOKS[status].label }}
      </el-radio-button>
    </el-radio-group>
    <el-text v-if="mark?.overtimeHours" type="success" size="small">+{{ hoursText(mark.overtimeHours) }} s</el-text>
    <el-tooltip v-if="mark?.note" :content="mark.note" placement="top">
      <el-icon color="var(--el-text-color-secondary)"><MessageSquareText /></el-icon>
    </el-tooltip>
    <el-dropdown v-if="!disabled" trigger="click" @command="onMore">
      <el-button link aria-label="Mesai ve not"><MoreHorizontal :size="16" /></el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="details">{{ entry.kind === 'CREW' ? 'Not yaz…' : 'Mesai ve not…' }}</el-dropdown-item>
          <el-dropdown-item v-if="mark" command="clear" divided>İşaretlemeyi kaldır</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </el-space>
</template>
