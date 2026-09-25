<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { CreateWorkerRequest } from '@/core/api/generated/model'
import type { AttendanceMark, DraftRow } from '@/core/attendance/attendanceDraft'
import { ATTENDANCE_STATUS, markLabel } from '@/core/attendance/attendanceLabels'
import { countsLine } from '@/core/attendance/attendanceSummary'
import { useAttendanceDraft } from '@/core/attendance/useAttendanceDraft'
import { fullDate } from '@/core/format/dates'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import StatusNotice from '@/mobile/molecules/StatusNotice.vue'
import AttendanceMarkPopup from '@/mobile/organisms/AttendanceMarkPopup.vue'
import WorkerFormPopup from '@/mobile/organisms/WorkerFormPopup.vue'

/**
 * Günlük yoklama, telefonda alttan açılan pencere. Şantiyenin personeli listelenir, herkes "Geldi" başlar;
 * şef yalnızca gelmeyene dokunur. O günün yoklaması alınmışsa pencere onunla dolu açılır ve bunu söyler:
 * aynı gün ikinci yoklama olmaz, mevcut olan düzenlenir. Sohbete mesaj gitmez. Kaydet düğmesi hep altta.
 */
const show = defineModel<boolean>('show', { required: true })
const { siteId, siteName, day } = defineProps<{ siteId: string; siteName: string; day: string }>()
const emit = defineEmits<{ saved: [day: string] }>()

const draft = useAttendanceDraft(() => siteId, () => day, show)
const { rows, counts, isLoading, isRecorded, isSaving } = draft
const marking = ref<DraftRow | null>(null)
const addingWorker = ref(false)

// Her açılışta kaydedilmemiş işaretler atılır: pencere kayıttaki (ya da varsayılan) hâliyle gelir.
watch(show, (open) => open && draft.reset())

const summary = computed(() => countsLine(counts.value))
const detailOf = (row: DraftRow) => [row.worker.trade, row.mark.note].filter(Boolean).join(' · ')

function applyMark(mark: AttendanceMark) {
  if (marking.value) draft.mark(marking.value.worker.id, mark)
  marking.value = null
}

async function addWorker(form: CreateWorkerRequest) {
  try {
    await draft.addWorker(form)
    addingWorker.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

async function save() {
  try {
    await draft.save()
    show.value = false
    emit('saved', day)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body">
    <section class="attendance">
      <header class="attendance__head">
        <h2>Yoklama — {{ fullDate(day) }}</h2>
        <p>{{ siteName }} · {{ rows.length }} personel</p>
      </header>
      <StatusNotice v-if="isRecorded" tone="neutral" :text="`${fullDate(day)} yoklaması zaten alınmış. Değiştirip kaydedebilirsin.`" />
      <van-skeleton v-if="isLoading" :row="5" />
      <p v-else-if="!rows.length" class="attendance__empty">Bu şantiyede henüz personel yok. Aşağıdan ekle.</p>
      <van-cell-group v-else inset class="attendance__group">
        <van-cell v-for="row in rows" :key="row.worker.id" :title="row.worker.fullName" :label="detailOf(row) || undefined"
          center clickable @click="marking = row">
          <template #value>
            <StatusTag :tone="ATTENDANCE_STATUS[row.mark.status].tone">{{ markLabel(row.mark.status, row.mark.reason) }}</StatusTag>
          </template>
        </van-cell>
      </van-cell-group>
      <van-button round block plain type="primary" @click="addingWorker = true">＋ Personel ekle</van-button>
      <footer class="attendance__actions">
        <p class="attendance__summary">{{ summary }}</p>
        <van-button type="primary" round block size="large" :loading="isSaving" :disabled="!rows.length" @click="save">
          Yoklamayı Kaydet
        </van-button>
      </footer>
    </section>
  </van-popup>
  <AttendanceMarkPopup :row="marking" @close="marking = null" @save="applyMark" />
  <WorkerFormPopup v-model:show="addingWorker" :saving="isSaving" @submit="addWorker" />
</template>

<style scoped>
.attendance {
  display: grid;
  gap: var(--space-3);
  max-height: 90dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) 0;
}

.attendance__head {
  padding-right: var(--space-8);
}

.attendance__head h2 {
  margin: 0;
  font-size: var(--text-lg);
}

.attendance__head p,
.attendance__summary {
  margin: 2px 0 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.attendance__empty {
  margin: 0;
  padding: var(--space-6) 0;
  color: var(--text-muted);
  text-align: center;
}

/* Beyaz pencerede beyaz grup kaybolmasın: liste hafif zeminli bir blok (kişi paneli gibi). */
.attendance__group {
  --van-cell-background: var(--surface-muted);
}

/* 12 kişilik listede de "Yoklamayı Kaydet" parmağın altında kalsın: pencerenin dibine yapışır. */
.attendance__actions {
  position: sticky;
  bottom: 0;
  display: grid;
  gap: var(--space-2);
  padding: var(--space-2) 0 calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
  background: var(--surface);
  text-align: center;
}
</style>
