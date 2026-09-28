<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { DayMarkView, RosterEntryView } from '@/core/api/generated/model'
import { clockTime, dayTitle } from '@/core/format/dates'
import type { DayStatus } from '@/core/puantaj/puantajLabels'
import { useDayEditor, type MarkDraft } from '@/core/puantaj/useDayEditor'
import MarkTag from '@/desktop/atoms/MarkTag.vue'
import MarkPicker from '@/desktop/molecules/MarkPicker.vue'

/**
 * Bir günün ayrıntısı: önce durum (satırdaki renkli düğmelerin aynısı, tek tık), sonra mesai (yalnızca Geldi gününde,
 * yarım saatlik adımla) ve not. Durum seçilmeden kilitli kutular gösterilmez, ne yapılacağı tek satırda yazar. Her
 * değişiklik anında kaydedilir; başlıkta kimin ne zaman kaydettiği (kayıt yoksa gri "İşaretlenmedi"). Şef geçmiş bir
 * günü göremez değil, düzeltemez: form kilitli durur ve nedeni yazar.
 */
const { entry, day, mark = undefined, canEdit } = defineProps<{
  entry: RosterEntryView
  day: string
  mark?: DayMarkView
  canEdit: boolean
}>()
const editor = useDayEditor(() => ({ entryId: entry.id, day, mark }))
const { draft } = editor

const run = (work: Promise<unknown>) => work.catch((error) => ElMessage.error(errorMessage(error)))
const save = (change: Partial<MarkDraft>) => run(editor.save(change))
const trace = computed(() => (mark ? `Kaydedildi · ${clockTime(mark.markedAt)} · ${mark.markedByName}` : ''))
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <el-row justify="space-between" align="middle">
        <b>{{ dayTitle(day) }}</b>
        <el-text v-if="mark" type="success" size="small">{{ trace }}</el-text>
        <MarkTag v-else />
      </el-row>
    </template>
    <el-form label-position="top" :disabled="!canEdit">
      <el-form-item label="Durum">
        <MarkPicker :kind="entry.kind" :current="draft.status" size="default" :disabled="!canEdit"
          @choose="(status: DayStatus) => save({ status })" />
      </el-form-item>
      <template v-if="draft.status">
        <el-form-item v-if="entry.kind === 'PERSON' && draft.status === 'PRESENT'" label="Mesai (saat)">
          <el-input-number :model-value="draft.overtimeHours" :min="0" :max="16" :step="0.5" step-strictly
            @change="(hours: number | undefined) => save({ overtimeHours: hours ?? 0 })" />
        </el-form-item>
        <el-form-item label="Not">
          <el-input v-model="draft.note" type="textarea" :autosize="{ minRows: 2 }" maxlength="200" show-word-limit
            placeholder="Ör. Beton dökümü için akşam kaldı" @change="save({})" />
        </el-form-item>
      </template>
      <el-text v-else-if="canEdit" type="info" size="small">Durumu seçince mesai ve not yazılır.</el-text>
    </el-form>
    <el-text v-if="!canEdit" type="info" size="small">Geçmiş bir günü yalnızca patron düzeltir.</el-text>
    <el-button v-else-if="mark" link type="danger" @click="run(editor.clear())">İşaretlemeyi kaldır</el-button>
  </el-card>
</template>
