<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { RosterEntryView } from '@/core/api/generated/model'
import { isoDayOf, monthKey } from '@/core/format/dates'
import { monthRange } from '@/core/puantaj/puantajDays'
import { useEntryMonth } from '@/core/puantaj/useEntryMonth'
import { useRoster } from '@/core/puantaj/useRoster'
import EntryCalendar from '@/desktop/molecules/EntryCalendar.vue'
import EntryName from '@/desktop/molecules/EntryName.vue'
import EntryTotals from '@/desktop/molecules/EntryTotals.vue'
import DayEditor from '@/desktop/organisms/DayEditor.vue'

/**
 * Kişinin ya da ekibin ayı, sağdan açılan panelde (liste yerinde kalır): toplamlar, takvim ve seçili günün
 * ayrıntısı. Menüden girince bugün seçilidir. Uygulaması olmayan kişi ya da ekip buradan düzeltilir ve listeden
 * çıkarılır; geçmiş günleri puantajda kalır.
 */
const { entryId } = defineProps<{ entryId: string | null }>()
const emit = defineEmits<{ close: []; edit: [entry: RosterEntryView] }>()
const { month, setMonth, today, row, totals, canMark } = useEntryMonth(() => entryId)
const roster = useRoster()
const selectedDay = ref(today)

/** Açılınca gösterilen ayın bugünü (geçmiş ayda ilk günü) seçilir. */
watch(() => entryId, () => {
  selectedDay.value = month.value === monthKey(today) ? today : monthRange(month.value).from
})

const calendarDate = computed({
  get: () => new Date(`${selectedDay.value}T00:00:00`),
  set: (date: Date) => {
    const day = isoDayOf(date)
    if (monthKey(day) > monthKey(today)) return
    selectedDay.value = day
    if (monthKey(day) !== month.value) void setMonth(monthKey(day))
  },
})

async function archive(entry: RosterEntryView) {
  const message = 'Bugünden sonra listede görünmez; geçmiş günleri puantajda kalır.'
  const confirmed = await ElMessageBox.confirm(message, `${entry.name} listeden çıkarılsın mı?`, {
    confirmButtonText: 'Çıkar', cancelButtonText: 'Vazgeç', type: 'warning',
  }).then(() => true, () => false)
  if (!confirmed) return
  await roster.archive(entry.id).then(() => emit('close'), (error) => ElMessage.error(errorMessage(error)))
}
</script>

<template>
  <el-drawer :model-value="!!entryId" size="640px" @close="emit('close')">
    <template #header>
      <EntryName v-if="row" :entry="row.entry" />
    </template>
    <template v-if="row && totals">
      <EntryTotals :totals="totals" :kind="row.entry.kind" />
      <EntryCalendar v-model="calendarDate" :marks="row.marks" />
      <DayEditor v-if="selectedDay <= today" :key="`${row.entry.id}-${selectedDay}`" :entry="row.entry"
        :day="selectedDay" :mark="row.marks[selectedDay]" :can-edit="canMark(selectedDay) && !row.entry.archived" />
      <el-empty v-else :image-size="60" description="İleri bir günün yoklaması alınmaz." />
    </template>
    <el-empty v-else :image-size="60" description="Bu ay listede yok." />
    <template v-if="row && !row.entry.archived" #footer>
      <el-button @click="emit('edit', row.entry)">{{ row.entry.linked ? 'Görevini düzenle' : 'Düzenle' }}</el-button>
      <el-button v-if="!row.entry.linked" type="danger" plain @click="archive(row.entry)">Listeden çıkar</el-button>
    </template>
  </el-drawer>
</template>
