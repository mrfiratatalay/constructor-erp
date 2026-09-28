<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera, X } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { taskName } from '@/core/tasks/taskIcon'
import { MAX_DELIVERY_PHOTOS, useDeliveryPhotos } from '@/core/tasks/useDeliveryPhotos'
import { useTaskDelivery } from '@/core/tasks/useTaskDelivery'
import StatusTag from '@/desktop/atoms/StatusTag.vue'

/**
 * "✅ İş Teslim Et" (sohbetin ＋'sından ya da eksik dönen işin kartından): işi seç → fotoğraf ekle → İŞİ TESLİM
 * ET. Uzun yazı yok. Yeniden teslimde iş seçili gelir; kişinin tek açık işi varsa o da seçili gelir.
 */
const { siteId, taskId = null } = defineProps<{ siteId: string; taskId?: string | null }>()
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ delivered: [postId: string] }>()
const { tasks, isLoading, deliver, isDelivering } = useTaskDelivery(() => siteId)
const { photos, isPreparing, add, remove, clear, files } = useDeliveryPhotos()
// Element Plus'ın seçim kutusu seçilmemişi undefined olarak bekler.
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
  problems.forEach((problem) => ElMessage.warning(problem))
}

async function submit() {
  if (!chosen.value) return
  try {
    const delivery = await deliver(chosen.value, files.value)
    ElMessage.success('İş teslim edildi. Şef kontrol edecek.')
    show.value = false
    emit('delivered', delivery.postId)
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="show" title="✅ İş Teslim Et" width="520px" append-to-body>
    <el-skeleton v-if="isLoading" :rows="3" animated />
    <el-empty v-else-if="!tasks.length" :image-size="64"
      description="Sana verilmiş açık iş yok. Görevler şantiye bilgisindeki Görevler'de." />
    <el-space v-else direction="vertical" fill :size="16" class="deliver">
      <el-text tag="b">1. Hangi iş?</el-text>
      <el-radio-group v-model="chosen" class="deliver__tasks">
        <el-radio v-for="task in tasks" :key="task.id" :value="task.id" border size="large">
          {{ taskName(task.title) }}
          <StatusTag v-if="task.status === 'RETURNED'" tone="danger">Eksik var</StatusTag>
        </el-radio>
      </el-radio-group>
      <el-text tag="b">2. 📷 İşin fotoğrafı</el-text>
      <el-space wrap :size="8">
        <span v-for="photo in photos" :key="photo.id" class="deliver__thumb">
          <el-image :src="photo.previewUrl" fit="cover" class="deliver__photo" />
          <el-button circle size="small" class="deliver__remove" aria-label="Fotoğrafı çıkar" @click="remove(photo.id)">
            <X :size="14" />
          </el-button>
        </span>
        <el-button v-if="photos.length < MAX_DELIVERY_PHOTOS" size="large" :loading="isPreparing"
          @click="picker?.click()">
          <Camera :size="18" />&nbsp;Fotoğraf ekle
        </el-button>
      </el-space>
      <input ref="picker" type="file" accept="image/*" multiple hidden aria-label="İşin fotoğrafı"
        @change="onPicked" />
    </el-space>
    <template #footer>
      <el-button type="success" size="large" class="deliver__submit" :disabled="!canDeliver" :loading="isDelivering"
        @click="submit">
        ✅ İŞİ TESLİM ET
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.deliver__tasks {
  display: grid;
  gap: var(--space-2);
}

.deliver__tasks .el-radio {
  margin: 0;
}

.deliver__thumb {
  position: relative;
  display: inline-flex;
}

.deliver__photo {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-md);
}

.deliver__remove {
  position: absolute;
  top: -8px;
  right: -8px;
}

.deliver__submit {
  width: 100%;
}
</style>
