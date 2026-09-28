<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ReturnDeliveryRequest, TaskDeliveryView } from '@/core/api/generated/model'
import { taskName } from '@/core/tasks/taskIcon'
import MarkablePhoto, { type PhotoPoint } from '@/shared/molecules/MarkablePhoto.vue'

/**
 * Şefin incelemesi: fotoğraflar büyük, altta yalnızca iki düğme: ✅ ONAYLA ve ❌ EKSİK VAR. Eksik varsa aynı
 * pencerede "Neresi eksik?": fotoğraf seçilir, üstüne dokunup nokta konur (isteğe bağlı), kısa not yazılır, GÖNDER.
 * Fotoğraf sunucuda işlenirken adresi henüz yoktur: "hazırlanıyor" yazar.
 */
const { delivery, busy = false } = defineProps<{ delivery: TaskDeliveryView; busy?: boolean }>()
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ approve: []; sendBack: [request: ReturnDeliveryRequest] }>()
const step = ref<'look' | 'missing'>('look')
const photoIndex = ref(0)
const mark = ref<PhotoPoint | null>(null)
const note = ref('')
const photo = computed(() => delivery.photos[photoIndex.value])
const urls = computed(() => delivery.photos.map((item) => item.url).filter((url): url is string => !!url))

watch(show, (open) => {
  if (!open) return
  step.value = 'look'
  photoIndex.value = 0
  mark.value = null
  note.value = ''
})

/** Nokta seçili fotoğrafa aittir: fotoğraf değişince kalkar. */
function choosePhoto(index: number) {
  photoIndex.value = index
  mark.value = null
}

function send() {
  const point = mark.value && photo.value ? { mediaId: photo.value.id, ...mark.value } : undefined
  emit('sendBack', { note: note.value.trim(), mark: point })
}
</script>

<template>
  <el-dialog v-model="show" :title="taskName(delivery.taskTitle)" width="640px" append-to-body>
    <el-text type="info">👤 {{ delivery.deliveredBy.fullName }} · 📍 {{ delivery.siteName }}</el-text>
    <el-space v-if="step === 'look'" wrap :size="12" class="review__photos">
      <el-image v-for="(item, index) in delivery.photos" :key="item.id" :src="item.url ?? ''" fit="cover"
        :preview-src-list="urls" :initial-index="index" preview-teleported class="review__photo">
        <template #error><el-text type="info">Fotoğraf hazırlanıyor…</el-text></template>
      </el-image>
    </el-space>
    <el-space v-else direction="vertical" fill :size="12" class="review__missing">
      <el-text tag="b">Neresi eksik? Fotoğrafın üstüne dokun, noktayı koy.</el-text>
      <el-radio-group v-if="delivery.photos.length > 1" :model-value="photoIndex" @change="choosePhoto(Number($event))">
        <el-radio-button v-for="(item, index) in delivery.photos" :key="item.id" :value="index">
          {{ index + 1 }}. fotoğraf
        </el-radio-button>
      </el-radio-group>
      <MarkablePhoto v-if="photo?.url" v-model:mark="mark" :src="photo.url" editable />
      <el-input v-model="note" maxlength="300" show-word-limit placeholder="Kısa not: Buradaki kablo eksik"
        aria-label="Eksik notu" />
    </el-space>
    <template #footer>
      <template v-if="step === 'look'">
        <el-button type="danger" size="large" @click="step = 'missing'">❌ EKSİK VAR</el-button>
        <el-button type="success" size="large" :loading="busy" @click="emit('approve')">✅ ONAYLA</el-button>
      </template>
      <template v-else>
        <el-button size="large" @click="step = 'look'">Geri</el-button>
        <el-button type="danger" size="large" :disabled="!note.trim()" :loading="busy" @click="send">GÖNDER</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<style scoped>
.review__photos,
.review__missing {
  width: 100%;
  margin-top: var(--space-3);
}

.review__photo {
  width: 280px;
  height: 210px;
  border-radius: var(--radius-md);
  cursor: zoom-in;
}
</style>
