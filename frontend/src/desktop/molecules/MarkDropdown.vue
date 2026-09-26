<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import type { DayRecord } from '@/core/api/generated/model'
import { MARK_CHOICES, recordLabel, recordTone, type MarkChoice } from '@/core/rollcall/rollCallLabels'
import StatusTag from '@/desktop/atoms/StatusTag.vue'

/**
 * Patronun küçük seçimi, tek tıklama: Geldi · Hastalık · İzinli · Habersiz · Diğer. Kaydı olmayan kişide
 * "İşaretle" düğmesi, olanda durumu ("Gelmedi · Hastalık ▾"): duruma tıklayınca aynı seçim açılır.
 */
const { record = null, busy = false } = defineProps<{ record?: DayRecord | null; busy?: boolean }>()
const emit = defineEmits<{ choose: [choice: MarkChoice] }>()

function onCommand(key: string) {
  const choice = MARK_CHOICES.find((candidate) => candidate.key === key)
  if (choice) emit('choose', choice)
}
</script>

<template>
  <el-dropdown trigger="click" :disabled="busy" @command="onCommand">
    <button v-if="record" type="button" class="mark-dropdown__status" :aria-label="`Değiştir: ${recordLabel(record)}`">
      <StatusTag :tone="recordTone(record)">{{ recordLabel(record) }}</StatusTag>
      <ChevronDown :size="14" />
    </button>
    <el-button v-else size="small" :loading="busy">İşaretle</el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="choice in MARK_CHOICES" :key="choice.key" :command="choice.key">
          {{ choice.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.mark-dropdown__status {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 0;
  border: 0;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
}
</style>
