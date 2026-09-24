<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { CreateWorkerRequest } from '@/core/api/generated/model'
import type { AttendanceMark, DraftRow } from '@/core/attendance/attendanceDraft'
import { ATTENDANCE_STATUS, markLabel } from '@/core/attendance/attendanceLabels'
import { countsLine } from '@/core/attendance/attendanceSummary'
import { useAttendanceDraft } from '@/core/attendance/useAttendanceDraft'
import { fullDate } from '@/core/format/dates'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'
import AttendanceMarkDialog from '@/desktop/organisms/AttendanceMarkDialog.vue'
import WorkerFormDialog from '@/desktop/organisms/WorkerFormDialog.vue'

/**
 * Günlük yoklama penceresi. Açılınca şantiyenin personeli listelenir, herkes "Geldi" başlar; şef yalnızca
 * gelmeyene tıklar. O günün yoklaması alınmışsa pencere onunla dolu açılır ve bunu söyler: aynı gün ikinci
 * yoklama olmaz, mevcut olan düzenlenir. Sohbete mesaj gitmez; kayıt yoklama modülünde durur.
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

const title = computed(() => `Yoklama — ${fullDate(day)}`)
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
    ElMessage.error(errorMessage(error))
  }
}

async function save() {
  try {
    await draft.save()
    show.value = false
    emit('saved', day)
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="show" :title="title" width="560px">
    <p class="attendance__site">{{ siteName }} · {{ rows.length }} personel</p>
    <el-alert v-if="isRecorded" type="info" show-icon :closable="false" class="attendance__notice"
      :title="`${fullDate(day)} yoklaması zaten alınmış. Değiştirip kaydedebilirsin.`" />
    <el-skeleton v-if="isLoading" :rows="5" animated />
    <p v-else-if="!rows.length" class="attendance__empty">Bu şantiyede henüz personel yok. Aşağıdan ekle.</p>
    <el-scrollbar v-else max-height="50vh" class="attendance__list">
      <ListRow v-for="row in rows" :key="row.worker.id" @select="marking = row">
        <template #title>{{ row.worker.fullName }}</template>
        <template #meta>
          <StatusTag :tone="ATTENDANCE_STATUS[row.mark.status].tone">{{ markLabel(row.mark.status, row.mark.reason) }}</StatusTag>
        </template>
        <template v-if="detailOf(row)">{{ detailOf(row) }}</template>
      </ListRow>
    </el-scrollbar>
    <el-button plain class="attendance__add" @click="addingWorker = true"><Plus :size="16" /> Personel ekle</el-button>
    <template #footer>
      <div class="attendance__footer">
        <span class="attendance__summary">{{ summary }}</span>
        <el-button type="primary" size="large" :loading="isSaving" :disabled="!rows.length" @click="save">
          Yoklamayı Kaydet
        </el-button>
      </div>
    </template>
  </el-dialog>
  <AttendanceMarkDialog :row="marking" @close="marking = null" @save="applyMark" />
  <WorkerFormDialog v-model:show="addingWorker" :saving="isSaving" @submit="addWorker" />
</template>

<style scoped>
.attendance__site {
  margin: calc(-1 * var(--space-3)) 0 var(--space-3);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.attendance__notice {
  margin-bottom: var(--space-3);
}

.attendance__empty {
  margin: 0;
  padding: var(--space-6) 0;
  color: var(--text-muted);
  text-align: center;
}

/* Satırlar tek bir beyaz blokta; liste ekranlarındaki satırın aynısı (ListRow). */
.attendance__list {
  overflow: hidden;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
}

.attendance__add {
  width: 100%;
  margin-top: var(--space-3);
}

.attendance__add :deep(svg) {
  margin-right: var(--space-1);
}

.attendance__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.attendance__summary {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
