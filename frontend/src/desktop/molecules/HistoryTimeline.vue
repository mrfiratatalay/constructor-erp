<script setup lang="ts">
import type { HistoryEntry, HistoryEntryKind } from '@/core/api/generated/model'
import { dateTime } from '@/core/format/dates'
import { HISTORY_LABELS } from '@/core/materials/materialLabels'

/**
 * Hareketin geçmişi (audit): kim, ne zaman ne yaptı; iptalde nedeni, düzeltmede neyin değiştiği. Geçmiş değişmez,
 * silinmez: defter iz bırakmadan değişmez (İlke 6).
 */
const { history } = defineProps<{ history: HistoryEntry[] }>()
const TONES: Partial<Record<HistoryEntryKind, 'primary' | 'success' | 'danger' | 'warning'>> = {
  CREATED: 'primary',
  DELIVERED: 'success',
  RETURN_ADDED: 'success',
  UPDATED: 'warning',
  CANCELLED: 'danger',
}
</script>

<template>
  <el-timeline>
    <el-timeline-item v-for="(entry, index) in history" :key="index" :timestamp="dateTime(entry.at)"
      :type="TONES[entry.kind] ?? 'info'" placement="top">
      <el-space direction="vertical" alignment="flex-start" :size="2">
        <el-text><b>{{ entry.actorName }}</b> · {{ HISTORY_LABELS[entry.kind] }}</el-text>
        <el-text v-if="entry.note" type="info" size="small">{{ entry.note }}</el-text>
      </el-space>
    </el-timeline-item>
  </el-timeline>
</template>
