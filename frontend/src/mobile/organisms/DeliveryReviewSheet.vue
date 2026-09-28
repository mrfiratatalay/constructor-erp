<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showImagePreview } from 'vant'
import type { ReturnDeliveryRequest, TaskDeliveryView } from '@/core/api/generated/model'
import { taskName } from '@/core/tasks/taskIcon'
import MarkablePhoto, { type PhotoPoint } from '@/shared/molecules/MarkablePhoto.vue'

/**
 * Şefin incelemesi, alttan: fotoğraflar (dokununca tam ekran), altta yalnızca iki büyük düğme: ✅ ONAYLA ve
 * ❌ EKSİK VAR. Eksik varsa aynı sayfada "Neresi eksik?": fotoğraf seçilir, üstüne dokunup nokta konur (isteğe
 * bağlı), kısa not yazılır, GÖNDER. Fotoğraf sunucuda işlenirken henüz görünmez: "hazırlanıyor" yazar.
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
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" :style="{ maxHeight: '92%' }">
    <van-cell-group :title="taskName(delivery.taskTitle)" :border="false">
      <van-cell :title="`👤 ${delivery.deliveredBy.fullName}`" :label="`📍 ${delivery.siteName}`" />
    </van-cell-group>
    <van-cell-group v-if="step === 'look'" inset>
      <van-cell>
        <van-space wrap :size="8">
          <van-image v-for="(item, index) in delivery.photos" :key="item.id" :src="item.url ?? ''" width="150"
            height="112" fit="cover" radius="8" @click="showImagePreview({ images: urls, startPosition: index })">
            <template #error>Hazırlanıyor…</template>
          </van-image>
        </van-space>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else inset title="Neresi eksik? Fotoğrafın üstüne dokun, noktayı koy.">
      <van-cell v-if="delivery.photos.length > 1">
        <van-radio-group :model-value="photoIndex" direction="horizontal" @change="choosePhoto(Number($event))">
          <van-radio v-for="(item, index) in delivery.photos" :key="item.id" :name="index">
            {{ index + 1 }}. fotoğraf
          </van-radio>
        </van-radio-group>
      </van-cell>
      <van-cell>
        <MarkablePhoto v-if="photo?.url" v-model:mark="mark" :src="photo.url" editable />
      </van-cell>
      <van-field v-model="note" label="Not" maxlength="300" show-word-limit
        placeholder="Kısa not: Buradaki kablo eksik" />
    </van-cell-group>
    <van-space direction="vertical" fill :size="12" class="review-sheet__actions">
      <template v-if="step === 'look'">
        <van-button type="success" size="large" block round :loading="busy" @click="emit('approve')">
          ✅ ONAYLA
        </van-button>
        <van-button type="danger" size="large" block round plain @click="step = 'missing'">❌ EKSİK VAR</van-button>
      </template>
      <template v-else>
        <van-button type="danger" size="large" block round :disabled="!note.trim()" :loading="busy" @click="send">
          GÖNDER
        </van-button>
        <van-button size="large" block round @click="step = 'look'">Geri</van-button>
      </template>
    </van-space>
  </van-popup>
</template>

<style scoped>
.review-sheet__actions {
  padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
}
</style>
