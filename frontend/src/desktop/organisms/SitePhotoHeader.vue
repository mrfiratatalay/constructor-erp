<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import { Camera } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useSitePhoto } from '@/core/sites/useSitePhoto'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'

/**
 * Bilgi panelinin en üstündeki büyük şantiye fotoğrafı (WhatsApp'taki grup fotoğrafı). Tıklayınca tam ekran;
 * patron altındaki menüyle değiştirir ya da kaldırır.
 */
const { site, canEdit } = defineProps<{ site: SiteView; canEdit: boolean }>()
const { changePhoto, clearPhoto, isSaving } = useSitePhoto(() => site.id)
const input = useTemplateRef<HTMLInputElement>('input')
const viewing = ref(false)

async function attempt(work: () => Promise<unknown>) {
  await work().catch((error) => ElMessage.error(errorMessage(error)))
}

function onPicked(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (file) void attempt(() => changePhoto(file))
}

function onCommand(command: 'change' | 'clear') {
  if (command === 'change') input.value?.click()
  else void attempt(clearPhoto)
}
</script>

<template>
  <div class="photo-header">
    <button type="button" class="photo-header__photo" aria-label="Şantiye fotoğrafı"
      @click="site.photoUrl ? (viewing = true) : canEdit && input?.click()">
      <SiteAvatar :photo-url="site.photoThumbnailUrl" :size="120" />
    </button>
    <el-dropdown v-if="canEdit" trigger="click" @command="onCommand">
      <el-button size="small" :loading="isSaving"><Camera :size="14" class="photo-header__icon" />Fotoğraf</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="change">Fotoğrafı değiştir</el-dropdown-item>
          <el-dropdown-item v-if="site.photoUrl" command="clear" class="photo-header__danger">Fotoğrafı kaldır</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <input ref="input" type="file" accept="image/*" hidden @change="onPicked" />
    <el-image-viewer v-if="viewing && site.photoUrl" :url-list="[site.photoUrl]" teleported @close="viewing = false" />
  </div>
</template>

<style scoped>
.photo-header {
  display: grid;
  gap: var(--space-2);
  justify-items: center;
}

.photo-header__photo {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.photo-header__icon {
  margin-right: 6px;
}

.photo-header__danger {
  color: var(--status-danger);
}
</style>
