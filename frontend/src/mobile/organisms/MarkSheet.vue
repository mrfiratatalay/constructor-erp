<script setup lang="ts">
import type { PuantajRow } from '@/core/puantaj/puantajBook'
import { entrySubtitle, entryTitle, statusChoices, type DayStatus } from '@/core/puantaj/puantajLabels'
import MarkChoices from '@/mobile/molecules/MarkChoices.vue'

/**
 * Satıra dokununca alttan seçim, tek dokunuş: üstte büyük renkli düğmeler (Geldi · Yarım gün · Gelmedi · İzinli;
 * ekipte ikisi), seçili olan dolu. Altında ikincil işler: mesai ve not, işareti kaldırmak, kişinin ayı. Seçim
 * kaydedilince pencere kapanır: şef bir sonraki satıra geçer.
 */
const show = defineModel<boolean>('show', { required: true })
const { row, day } = defineProps<{ row: PuantajRow | null; day: string }>()
const emit = defineEmits<{ choose: [status: DayStatus]; details: []; clear: []; calendar: [] }>()

function run(action: () => void) {
  show.value = false
  action()
}

/** Başlığın altında: "Kalıpçı · bugün"; görevi yazılmamışsa yalnızca "Bugün". */
const descriptionOf = (target: PuantajRow) => {
  const subtitle = entrySubtitle(target.entry)
  return subtitle ? `${subtitle} · bugün` : 'Bugün'
}
</script>

<template>
  <van-action-sheet v-model:show="show" :title="row ? entryTitle(row.entry) : ''"
    :description="row ? descriptionOf(row) : ''" teleport="body">
    <template v-if="row">
      <van-cell>
        <template #title>
          <MarkChoices :choices="statusChoices(row.entry.kind)" :current="row.marks[day]?.status"
            @choose="(status: DayStatus) => run(() => emit('choose', status))" />
        </template>
      </van-cell>
      <van-cell-group inset>
        <van-cell :title="row.entry.kind === 'CREW' ? 'Not yaz' : 'Mesai ve not'" icon="edit" is-link
          @click="run(() => emit('details'))" />
        <van-cell title="Ayın takvimi" icon="calendar-o" is-link @click="run(() => emit('calendar'))" />
        <van-cell v-if="row.marks[day]" title="İşaretlemeyi kaldır" icon="revoke" clickable
          @click="run(() => emit('clear'))" />
      </van-cell-group>
    </template>
  </van-action-sheet>
</template>
