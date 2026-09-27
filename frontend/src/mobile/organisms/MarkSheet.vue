<script setup lang="ts">
import { computed } from 'vue'
import type { PuantajRow } from '@/core/puantaj/puantajBook'
import { entryTitle, STATUS_LOOKS, statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'

/**
 * Satıra dokununca alttan seçim, tek dokunuş: Geldi · Yarım gün · Gelmedi · İzinli (ekipte yalnızca Geldi ve
 * Gelmedi). Altında mesai ve not, işareti kaldırmak ve kişinin ayı. Seçili durumun altında "Seçili" yazar.
 */
const show = defineModel<boolean>('show', { required: true })
const { row, day } = defineProps<{ row: PuantajRow | null; day: string }>()
const emit = defineEmits<{ choose: [status: DayStatus]; details: []; clear: []; calendar: [] }>()

interface SheetAction {
  name: string
  key: string
  subname?: string
}

const actions = computed<SheetAction[]>(() => {
  if (!row) return []
  const current = row.marks[day]?.status
  return [
    ...statusChoices(row.entry.kind).map((status) => ({
      name: STATUS_LOOKS[status].label,
      key: status,
      subname: status === current ? 'Seçili' : undefined,
    })),
    { name: row.entry.kind === 'CREW' ? 'Not yaz' : 'Mesai ve not', key: 'details' },
    ...(current ? [{ name: 'İşaretlemeyi kaldır', key: 'clear' }] : []),
    { name: 'Ayın takvimi', key: 'calendar' },
  ]
})

const OTHER: Record<string, () => void> = {
  details: () => emit('details'),
  clear: () => emit('clear'),
  calendar: () => emit('calendar'),
}

function onSelect(action: SheetAction) {
  show.value = false
  const other = OTHER[action.key]
  if (other) other()
  else emit('choose', action.key as DayStatus)
}
</script>

<template>
  <van-action-sheet v-model:show="show" :actions="actions" :description="row ? `${entryTitle(row.entry)} · bugün` : ''"
    cancel-text="Vazgeç" teleport="body" @select="onSelect" />
</template>
