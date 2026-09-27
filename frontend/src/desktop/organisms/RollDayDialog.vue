<script setup lang="ts">
import { computed } from 'vue'
import type { MemberCalendarDay } from '@/core/api/generated/model'
import { dayTitle } from '@/core/format/dates'
import { dayDetailLines } from '@/core/rollcall/memberCalendar'
import { recordLabel, recordTone, type MarkChoice } from '@/core/rollcall/rollCallLabels'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import MarkDropdown from '@/desktop/molecules/MarkDropdown.vue'

/**
 * Takvimde güne tıklayınca açılan detay: günün durumu, kendisi katıldıysa saati ve şantiyesi, patron
 * işaretlediyse kim ve ne zaman. "Değiştir" aynı küçük seçimi açar: unutulan ya da yanlış gün düzeltilir.
 * entry boşsa o gün yoklama alınmadı; yine de işaretlenebilir.
 */
const { day, memberName, entry, busy = false } = defineProps<{
  day: string
  memberName: string
  entry?: MemberCalendarDay
  busy?: boolean
}>()
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ choose: [choice: MarkChoice] }>()
const lines = computed(() => dayDetailLines(entry))
</script>

<template>
  <el-dialog v-model="show" :title="`${memberName} · ${dayTitle(day)}`" width="400px" append-to-body>
    <div class="roll-day-dialog">
      <StatusTag v-if="entry" :tone="recordTone(entry.record)">{{ recordLabel(entry.record) }}</StatusTag>
      <p v-for="line in lines" :key="line" class="roll-day-dialog__line">{{ line }}</p>
    </div>
    <template #footer>
      <div class="roll-day-dialog__footer">
        <span v-if="entry?.record">Değiştir</span>
        <MarkDropdown :record="entry?.record" :busy="busy" @choose="(choice) => emit('choose', choice)" />
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.roll-day-dialog {
  display: grid;
  justify-items: start;
  gap: var(--space-2);
}

.roll-day-dialog__line {
  margin: 0;
  color: var(--text-muted);
}

.roll-day-dialog__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  color: var(--text-muted);
}
</style>
