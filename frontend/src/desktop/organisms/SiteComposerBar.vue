<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import { Mic, Plus, SendHorizontal, Trash2 } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'
import { quoteOf } from '@/core/posts/postPreview'
import type { Composer } from '@/core/posts/useComposer'
import { useVoiceNote } from '@/core/posts/useVoiceNote'
import EmojiPicker from '@/desktop/molecules/EmojiPicker.vue'
import PhotoSendDialog from '@/desktop/organisms/PhotoSendDialog.vue'
import QuoteStrip from '@/shared/molecules/QuoteStrip.vue'

/**
 * Gönderme çubuğu, WhatsApp Masaüstü gibi: ＋ (fotoğraf-video, belge ya da yoklama), yazı ve 😊, 🎤 basılı tut
 * (yukarı kaydırınca kilitlenir). Enter gönderir, Shift+Enter yeni satır. Yazı varken 🎤 yerine ➤.
 * Yoklama bir ek değildir, sohbete mesaj göndermez: yalnızca yoklama penceresini ister (attendance).
 * Yanıtlanan mesaj çubuğun üstünde alıntı olarak durur.
 */
const { composer, siteName } = defineProps<{ composer: Composer; siteName: string }>()
const emit = defineEmits<{ attendance: [] }>()
const { body, replyTo } = composer
const dialogOpen = ref(false)
const galleryInput = useTemplateRef<HTMLInputElement>('gallery')
const pdfInput = useTemplateRef<HTMLInputElement>('pdf')
const voice = useVoiceNote(composer, (problem) => ElMessage.error(problem))
const { isRecording, seconds, locked, showMic } = voice
const hasText = computed(() => body.value.trim() !== '')
const quote = computed(() => (replyTo.value ? quoteOf(replyTo.value) : null))

async function addFiles(files: File[]) {
  const problems = await composer.addFiles(files)
  problems.forEach((problem) => ElMessage.warning(problem))
}

async function onPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])]
  input.value = ''
  if (!files.length) return
  dialogOpen.value = true
  await addFiles(files)
}

function onAdd(which: string) {
  if (which === 'attendance') emit('attendance')
  else (which === 'pdf' ? pdfInput : galleryInput).value?.click()
}

async function send() {
  if (hasText.value) await composer.submit()
}
</script>

<template>
  <div class="composer-bar">
    <QuoteStrip v-if="quote" :quote="quote" closable @close="replyTo = null" />
    <div class="composer-bar__row">
      <el-button v-if="isRecording && locked" circle size="large" aria-label="Kaydı sil" @click="voice.cancel">
        <Trash2 :size="18" />
      </el-button>
      <el-dropdown v-else trigger="click" placement="top-start" @command="onAdd">
        <el-button circle size="large" aria-label="Ekle"><Plus :size="20" /></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="gallery">Fotoğraf ve video</el-dropdown-item>
            <el-dropdown-item command="pdf">Belge (PDF)</el-dropdown-item>
            <el-dropdown-item command="attendance" divided>Yoklama</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <p v-if="isRecording" class="composer-bar__recording">
        ● {{ durationLabel(seconds) }}<span v-if="!locked"> · kilit için yukarı kaydır, bırakınca gider</span>
      </p>
      <div v-else class="composer-bar__input">
        <el-input v-model="body" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" resize="none"
          maxlength="4000" placeholder="Bir not yaz…" @keydown.enter.exact.prevent="send" />
        <span class="composer-bar__emoji"><EmojiPicker @pick="body += $event" /></span>
      </div>
      <el-button v-if="isRecording && locked" circle size="large" type="primary" aria-label="Gönder" @click="voice.send">
        <SendHorizontal :size="18" />
      </el-button>
      <el-button v-else-if="showMic" circle size="large" :type="isRecording ? 'danger' : 'primary'"
        class="composer-bar__mic" aria-label="Sesli not için basılı tut" v-bind="voice.handlers">
        <Mic :size="20" />
      </el-button>
      <el-button v-else circle size="large" type="primary" :disabled="!hasText" aria-label="Gönder" @click="send">
        <SendHorizontal :size="18" />
      </el-button>
    </div>
    <input ref="gallery" type="file" accept="image/*,video/*" multiple hidden @change="onPicked" />
    <input ref="pdf" type="file" accept="application/pdf" multiple hidden @change="onPicked" />
  </div>
  <PhotoSendDialog v-model:open="dialogOpen" :composer="composer" :site-name="siteName" @add-files="addFiles" />
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
  position: relative;
  flex: 1;
}

.composer-bar__input :deep(.el-textarea__inner) {
  padding: 10px 44px 10px 16px;
  border-radius: 20px;
  background: var(--surface-muted);
  box-shadow: none;
}

/* 😊 yazı kutusunun içinde, sağda (WhatsApp Masaüstü gibi); açılır pencere sınıfı düğmeye geçirmediği için sarılı. */
.composer-bar__emoji {
  position: absolute;
  right: 12px;
  bottom: 9px;
  display: flex;
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

.composer-bar__recording span {
  color: var(--text-muted);
  font-weight: var(--weight-regular);
}

.composer-bar__mic {
  touch-action: none;
  user-select: none;
}
</style>
