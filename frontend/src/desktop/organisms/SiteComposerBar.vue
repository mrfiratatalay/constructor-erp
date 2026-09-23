<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { Camera, Mic, SendHorizontal } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'
import { useComposer, type ComposeTarget } from '@/core/posts/useComposer'
import { useVoiceRecorder } from '@/core/posts/useVoiceRecorder'
import PhotoSendDialog from '@/desktop/organisms/PhotoSendDialog.vue'

/**
 * Şantiye panelinin altındaki gönderme çubuğu, mobildekiyle aynı (TASARIM.md İlke 7): 📷 → önizleme;
 * yazı doğrudan çubuğa (Enter gönderir, Shift+Enter yeni satır, WhatsApp Masaüstü gibi); 🎤 basılı tut,
 * bırakınca gider. Yazı varken 🎤 yerine ➤ çıkar.
 */
const { site } = defineProps<{ site: ComposeTarget }>()
const composer = useComposer(() => site)
const { body } = composer
const dialogOpen = ref(false)
const recorder = useVoiceRecorder((file) => void sendVoice(file))
const { isRecording, seconds } = recorder
const hasText = computed(() => body.value.trim() !== '')
const showMic = computed(() => !hasText.value && recorder.isSupported)

async function addFiles(files: File[]) {
  const problems = await composer.addFiles(files)
  problems.forEach((problem) => ElMessage.warning(problem))
}

function pickFile(uploadFile: UploadFile) {
  if (!uploadFile.raw) return
  dialogOpen.value = true
  void addFiles([uploadFile.raw])
}

async function send() {
  if (hasText.value) await composer.submit()
}

/** Mikrofon yalnızca yazı yokken görünür: sesli not tek hareketle gider. */
async function sendVoice(file: File) {
  await addFiles([file])
  await composer.submit()
}

async function startRecording() {
  try {
    await recorder.start()
  } catch {
    ElMessage.error('Mikrofona izin verilmedi. Tarayıcı ayarlarından mikrofon iznini aç.')
  }
}
</script>

<template>
  <div class="composer-bar">
    <div class="composer-bar__row">
      <el-upload :auto-upload="false" :show-file-list="false" multiple accept="image/*,video/*" :on-change="pickFile">
        <el-button circle size="large" aria-label="Fotoğraf ya da video ekle"><Camera :size="20" /></el-button>
      </el-upload>
      <p v-if="isRecording" class="composer-bar__recording">● {{ durationLabel(seconds) }} · bırakınca gider</p>
      <el-input v-else v-model="body" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" resize="none"
        maxlength="4000" placeholder="Bir not yaz…" class="composer-bar__input"
        @keydown.enter.exact.prevent="send" />
      <el-button v-if="showMic" circle size="large" :type="isRecording ? 'danger' : 'primary'"
        class="composer-bar__mic" aria-label="Sesli not için basılı tut"
        @mousedown.prevent="startRecording" @mouseup="recorder.stop" @mouseleave="recorder.stop">
        <Mic :size="20" />
      </el-button>
      <el-button v-else circle size="large" type="primary" :disabled="!hasText"
        aria-label="Gönder" @click="send">
        <SendHorizontal :size="18" />
      </el-button>
    </div>
  </div>
  <PhotoSendDialog v-model:open="dialogOpen" :composer="composer" :site-name="site.name" @add-files="addFiles" />
</template>

<style scoped>
.composer-bar {
  display: grid;
  gap: var(--space-2);
}

.composer-bar__row {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
}

.composer-bar__input {
  flex: 1;
}

.composer-bar__input :deep(.el-textarea__inner) {
  padding: 10px 16px;
  border-radius: 20px;
  background: var(--surface-muted);
  box-shadow: none;
}

.composer-bar__recording {
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 40px;
  margin: 0;
  padding: 0 var(--space-4);
  border-radius: 20px;
  background: var(--surface-muted);
  color: var(--status-danger);
  font-weight: var(--weight-semibold);
  font-variant-numeric: tabular-nums;
}

.composer-bar__mic {
  user-select: none;
}
</style>
