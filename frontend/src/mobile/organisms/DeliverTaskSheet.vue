<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { Camera } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { taskName } from '@/core/tasks/taskIcon'
import { MAX_DELIVERY_PHOTOS, useDeliveryPhotos } from '@/core/tasks/useDeliveryPhotos'
import { useTaskDelivery } from '@/core/tasks/useTaskDelivery'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

/**
 * "✅ İş Teslim Et", alttan (sohbetin ＋'sından ya da eksik dönen işin kartından): işi seç → fotoğraf çek → İŞİ
 * TESLİM ET. Büyük dokunma alanları, yazı yok. Yeniden teslimde iş seçili gelir; tek açık iş varsa o da seçili gelir.
 */
const { siteId, taskId = null } = defineProps<{ siteId: string; taskId?: string | null }>()
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ delivered: [postId: string] }>()
const { tasks, isLoading, deliver, isDelivering } = useTaskDelivery(() => siteId)
const { photos, isPreparing, add, remove, clear, files } = useDeliveryPhotos()
const chosen = ref<string | undefined>(undefined)
const picker = useTemplateRef<HTMLInputElement>('picker')
const canDeliver = computed(() => !!chosen.value && photos.value.length > 0 && !isPreparing.value)

watch([show, tasks], () => {
  if (!show.value || chosen.value) return
  chosen.value = taskId ?? (tasks.value.length === 1 ? tasks.value[0]!.id : undefined)
})
watch(show, (open) => {
  if (open) return
  chosen.value = undefined
  clear()
})

async function onPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const picked = [...(input.files ?? [])]
  input.value = ''
  const problems = await add(picked)
  if (problems.length) showFailToast(problems.join('\n'))
}

async function submit() {
  if (!chosen.value) return
  try {
    const delivery = await deliver(chosen.value, files.value)
    showSuccessToast('İş teslim edildi')
    show.value = false
    emit('delivered', delivery.postId)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" :style="{ maxHeight: '90%' }">
    <van-cell-group title="✅ İş Teslim Et" :border="false">
      <van-skeleton v-if="isLoading" :row="3" />
      <van-empty v-else-if="!tasks.length" image-size="72"
        description="Sana verilmiş açık iş yok. Görevler şantiye bilgisindeki Görevler'de." />
    </van-cell-group>
    <template v-if="tasks.length">
      <van-radio-group v-model="chosen">
        <van-cell-group inset title="1. Hangi iş?">
          <van-cell v-for="task in tasks" :key="task.id" :title="taskName(task.title)" size="large" clickable
            center @click="chosen = task.id">
            <template #label>
              <StatusTag v-if="task.status === 'RETURNED'" tone="danger">Eksik var</StatusTag>
            </template>
            <template #right-icon><van-radio :name="task.id" /></template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-cell-group inset title="2. 📷 İşin fotoğrafı">
        <van-cell>
          <van-space wrap :size="8">
            <span v-for="photo in photos" :key="photo.id" class="deliver-sheet__thumb">
              <van-image :src="photo.previewUrl" width="80" height="80" fit="cover" radius="8" />
              <van-icon name="clear" class="deliver-sheet__remove" aria-label="Fotoğrafı çıkar"
                @click="remove(photo.id)" />
            </span>
            <van-button v-if="photos.length < MAX_DELIVERY_PHOTOS" size="large" :loading="isPreparing"
              @click="picker?.click()">
              <Camera :size="20" />&nbsp;Fotoğraf çek
            </van-button>
          </van-space>
        </van-cell>
      </van-cell-group>
      <input ref="picker" type="file" accept="image/*" multiple hidden aria-label="İşin fotoğrafı"
        @change="onPicked" />
      <div class="deliver-sheet__submit">
        <van-button type="success" size="large" block round :disabled="!canDeliver" :loading="isDelivering"
          @click="submit">
          ✅ İŞİ TESLİM ET
        </van-button>
      </div>
    </template>
  </van-popup>
</template>

<style scoped>
.deliver-sheet__thumb {
  position: relative;
  display: inline-flex;
}

/* Çarpı fotoğrafın köşesinde: fotoğrafa dokunmak onu silmez, yalnızca çarpıya dokunmak siler. */
.deliver-sheet__remove {
  position: absolute;
  top: -8px;
  right: -8px;
  border-radius: 50%;
  background: var(--surface);
  color: var(--status-danger);
  font-size: 22px;
}

.deliver-sheet__submit {
  padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
}
</style>
