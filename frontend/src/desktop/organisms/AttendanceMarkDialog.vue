<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ABSENCE_CHOICES, type AbsenceChoice } from '@/core/attendance/attendanceLabels'
import {
  absenceChoiceOf,
  absenceMark,
  CAME,
  type AttendanceMark,
  type DraftRow,
} from '@/core/attendance/attendanceDraft'

/**
 * Yoklamada bir kişiye tıklayınca: geldi mi, gelmedi mi? Gelmediyse nedeni (Hasta · İzinli · Habersiz · Diğer)
 * ve isteğe bağlı not. Yalnızca pencerenin listesini değiştirir; kayıt "Yoklamayı Kaydet" ile gider.
 */
const { row } = defineProps<{ row: DraftRow | null }>()
const emit = defineEmits<{ close: []; save: [mark: AttendanceMark] }>()

const came = ref(true)
/** Element Plus seçim grubu null almaz: "seçim yok" undefined'dır. */
const choice = ref<AbsenceChoice | undefined>(undefined)
const note = ref('')

// Kişi her açıldığında şu anki işaretiyle gelir.
watch(
  () => row,
  (current) => {
    if (!current) return
    came.value = current.mark.status === 'PRESENT'
    choice.value = absenceChoiceOf(current.mark) ?? undefined
    note.value = current.mark.note ?? ''
  },
)

/** Gelmedi seçildiyse neden seçilmeden kaydedilmez: "neden gelmedi" sorusu cevapsız kalmasın. */
const canSave = computed(() => came.value || choice.value !== undefined)
const notePlaceholder = computed(() =>
  choice.value === 'OTHER' && !came.value ? 'Ne oldu? (ör. Doktora gitti)' : 'İsteğe bağlı (ör. Sabah aradı, öğleden sonra gelecek)',
)

function save() {
  if (came.value) emit('save', { ...CAME, note: note.value.trim() || null })
  else if (choice.value) emit('save', absenceMark(choice.value, note.value))
}
</script>

<template>
  <el-dialog :model-value="row !== null" :title="row?.worker.fullName" width="440px" append-to-body
    @update:model-value="(open: boolean) => !open && emit('close')">
    <el-form label-position="top" @submit.prevent="save">
      <el-form-item label="Durum">
        <el-radio-group v-model="came" size="large">
          <el-radio-button :value="true">Geldi</el-radio-button>
          <el-radio-button :value="false">Gelmedi</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!came" label="Gelmediği neden">
        <el-radio-group v-model="choice" class="mark__reasons">
          <el-radio v-for="option in ABSENCE_CHOICES" :key="option.value" :value="option.value" border>
            {{ option.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Not">
        <el-input v-model="note" type="textarea" :rows="2" maxlength="500" :placeholder="notePlaceholder" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="emit('close')">İptal</el-button>
      <el-button type="primary" :disabled="!canSave" @click="save">Kaydet</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* Dört neden iki sütunda, her biri çerçeveli ve büyük: parmakla da fareyle de kolay seçilsin. */
.mark__reasons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  width: 100%;
}

.mark__reasons :deep(.el-radio) {
  margin-right: 0;
}
</style>
