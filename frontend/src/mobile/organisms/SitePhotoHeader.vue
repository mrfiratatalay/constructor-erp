<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { showFailToast, showImagePreview } from 'vant'
import { Camera } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { SiteView } from '@/core/api/generated/model'
import { useSitePhoto } from '@/core/sites/useSitePhoto'
import SiteAvatar from '@/shared/atoms/SiteAvatar.vue'

/**
 * Bilgi ekranının en üstündeki büyük şantiye fotoğrafı (WhatsApp'taki grup fotoğrafı). Dokununca tam ekran;
 * patron altındaki düğmeyle değiştirir ya da kaldırır.
 */
const { site, canEdit } = defineProps<{ site: SiteView; canEdit: boolean }>()
const { changePhoto, clearPhoto, isSaving } = useSitePhoto(() => site.id)
const input = useTemplateRef<HTMLInputElement>('input')
const menuOpen = ref(false)
const menu = computed(() => [
  { name: 'Fotoğrafı değiştir', key: 'change' },
  ...(site.photoUrl ? [{ name: 'Fotoğrafı kaldır', key: 'clear', color: 'var(--status-danger)' }] : []),
])

async function attempt(work: () => Promise<unknown>) {
  await work().catch((error) => showFailToast(errorMessage(error)))
}

function onPicked(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  target.value = ''
  if (file) void attempt(() => changePhoto(file))
}

function onMenu(action: { key: string }) {
  menuOpen.value = false
  if (action.key === 'change') input.value?.click()
  else void attempt(clearPhoto)
}

function openPhoto() {
  if (site.photoUrl) showImagePreview({ images: [site.photoUrl], closeable: true })
  else if (canEdit) menuOpen.value = true
}
</script>

<template>
  <div class="photo-header">
    <button type="button" class="photo-header__photo" aria-label="Şantiye fotoğrafı" @click="openPhoto">
      <SiteAvatar :photo-url="site.photoThumbnailUrl" :size="112" />
    </button>
    <van-button v-if="canEdit" size="small" round plain type="primary" :loading="isSaving" @click="menuOpen = true">
      <Camera :size="14" class="photo-header__icon" />Fotoğraf
    </van-button>
    <input ref="input" type="file" accept="image/*" hidden @change="onPicked" />
    <van-action-sheet v-model:show="menuOpen" :actions="menu" cancel-text="Vazgeç" teleport="body" @select="onMenu" />
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
}

.photo-header__icon {
  margin-right: 4px;
  vertical-align: -2px;
}
</style>
