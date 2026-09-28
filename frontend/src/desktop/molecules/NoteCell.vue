<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DayMarkView } from '@/core/api/generated/model'

/**
 * Bugünün notu, satırın içinde gerçek bir yazı kutusu: şef doğrudan yazar, Enter'a basınca ya da kutudan çıkınca
 * kaydedilir. Boş not sütunu böylece boşluk değil, yazılacak yer olur. İşaretsiz güne not yazılmaz: hücre boştur.
 */
const { mark = undefined, disabled = false } = defineProps<{ mark?: DayMarkView; disabled?: boolean }>()
const emit = defineEmits<{ change: [note: string] }>()
const draft = ref(mark?.note ?? '')
watch(
  () => mark?.note,
  (note) => (draft.value = note ?? ''),
)
</script>

<template>
  <el-input v-if="mark" v-model="draft" placeholder="Not ekle…" maxlength="200" clearable aria-label="Bugünün notu"
    :disabled="disabled" @change="emit('change', draft)" />
</template>
