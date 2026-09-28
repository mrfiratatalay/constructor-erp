<script setup lang="ts">
import type { HistoryEntry } from '@/core/api/generated/model'
import { dateTime } from '@/core/format/dates'
import { HISTORY_LABELS } from '@/core/materials/materialLabels'

/** Hareketin değişmez geçmişi (audit), Vant'ın dikey adımlarıyla: kim, ne yaptı, ne zaman; varsa nedeni. */
const { history } = defineProps<{ history: HistoryEntry[] }>()
</script>

<template>
  <van-steps direction="vertical" :active="history.length - 1" active-color="var(--brand-primary)">
    <van-step v-for="(entry, index) in history" :key="index">
      <strong>{{ entry.actorName }}</strong> · {{ HISTORY_LABELS[entry.kind] }}
      <p v-if="entry.note" style="margin: 2px 0">{{ entry.note }}</p>
      <small>{{ dateTime(entry.at) }}</small>
    </van-step>
  </van-steps>
</template>
