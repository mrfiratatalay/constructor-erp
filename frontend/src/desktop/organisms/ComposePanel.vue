<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { LIMITS } from '@/core/posts/attachments'
import { useComposer } from '@/core/posts/useComposer'
import { useSites } from '@/core/sites/useSites'
import VoiceNoteButton from '@/desktop/molecules/VoiceNoteButton.vue'

const route = useRoute()
const router = useRouter()
const { sites } = useSites()
const composer = useComposer()
const { siteId, body, issue, attachments, isPreparing, canSend } = composer

/** el-upload'un önizlemesi bizim listemizden beslenir; ekleme kararını composer verir.
 *  Kütüphane kimliği sayı bekler: sıra numarasını kullanıp silmede yeniden eşleştiriyoruz. */
const previews = computed<UploadUserFile[]>(() =>
  attachments.value.map((item, index) => ({ name: item.file.name, url: item.previewUrl, uid: index })),
)

function removeAt(uploadFile: UploadFile) {
  const item = attachments.value[Number(uploadFile.uid)]
  if (item) composer.remove(item.id)
}
const preferredSite = () => (typeof route.query.site === 'string' ? route.query.site : null)
watch(sites, (list) => list && !siteId.value && composer.preselect(list, preferredSite()), { immediate: true })

async function add(files: File[]) {
  const problems = await composer.addFiles(files)
  problems.forEach((problem) => ElMessage.warning(problem))
  return false
}

async function send() {
  const target = siteId.value
  await composer.submit(sites.value ?? [])
  ElMessage.success('Gönderi sıraya alındı')
  await router.push({ name: 'siteFeed', params: { siteId: target } })
}
</script>

<template>
  <el-card class="compose-panel" shadow="never">
    <el-form label-position="top" @submit.prevent="send">
      <el-form-item label="Şantiye">
        <el-select v-model="siteId" placeholder="Şantiye seç" size="large" filterable class="compose-panel__wide">
          <el-option v-for="site in sites ?? []" :key="site.id" :label="site.name" :value="site.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="Fotoğraf, video ve sesli not">
        <div class="compose-panel__media">
          <el-upload :file-list="previews" list-type="picture-card" multiple accept="image/*,video/*"
            :limit="LIMITS.attachments" :auto-upload="false"
            :on-change="(uploadFile: UploadFile) => uploadFile.raw && add([uploadFile.raw])" :on-remove="removeAt">
            <span class="compose-panel__plus">+</span>
          </el-upload>
          <VoiceNoteButton @recorded="add([$event])" @failed="ElMessage.error($event)" />
          <span v-if="isPreparing" class="compose-panel__hint">Fotoğraflar hazırlanıyor…</span>
        </div>
      </el-form-item>
      <el-form-item label="Not">
        <el-input v-model="body" type="textarea" :rows="4" maxlength="4000" show-word-limit
          placeholder="Ne yapıldı, ne eksik? (isteğe bağlı)" />
      </el-form-item>
      <el-form-item>
        <el-switch v-model="issue" active-text="Bu bir sorun: patron hemen görür, çözülene kadar açık kalır" />
      </el-form-item>
      <el-button type="primary" size="large" native-type="submit" :disabled="!canSend || isPreparing">
        Gönder{{ attachments.length ? ` · ${attachments.length} dosya` : '' }}
      </el-button>
    </el-form>
  </el-card>
</template>

<style scoped>
.compose-panel {
  max-width: 660px;
}

.compose-panel__wide {
  width: 100%;
}

.compose-panel__media {
  display: grid;
  gap: var(--space-3);
  width: 100%;
}

.compose-panel__plus {
  font-size: var(--text-xl);
  color: var(--text-subtle);
}

.compose-panel__hint {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
