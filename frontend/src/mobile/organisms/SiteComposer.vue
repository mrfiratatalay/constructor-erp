<script setup lang="ts">
import { computed, ref } from 'vue'
import { showFailToast, type UploaderBeforeRead } from 'vant'
import { Camera, Mic, SendHorizontal, TriangleAlert } from 'lucide-vue-next'
import { durationLabel } from '@/core/format/dates'
import { LIMITS } from '@/core/posts/attachments'
import { useComposer, type ComposeTarget } from '@/core/posts/useComposer'
import { useVoiceRecorder } from '@/core/posts/useVoiceRecorder'
import PhotoSendSheet from '@/mobile/organisms/PhotoSendSheet.vue'

/**
 * Şantiye sayfasının gönderme çubuğu, WhatsApp'ın mesaj çubuğu gibi (TASARIM.md İlke 7): 📷 kamera ya da
 * galeri → önizleme; yazı doğrudan çubuğa; 🎤 basılı tut, bırakınca gider. Yazı varken 🎤 yerine ➤ çıkar,
 * "sorun" işareti de yalnızca o zaman görünür. Şantiye seçilmez: gönderi sayfanın şantiyesine gider.
 */
const { site } = defineProps<{ site: ComposeTarget }>()
const composer = useComposer(() => site)
const { body, issue } = composer
const sheetOpen = ref(false)
const recorder = useVoiceRecorder((file) => void sendVoice(file))
const { isRecording, seconds } = recorder
const hasText = computed(() => body.value.trim() !== '')
const showMic = computed(() => !hasText.value && recorder.isSupported)

async function addFiles(files: File[]) {
  const problems = await composer.addFiles(files)
  if (problems.length) showFailToast(problems.join('\n'))
}

/** Vant seçilen dosyayı kendi listesine eklemesin diye false döner: tek doğru liste composer'da. */
const pickPhotos: UploaderBeforeRead = (file) => {
  sheetOpen.value = true
  void addFiles(Array.isArray(file) ? file : [file])
  return false
}

/** Mikrofon yalnızca yazı yokken görünür; o an "sorun" işareti de görünmez, sesli not düz not gider. */
async function sendVoice(file: File) {
  issue.value = false
  await addFiles([file])
  await composer.submit()
}

async function startRecording() {
  try {
    await recorder.start()
  } catch {
    showFailToast('Mikrofona izin verilmedi. Tarayıcı ayarlarından mikrofon iznini aç.')
  }
}
</script>

<template>
  <div class="site-composer">
    <label v-if="hasText" class="site-composer__issue" :class="{ 'site-composer__issue--on': issue }">
      <TriangleAlert :size="16" />
      <span>Sorun olarak işaretle</span>
      <van-switch v-model="issue" size="20px" />
    </label>
    <div class="site-composer__bar">
      <van-uploader :before-read="pickPhotos" :max-count="LIMITS.attachments" :preview-image="false" multiple
        accept="image/*,video/*">
        <van-button round class="site-composer__round" aria-label="Fotoğraf ya da video ekle">
          <Camera :size="22" />
        </van-button>
      </van-uploader>
      <p v-if="isRecording" class="site-composer__recording">
        ● {{ durationLabel(seconds) }} · bırakınca gider
      </p>
      <van-field v-else v-model="body" type="textarea" rows="1" :autosize="{ maxHeight: 120 }" maxlength="4000"
        placeholder="Bir not yaz…" :border="false" class="site-composer__field" />
      <!-- Basılı tut, konuş, bırak: WhatsApp'taki gibi. Uzun basınca telefonun seçim menüsü açılmasın. -->
      <van-button v-if="showMic" round :type="isRecording ? 'danger' : 'primary'"
        class="site-composer__round site-composer__mic" aria-label="Sesli not için basılı tut"
        @touchstart.prevent="startRecording" @touchend="recorder.stop" @touchcancel="recorder.stop"
        @mousedown.prevent="startRecording" @mouseup="recorder.stop" @mouseleave="recorder.stop">
        <Mic :size="22" />
      </van-button>
      <van-button v-else round :type="issue ? 'danger' : 'primary'" :disabled="!hasText"
        class="site-composer__round" aria-label="Gönder" @click="composer.submit()">
        <SendHorizontal :size="20" />
      </van-button>
    </div>
  </div>
  <PhotoSendSheet v-model:show="sheetOpen" :composer="composer" :site-name="site.name" @add-files="addFiles" />
</template>

<style scoped>
.site-composer {
  display: grid;
  gap: var(--space-2);
}

.site-composer__issue {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
}

.site-composer__issue span {
  flex: 1;
}

.site-composer__issue--on {
  color: var(--status-danger);
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

.site-composer__mic {
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
  margin: 0;
  padding: 0 var(--space-4);
  color: var(--status-danger);
  font-weight: var(--weight-semibold);
  font-variant-numeric: tabular-nums;
}
</style>
