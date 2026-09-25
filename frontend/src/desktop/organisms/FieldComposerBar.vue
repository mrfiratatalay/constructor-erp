<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { ElMessage } from 'element-plus'
import { ImagePlus, Mic, Plus, SendHorizontal, Trash2, TriangleAlert } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'
import type { Composer } from '@/core/posts/useComposer'
import { useVoiceNote } from '@/core/posts/useVoiceNote'
import AttachmentThumbs from '@/shared/molecules/AttachmentThumbs.vue'

/**
 * Saha güncellemesi, mesaj atmak kadar kolay: yaz ve gönder; fotoğrafı 🖼 ile ekle, çubukta küçük kareler olarak
 * durur. Tür, etiket, ikinci açıklama yok. ＋ menüsünde yalnızca Fotoğraf / Video ve Sorun bildir: sorun, patronun
 * dikkatine ayrıca çıkması gereken tek şeydir; seçilince çubuk sararır. Enter gönderir, Shift+Enter yeni satır.
 */
const { composer } = defineProps<{ composer: Composer }>()
const { body, issue, attachments, isPreparing, canSend } = composer
const galleryInput = useTemplateRef<HTMLInputElement>('gallery')
const voice = useVoiceNote(composer, (problem) => ElMessage.error(problem))
const { isRecording, seconds, locked, showMic } = voice
const placeholder = computed(() => (issue.value ? 'Sorun ne?' : 'Bugün şantiyede ne oldu?'))

async function onPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])]
  input.value = ''
  const problems = await composer.addFiles(files)
  problems.forEach((problem) => ElMessage.warning(problem))
}

function onMenu(command: 'media' | 'issue') {
  if (command === 'issue') issue.value = true
  else galleryInput.value?.click()
}

async function send() {
  if (canSend.value && !isPreparing.value) await composer.submit()
}
</script>

<template>
  <div class="field-composer" :class="{ 'field-composer--issue': issue }">
    <el-tag v-if="issue" type="warning" effect="dark" closable round class="field-composer__issue"
      @close="issue = false">
      <span class="field-composer__issue-text"><TriangleAlert :size="13" />Sorun</span>
    </el-tag>
    <AttachmentThumbs v-if="attachments.length" :attachments="attachments" @remove="composer.remove" />
    <div class="field-composer__row">
      <el-button v-if="isRecording && locked" circle size="large" aria-label="Kaydı sil" @click="voice.cancel">
        <Trash2 :size="18" />
      </el-button>
      <el-dropdown v-else trigger="click" placement="top-start" @command="onMenu">
        <el-button circle size="large" aria-label="Ekle"><Plus :size="20" /></el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="media" :icon="ImagePlus">Fotoğraf / Video</el-dropdown-item>
            <el-dropdown-item command="issue" :icon="TriangleAlert" :disabled="issue" class="field-composer__issue-item">
              Sorun bildir
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <p v-if="isRecording" class="field-composer__recording">
        ● {{ durationLabel(seconds) }}<span v-if="!locked"> · kilit için yukarı kaydır, bırakınca gider</span>
      </p>
      <el-input v-else v-model="body" type="textarea" :autosize="{ minRows: 1, maxRows: 6 }" resize="none"
        maxlength="4000" :placeholder="placeholder" class="field-composer__input"
        @keydown.enter.exact.prevent="send" />
      <el-button v-if="!isRecording" text circle size="large" aria-label="Fotoğraf ya da video ekle"
        :loading="isPreparing" @click="galleryInput?.click()">
        <ImagePlus v-if="!isPreparing" :size="20" />
      </el-button>
      <el-button v-if="isRecording && locked" circle size="large" type="primary" aria-label="Gönder" @click="voice.send">
        <SendHorizontal :size="18" />
      </el-button>
      <el-button v-else-if="showMic" circle size="large" :type="isRecording ? 'danger' : 'primary'"
        class="field-composer__mic" aria-label="Sesli not için basılı tut" v-bind="voice.handlers">
        <Mic :size="20" />
      </el-button>
      <el-button v-else circle size="large" type="primary" :disabled="!canSend || isPreparing" aria-label="Gönder"
        @click="send">
        <SendHorizontal :size="18" />
      </el-button>
    </div>
    <input ref="gallery" type="file" accept="image/*,video/*" multiple hidden @change="onPicked" />
  </div>
</template>

<style scoped>
.field-composer {
  display: grid;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-xl);
  background: var(--surface-muted);
  transition: background 0.2s ease;
}

/* Sorun bildirilirken çubuk hafif sarı: gönderilince akışta da sarı satır olur. */
.field-composer--issue {
  background: var(--field-issue-bg);
  box-shadow: inset 0 0 0 1px var(--field-issue);
}

.field-composer__issue {
  justify-self: start;
  --el-tag-bg-color: var(--field-issue);
  --el-tag-border-color: var(--field-issue);
  --el-tag-text-color: var(--text-strong);
  font-weight: var(--weight-bold);
}

.field-composer__issue-text {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* Menüde yalnızca "Sorun bildir"in ⚠'i sarıdır: sarı, dikkat gereken tek şeyin rengi. */
.field-composer__issue-item :deep(.el-icon) {
  color: var(--field-issue);
}

.field-composer__row {
  display: flex;
  align-items: flex-end;
  gap: var(--space-1);
}

.field-composer__input {
  flex: 1;
}

.field-composer__input :deep(.el-textarea__inner) {
  padding: 10px 8px;
  background: transparent;
  box-shadow: none;
}

.field-composer__recording {
  display: flex;
  flex: 1;
  align-items: center;
  min-height: 46px;
  margin: 0;
  padding: 0 var(--space-3);
  color: var(--status-danger);
  font-weight: var(--weight-semibold);
  font-variant-numeric: tabular-nums;
}

.field-composer__recording span {
  color: var(--text-muted);
  font-weight: var(--weight-regular);
}

.field-composer__mic {
  touch-action: none;
  user-select: none;
}
</style>
