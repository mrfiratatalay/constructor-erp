<script setup lang="ts">
import { computed } from 'vue'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { DayMarkView, RosterEntryView } from '@/core/api/generated/model'
import { clockTime, dayTitle } from '@/core/format/dates'
import { entryTitle, statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'
import { useDayEditor, type MarkDraft } from '@/core/puantaj/useDayEditor'
import MarkChoices from '@/mobile/molecules/MarkChoices.vue'

/**
 * Bir günün ayrıntısı, alttan: durum (satırdaki seçimin aynısı, büyük renkli düğmeler), mesai (yalnızca Geldi
 * gününde, yarım saatlik adımla) ve not (durum seçilince); kilitli boş kutular gösterilmez. Her değişiklik anında
 * kaydedilir, en altta kimin ne zaman kaydettiği yazar. Şef geçmiş bir günü düzeltemez: kilitli durur.
 */
const show = defineModel<boolean>('show', { required: true })
const { entry, day, mark = undefined, canEdit } = defineProps<{
  entry: RosterEntryView | null
  day: string
  mark?: DayMarkView
  canEdit: boolean
}>()
const editor = useDayEditor(() => (entry ? { entryId: entry.id, day, mark } : null))
const { draft } = editor

const run = (work: Promise<unknown>) => work.catch((error) => showFailToast(errorMessage(error)))
const save = (change: Partial<MarkDraft>) => run(editor.save(change))
const choose = (status: DayStatus) => canEdit && save({ status })
const trace = computed(() => {
  if (!canEdit) return 'Geçmiş bir günü yalnızca patron düzeltir.'
  return mark ? `Kaydedildi · ${clockTime(mark.markedAt)} · ${mark.markedByName}` : 'Durumu seçince mesai ve not yazılır.'
})
</script>

<template>
  <van-action-sheet v-model:show="show" :title="entry ? `${entryTitle(entry)} · ${dayTitle(day)}` : ''"
    teleport="body">
    <template v-if="entry">
      <van-cell-group inset title="Durum">
        <van-cell>
          <template #title>
            <MarkChoices :choices="statusChoices(entry.kind)" :current="draft.status" :disabled="!canEdit"
              @choose="choose" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-if="entry.kind === 'PERSON' && draft.status === 'PRESENT'" inset title="Mesai (saat)">
        <van-cell title="Geldiği güne eklenen saat">
          <template #value>
            <van-stepper :model-value="draft.overtimeHours" :min="0" :max="16" :step="0.5" :disabled="!canEdit"
              @change="(hours: string | number) => save({ overtimeHours: Number(hours) })" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-if="draft.status" inset title="Not">
        <van-field v-model="draft.note" type="textarea" rows="2" autosize maxlength="200" show-word-limit
          placeholder="Ör. Beton dökümü için akşam kaldı" :disabled="!canEdit" @blur="save({})" />
      </van-cell-group>
      <van-cell-group inset :title="trace">
        <van-cell v-if="canEdit && mark" title="İşaretlemeyi kaldır" clickable @click="run(editor.clear())" />
      </van-cell-group>
    </template>
  </van-action-sheet>
</template>
