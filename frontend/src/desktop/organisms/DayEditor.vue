<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { DayMarkView, RosterEntryView } from '@/core/api/generated/model'
import { clockTime, dayTitle } from '@/core/format/dates'
import { STATUS_LOOKS, statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'
import { useDayEditor, type MarkDraft } from '@/core/puantaj/useDayEditor'

/**
 * Bir günün ayrıntısı: önce durum (büyük düğmeler, tek dokunuş), gerekiyorsa mesai (yalnızca Geldi gününe, yarım
 * saatlik adımla) ve not. Her değişiklik anında kaydedilir; başlıkta kimin ne zaman kaydettiği yazar. Şef geçmiş
 * bir günü göremez değil, düzeltemez: form kilitli durur ve nedeni yazar.
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
const trace = computed(() =>
  mark ? `Kaydedildi · ${clockTime(mark.markedAt)} · ${mark.markedByName}` : 'İşaretlenmedi',
)
</script>

<template>
  <el-card shadow="never">
    <template #header>
      <el-row justify="space-between" align="middle">
        <b>{{ dayTitle(day) }}</b>
        <el-text :type="mark ? 'success' : 'info'" size="small">{{ trace }}</el-text>
      </el-row>
    </template>
    <el-form label-position="top" :disabled="!canEdit">
      <el-form-item label="Durum">
        <el-radio-group :model-value="draft.status ?? undefined" size="large"
          @change="(status) => save({ status: status as DayStatus })">
          <el-radio-button v-for="status in statusChoices(entry.kind)" :key="status" :value="status">
            {{ STATUS_LOOKS[status].label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="entry.kind === 'PERSON'" label="Mesai (saat)">
        <el-input-number :model-value="draft.overtimeHours" :min="0" :max="16" :step="0.5" step-strictly
          :disabled="draft.status !== 'PRESENT'"
          @change="(hours: number | undefined) => save({ overtimeHours: hours ?? 0 })" />
      </el-form-item>
      <el-form-item label="Not">
        <el-input v-model="draft.note" type="textarea" :autosize="{ minRows: 2 }" maxlength="200" show-word-limit
          :disabled="!draft.status" placeholder="Ör. Beton dökümü için akşam kaldı" @change="save({})" />
      </el-form-item>
    </el-form>
    <el-text v-if="!canEdit" type="info" size="small">Geçmiş bir günü yalnızca patron düzeltir.</el-text>
    <el-button v-else-if="mark" link type="danger" @click="run(editor.clear())">İşaretlemeyi kaldır</el-button>
  </el-card>
</template>
