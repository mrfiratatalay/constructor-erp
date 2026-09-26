<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MemberCalendarDay } from '@/core/api/generated/model'
import { dayTitle } from '@/core/format/dates'
import { dayDetailLines } from '@/core/rollcall/memberCalendar'
import { recordLabel, recordTone, type MarkChoice } from '@/core/rollcall/rollCallLabels'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import MarkSheet from '@/mobile/molecules/MarkSheet.vue'

/**
 * Takvimde güne dokununca alttan açılan detay: günün durumu, kendisi katıldıysa saati ve şantiyesi, patron
 * işaretlediyse kim ve ne zaman. "Değiştir" (kayıt yoksa "İşaretle") aynı küçük seçimi açar: unutulan ya da
 * yanlış gün düzeltilir. entry boşsa o gün yoklama alınmadı; yine de işaretlenebilir.
 */
const { day, memberName, entry, busy = false } = defineProps<{
  day: string
  memberName: string
  entry?: MemberCalendarDay
  busy?: boolean
}>()
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ choose: [choice: MarkChoice] }>()
const choosing = ref(false)
const title = computed(() => `${memberName} · ${dayTitle(day)}`)
const lines = computed(() => dayDetailLines(entry))
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body">
    <section class="roll-day-sheet">
      <h3 class="roll-day-sheet__title">{{ title }}</h3>
      <StatusTag v-if="entry" :tone="recordTone(entry.record)">{{ recordLabel(entry.record) }}</StatusTag>
      <p v-for="line in lines" :key="line" class="roll-day-sheet__line">{{ line }}</p>
      <van-button block round plain type="primary" :loading="busy" @click="choosing = true">
        {{ entry?.record ? 'Değiştir' : 'İşaretle' }}
      </van-button>
    </section>
  </van-popup>
  <MarkSheet v-model:show="choosing" :title="title" @choose="(choice) => emit('choose', choice)" />
</template>

<style scoped>
.roll-day-sheet {
  display: grid;
  justify-items: start;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4) calc(var(--space-5) + env(safe-area-inset-bottom));
}

.roll-day-sheet__title {
  margin: 0;
  padding-right: var(--space-8);
  font-size: var(--text-md);
}

.roll-day-sheet__line {
  margin: 0;
  color: var(--text-muted);
}
</style>
