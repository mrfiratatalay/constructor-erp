<script setup lang="ts">
import type { RollRow } from '@/core/attendance/dailyRoll'
import AttendanceRollCell from '@/mobile/molecules/AttendanceRollCell.vue'

/**
 * Yoklama ekranının "Bugün" listesi (Vant hücre grubu): herkes tek listede (önce gelenler), her satırda durumu.
 * Kişiye dokununca sayfa alttan küçük seçimi açar.
 * showSite: birden çok şantiyenin personeli listedeyse kişinin şantiyesi görevinin yanında küçük yazar.
 */
const { title, rows, showSite } = defineProps<{ title: string; rows: RollRow[]; showSite: boolean }>()
const emit = defineEmits<{ choose: [row: RollRow] }>()
</script>

<template>
  <van-cell-group inset :title="title" class="roll-group">
    <AttendanceRollCell v-for="row in rows" :key="row.worker.id" :row="row" :show-site="showSite" clickable
      @select="emit('choose', row)" />
  </van-cell-group>
</template>
