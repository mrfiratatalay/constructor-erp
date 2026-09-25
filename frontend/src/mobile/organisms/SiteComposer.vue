<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { showFailToast } from 'vant'
import { Camera, Lock, Mic, Plus, SendHorizontal, Trash2 } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'
import { quoteOf } from '@/core/posts/postPreview'
import type { Composer } from '@/core/posts/useComposer'
import { useVoiceNote } from '@/core/posts/useVoiceNote'
import PhotoSendSheet from '@/mobile/organisms/PhotoSendSheet.vue'
import QuoteStrip from '@/shared/molecules/QuoteStrip.vue'

/**
 * Gönderme çubuğu, iPhone'daki WhatsApp gibi: ＋ (fotoğraf-video ya da belge), yazı, 📷 (doğrudan kamera),
 * 🎤 basılı tut. 🎤'dan yukarı kaydırınca kayıt kilitlenir; sonra 🗑 ya da ➤. Yazı varken 📷 ve 🎤 yerine ➤.
 * Yanıtlanan mesaj çubuğun üstünde alıntı olarak durur.
 */
const { composer, siteName } = defineProps<{ composer: Composer; siteName: string }>()
const { body, replyTo } = composer
const sheetOpen = ref(false)
const menuOpen = ref(false)
const galleryInput = useTemplateRef<HTMLInputElement>('gallery')
const pdfInput = useTemplateRef<HTMLInputElement>('pdf')
const cameraInput = useTemplateRef<HTMLInputElement>('camera')
const voice = useVoiceNote(composer, showFailToast)
const { isRecording, seconds, locked, showMic } = voice
const hasText = computed(() => body.value.trim() !== '')
const quote = computed(() => (replyTo.value ? quoteOf(replyTo.value) : null))
const MENU = [{ name: 'Fotoğraf ve video', key: 'gallery' }, { name: 'Belge (PDF)', key: 'pdf' }]

async function addFiles(files: File[]) {
  const problems = await composer.addFiles(files)
  if (problems.length) showFailToast(problems.join('\n'))
}

/** Seçilen dosyalar önizlemeye gider (WhatsApp gibi); açıklama orada yazılır. */
async function onPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const files = [...(input.files ?? [])]
  input.value = ''
  if (!files.length) return
  sheetOpen.value = true
  await addFiles(files)
}

function onMenu(action: { key: string }) {
  menuOpen.value = false
  ;(action.key === 'gallery' ? galleryInput : pdfInput).value?.click()
}
</script>

<template>
  <div class="site-composer">
    <QuoteStrip v-if="quote" :quote="quote" closable @close="replyTo = null" />
    <div class="site-composer__bar">
      <template v-if="isRecording && locked">
        <van-button round class="site-composer__round" aria-label="Kaydı sil" @click="voice.cancel">
          <Trash2 :size="20" />
        </van-button>
        <p class="site-composer__recording">● {{ durationLabel(seconds) }}</p>
        <van-button round type="primary" class="site-composer__round" aria-label="Gönder" @click="voice.send">
          <SendHorizontal :size="20" />
        </van-button>
      </template>
      <template v-else>
        <van-button v-if="!isRecording" round class="site-composer__round" aria-label="Ekle" @click="menuOpen = true">
          <Plus :size="22" />
        </van-button>
        <p v-if="isRecording" class="site-composer__recording">
          ● {{ durationLabel(seconds) }} <span><Lock :size="13" /> kilit için yukarı kaydır</span>
        </p>
        <van-field v-else v-model="body" type="textarea" rows="1" :autosize="{ maxHeight: 120 }" maxlength="4000"
          placeholder="Bir not yaz…" :border="false" class="site-composer__field" />
        <van-button v-if="!hasText && !isRecording" round class="site-composer__round site-composer__plain"
          aria-label="Kamera" @click="cameraInput?.click()">
          <Camera :size="22" />
        </van-button>
        <van-button v-if="showMic" round :type="isRecording ? 'danger' : 'primary'"
          class="site-composer__round site-composer__mic" aria-label="Sesli not için basılı tut" v-bind="voice.handlers">
          <Mic :size="22" />
        </van-button>
        <van-button v-else-if="!isRecording" round type="primary" :disabled="!hasText" class="site-composer__round"
          aria-label="Gönder" @click="composer.submit()">
          <SendHorizontal :size="20" />
        </van-button>
      </template>
    </div>
    <input ref="gallery" type="file" accept="image/*,video/*" multiple hidden @change="onPicked" />
    <input ref="pdf" type="file" accept="application/pdf" multiple hidden @change="onPicked" />
    <input ref="camera" type="file" accept="image/*" capture="environment" hidden @change="onPicked" />
  </div>
  <van-action-sheet v-model:show="menuOpen" :actions="MENU" cancel-text="Vazgeç" teleport="body" @select="onMenu" />
  <PhotoSendSheet v-model:show="sheetOpen" :composer="composer" :site-name="siteName" @add-files="addFiles" />
</template>

<style scoped>
.site-composer {
  display: grid;
  gap: var(--space-2);
}

.site-composer__bar {
  display: flex;
  align-items: flex-end;
  gap: var(--space-2);
}

/* Yuvarlak, eldivenle basılabilecek büyüklükte ikon düğmeleri. */
.site-composer__round {
  flex: none;
  width: 46px;
  padding: 0;
}

.site-composer__plain {
  border: 0;
  background: transparent;
}

/* Basılı tutarken sayfa kaymasın, telefonun seçim menüsü açılmasın. */
.site-composer__mic {
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.site-composer__field,
.site-composer__recording {
  flex: 1;
  min-width: 0;
  min-height: 46px;
  border-radius: 23px;
  background: var(--surface-muted);
}

.site-composer__field {
  --van-cell-background: transparent;
  --van-cell-vertical-padding: 12px;
}

.site-composer__recording {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  margin: 0;
  padding: 0 var(--space-4);
  color: var(--status-danger);
  font-weight: var(--weight-semibold);
  font-variant-numeric: tabular-nums;
}

.site-composer__recording span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-weight: var(--weight-regular);
}
</style>
