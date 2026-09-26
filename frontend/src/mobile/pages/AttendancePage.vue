<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MemberDayView } from '@/core/api/generated/model'
import { dayTitle } from '@/core/format/dates'
import { recordLabel, recordTone, type MarkChoice } from '@/core/rollcall/rollCallLabels'
import { rowDetail } from '@/core/rollcall/todayRoll'
import { useTodayRoll } from '@/core/rollcall/useTodayRoll'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import ExcelExportSheet from '@/mobile/molecules/ExcelExportSheet.vue'
import MarkSheet from '@/mobile/molecules/MarkSheet.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Yoklama sekmesi (yalnızca patron): doğrudan bugün. Bölümler iş bekleyenden başlar: Katılmayanlar
 * (İşaretle), Gelmeyenler, Gelenler (saat · şantiye). Kişiye dokununca takvimi açılır; sağdaki durum ya da
 * "İşaretle" alttan seçimi açar. Sağ üstteki Excel ayın dosyasını indirir. Çalışanlar sohbetteki yoklama
 * mesajından kendileri katılır.
 */
const router = useRouter()
const roll = useTodayRoll()
const { sections, summary, isEmpty, isPending } = roll
const marking = ref<MemberDayView | null>(null)
const sheetOpen = ref(false)
const exportOpen = ref(false)
const groups = computed(() =>
  [
    { key: 'missing', title: 'Katılmayanlar', members: sections.value.missing },
    { key: 'absent', title: 'Gelmeyenler', members: sections.value.absent },
    { key: 'present', title: 'Gelenler', members: sections.value.present },
  ].filter((group) => group.members.length),
)

function openMark(row: MemberDayView) {
  marking.value = row
  sheetOpen.value = true
}

async function mark(choice: MarkChoice) {
  if (!marking.value) return
  try {
    await roll.mark(marking.value.member.id, choice)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

const openCalendar = (row: MemberDayView) =>
  router.push({ name: 'memberAttendance', params: { userId: row.member.id } })
</script>

<template>
  <MobilePage title="Yoklama" :subtitle="dayTitle(roll.day)">
    <template #action>
      <van-button size="small" round plain type="primary" @click="exportOpen = true">Excel</van-button>
    </template>
    <p v-if="summary" class="attendance-page__summary">{{ summary }}</p>
    <van-skeleton v-if="isPending" :row="5" />
    <van-empty v-else-if="isEmpty" image-size="72"
      description="Firmada henüz çalışan yok. Kişi ekle bağlantısıyla katılanlar burada görünür." />
    <van-cell-group v-for="group in groups" :key="group.key" inset :title="`${group.title} ${group.members.length}`"
      :data-testid="`roll-${group.key}`">
      <van-cell v-for="row in group.members" :key="row.member.id" :title="row.member.fullName"
        :label="rowDetail(row.record) || undefined" center is-link @click="openCalendar(row)">
        <template #value>
          <button v-if="row.record" type="button" class="attendance-page__status" @click.stop="openMark(row)">
            <StatusTag :tone="recordTone(row.record)">{{ recordLabel(row.record) }}</StatusTag>
          </button>
          <van-button v-else size="small" round plain type="primary" @click.stop="openMark(row)">
            İşaretle
          </van-button>
        </template>
      </van-cell>
    </van-cell-group>
    <ExcelExportSheet v-model:show="exportOpen" />
    <MarkSheet v-model:show="sheetOpen" :title="marking ? `${marking.member.fullName} · bugün` : ''"
      @choose="mark" />
  </MobilePage>
</template>

<style scoped>
.attendance-page__summary {
  margin: var(--space-3) var(--space-4) 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.attendance-page__status {
  padding: 0;
  border: 0;
  background: none;
}
</style>
