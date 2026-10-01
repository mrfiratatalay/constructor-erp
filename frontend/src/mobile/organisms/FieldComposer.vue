<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { showFailToast } from 'vant'
import { Camera, Mic, Plus, SendHorizontal, Trash2, TriangleAlert } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'
import type { Composer } from '@/core/posts/useComposer'
import { useVoiceNote } from '@/core/posts/useVoiceNote'
import AttachmentThumbs from '@/shared/molecules/AttachmentThumbs.vue'

/**
 * Saha güncellemesi, mesaj atmak kadar kolay: yaz ve gönder; 📷 doğrudan kamerayı açar, fotoğraf çubukta küçük
 * kare olarak durur. Eldivenliyken 🎤 basılı tut, konuş, bırak. ＋ menüsünde yalnızca Fotoğraf / Video ve Sorun
 * bildir: sorun, patronun dikkatine ayrıca çıkması gereken tek şeydir; seçilince çubuk sararır.
 */
const { composer } = defineProps<{ composer: Composer }>()
const { body, issue, attachments, isPreparing, canSend } = composer
const menuOpen = ref(false)
const galleryInput = useTemplateRef<HTMLInputElement>('gallery')
const cameraInput = useTemplateRef<HTMLInputElement>('camera')
const voice = useVoiceNote(composer, showFailToast)
const { isRecording, seconds, locked, showMic } = voice
const placeholder = computed(() => (issue.value ? 'Sorun ne?' : 'Bugün şantiyede ne oldu?'))
const MENU = [
  { name: 'Fotoğraf / Video', key: 'media' },
  { name: 'Sorun bildir', key: 'issue', subname: 'Akışta sarı satır olarak öne çıkar' },
]

async function onPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])]
  input.value = ''
  const problems = await composer.addFiles(files)
  if (problems.length) showFailToast(problems.join('\n'))
}

function onMenu(action: { key: string }) {
  menuOpen.value = false
  if (action.key === 'issue') issue.value = true
  else galleryInput.value?.click()
}

async function send() {
  if (canSend.value && !isPreparing.value) await composer.submit()
}
</script>

<template>
  <div class="field-composer" :class="{ 'field-composer--issue': issue }">
    <van-tag v-if="issue" round closeable size="medium" class="field-composer__issue" @close="issue = false">
      <TriangleAlert :size="13" />Sorun
    </van-tag>
    <AttachmentThumbs v-if="attachments.length" :attachments="attachments" @remove="composer.remove" />
    <div class="field-composer__bar">
      <template v-if="isRecording && locked">
        <van-button round class="field-composer__round" aria-label="Kaydı sil" @click="voice.cancel">
          <Trash2 :size="20" />
        </van-button>
        <p class="field-composer__recording">● {{ durationLabel(seconds) }}</p>
        <van-button round type="primary" class="field-composer__round" aria-label="Gönder" @click="voice.send">
          <SendHorizontal :size="20" />
        </van-button>
      </template>
      <template v-else>
        <van-button v-if="!isRecording" round class="field-composer__round" aria-label="Ekle" @click="menuOpen = true">
          <Plus :size="22" />
        </van-button>
        <p v-if="isRecording" class="field-composer__recording">● {{ durationLabel(seconds) }} · kilit için yukarı kaydır</p>
        <van-field v-else v-model="body" type="textarea" rows="1" :autosize="{ maxHeight: 120 }" maxlength="4000"
          :placeholder="placeholder" :border="false" class="field-composer__field" />
        <van-button v-if="!isRecording" round :loading="isPreparing" class="field-composer__round field-composer__plain"
          aria-label="Kamera" @click="cameraInput?.click()">
          <Camera :size="22" />
        </van-button>
        <van-button v-if="showMic" round :type="isRecording ? 'danger' : 'primary'"
          class="field-composer__round field-composer__mic" aria-label="Sesli not için basılı tut" v-bind="voice.handlers">
          <Mic :size="22" />
        </van-button>
        <van-button v-else-if="!isRecording" round type="primary" :disabled="!canSend || isPreparing"
          class="field-composer__round" aria-label="Gönder" @click="send">
          <SendHorizontal :size="20" />
        </van-button>
      </template>
    </div>
    <input ref="gallery" type="file" accept="image/*,video/*" multiple hidden @change="onPicked" />
    <input ref="camera" type="file" accept="image/*" capture="environment" hidden @change="onPicked" />
  </div>
  <van-action-sheet v-model:show="menuOpen" :actions="MENU" cancel-text="Vazgeç" teleport="body" @select="onMenu" />
</template>

<style scoped>
.field-composer {
  display: grid;
  gap: var(--space-2);
  border-radius: var(--radius-lg);
  transition: background 0.2s ease;
}

/* Sorun bildirilirken çubuk hafif sarı: gönderilince akışta da sarı satır olur. */
.field-composer--issue {
  padding: var(--space-2);
  background: var(--field-issue-bg);
  box-shadow: inset 0 0 0 1px var(--field-issue);
}

.field-composer__issue {
  display: inline-flex;
  gap: 4px;
  justify-self: start;
  background: var(--field-issue);
  color: var(--text-strong);
  font-weight: var(--weight-bold);
}

.field-composer__bar {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
}

/* Yuvarlak, eldivenle basılabilecek büyüklükte ikon düğmeleri (sohbetteki çubukla aynı ölçü). */
.field-composer__round {
  flex: none;
  width: 46px;
  padding: 0;
}

.field-composer__plain {
  border: 0;
  background: transparent;
}

/* Basılı tutarken sayfa kaymasın, telefonun seçim menüsü açılmasın. */
.field-composer__mic {
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.field-composer__field,
.field-composer__recording {
  flex: 1;
  min-width: 0;
  min-height: 46px;
  border-radius: 23px;
  background: var(--surface-muted);
}

.field-composer__field {
  --van-cell-background: transparent;
  --van-cell-vertical-padding: 12px;
}

.field-composer__recording {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0 var(--space-4);
  color: var(--status-danger);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  font-variant-numeric: tabular-nums;
}
</style>
