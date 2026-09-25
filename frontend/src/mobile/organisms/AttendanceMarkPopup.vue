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
 * Yoklamada bir kişiye dokununca alttan açılır: iki büyük düğme (Geldi / Gelmedi); gelmediyse nedeni
 * (Hasta · İzinli · Habersiz · Diğer) tek dokunuşla ve isteğe bağlı not. Yalnızca pencerenin listesini
 * değiştirir; kayıt "Yoklamayı Kaydet" ile gider.
 */
const { row } = defineProps<{ row: DraftRow | null }>()
const emit = defineEmits<{ close: []; save: [mark: AttendanceMark] }>()

const came = ref(true)
/** Vant seçim grubu için "seçim yok" boş metindir. */
const choice = ref<AbsenceChoice | ''>('')
const note = ref('')

// Kişi her açıldığında şu anki işaretiyle gelir.
watch(
  () => row,
  (current) => {
    if (!current) return
    came.value = current.mark.status === 'PRESENT'
    choice.value = absenceChoiceOf(current.mark) ?? ''
    note.value = current.mark.note ?? ''
  },
)

/** Gelmedi seçildiyse neden seçilmeden kaydedilmez: "neden gelmedi" sorusu cevapsız kalmasın. */
const canSave = computed(() => came.value || choice.value !== '')
const notePlaceholder = computed(() =>
  choice.value === 'OTHER' && !came.value ? 'Ne oldu? (ör. Doktora gitti)' : 'İsteğe bağlı (ör. Sabah aradı)',
)

function save() {
  if (came.value) emit('save', { ...CAME, note: note.value.trim() || null })
  else if (choice.value) emit('save', absenceMark(choice.value, note.value))
}
</script>

<template>
  <van-popup :show="row !== null" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(open: boolean) => !open && emit('close')">
    <section v-if="row" class="mark">
      <h2 class="mark__title">{{ row.worker.fullName }}</h2>
      <div class="mark__status">
        <van-button round block :type="came ? 'primary' : 'default'" @click="came = true">Geldi</van-button>
        <van-button round block :type="came ? 'default' : 'primary'" @click="came = false">Gelmedi</van-button>
      </div>
      <van-radio-group v-if="!came" v-model="choice">
        <van-cell-group inset title="Gelmediği neden" class="mark__group">
          <van-cell v-for="option in ABSENCE_CHOICES" :key="option.value" :title="option.label" clickable
            @click="choice = option.value">
            <template #right-icon><van-radio :name="option.value" /></template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-cell-group inset class="mark__group">
        <van-field v-model="note" label="Not" type="textarea" rows="2" autosize maxlength="500"
          :placeholder="notePlaceholder" />
      </van-cell-group>
      <van-button type="primary" block round :disabled="!canSave" @click="save">Kaydet</van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.mark {
  display: grid;
  gap: var(--space-4);
  max-height: 86dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.mark__title {
  margin: 0;
  padding-right: var(--space-8);
  font-size: var(--text-lg);
}

/* İki büyük düğme yan yana: eldivenle de doğru olana basılır. */
.mark__status {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

/* Beyaz pencerede beyaz grup kaybolmasın: bölümler hafif zeminli bloklar (kişi paneli gibi). */
.mark__group {
  --van-cell-background: var(--surface-muted);
}
</style>
