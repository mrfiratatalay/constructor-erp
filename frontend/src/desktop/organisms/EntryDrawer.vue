<script setup lang="ts">
import { watch } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { RosterEntryView } from '@/core/api/generated/model'
import { useCalendarDay } from '@/core/puantaj/useCalendarDay'
import { useEntryMonth } from '@/core/puantaj/useEntryMonth'
import { useRoster } from '@/core/puantaj/useRoster'
import { confirmAction } from '@/desktop/confirmAction'
import EntryCalendar from '@/desktop/molecules/EntryCalendar.vue'
import EntryName from '@/desktop/molecules/EntryName.vue'
import EntryTotals from '@/desktop/molecules/EntryTotals.vue'
import DayEditor from '@/desktop/organisms/DayEditor.vue'

/**
 * Kişinin ya da ekibin ayı, sağdan açılan panelde (liste yerinde kalır): üstte toplamlar, altta solda takvim, sağda
 * seçili günün ayrıntısı; güne tıklayınca ayrıntı kaydırmadan yanda değişir.
 * Cetvelde bir hücreden gelindiyse o gün, adından gelindiyse bugün seçilidir. Uygulaması olmayan kişi ya da ekip
 * buradan düzeltilir ve listeden çıkarılır; geçmiş günleri puantajda kalır.
 */
const { entryId, day = null } = defineProps<{ entryId: string | null; day?: string | null }>()
const emit = defineEmits<{ close: []; edit: [entry: RosterEntryView] }>()
const { month, setMonth, today, row, totals, canMark } = useEntryMonth(() => entryId)
const roster = useRoster()
const { selectedDay, calendarDate, select, reset } = useCalendarDay(month, setMonth, today)

watch([() => entryId, () => day], () => (day ? select(day) : reset()))

async function archive(entry: RosterEntryView) {
  const message = 'Bugünden sonra listede görünmez; geçmiş günleri puantajda kalır.'
  const confirmed = await confirmAction({ title: `${entry.name} listeden çıkarılsın mı?`, message, confirm: 'Çıkar' })
  if (!confirmed) return
  await roster.archive(entry.id).then(() => emit('close'), (error) => ElMessage.error(errorMessage(error)))
}
</script>

<template>
  <el-drawer :model-value="!!entryId" size="900px" @close="emit('close')">
    <template #header>
      <EntryName v-if="row" :entry="row.entry" />
    </template>
    <el-space v-if="row && totals" direction="vertical" alignment="stretch" :size="20" style="width: 100%">
      <EntryTotals :totals="totals" :kind="row.entry.kind" />
      <el-row :gutter="20">
        <el-col :span="12"><EntryCalendar v-model="calendarDate" :marks="row.marks" /></el-col>
        <el-col :span="12">
          <DayEditor v-if="selectedDay <= today" :key="`${row.entry.id}-${selectedDay}`" :entry="row.entry"
            :day="selectedDay" :mark="row.marks[selectedDay]"
            :can-edit="canMark(selectedDay) && !row.entry.archived" />
          <el-alert v-else type="info" :closable="false" show-icon title="İleri bir günün yoklaması alınmaz." />
        </el-col>
      </el-row>
    </el-space>
    <el-empty v-else :image-size="60" description="Bu ay listede yok." />
    <template v-if="row && !row.entry.archived" #footer>
      <el-button @click="emit('edit', row.entry)">{{ row.entry.linked ? 'Görevini düzenle' : 'Düzenle' }}</el-button>
      <el-button v-if="!row.entry.linked" type="danger" plain @click="archive(row.entry)">Listeden çıkar</el-button>
    </template>
  </el-drawer>
</template>
