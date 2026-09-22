<script setup lang="ts">
import { computed } from 'vue'
import type { UploaderBeforeRead } from 'vant'
import { LIMITS } from '@/core/posts/attachments'
import type { Composer } from '@/core/posts/useComposer'

/**
 * 📷'dan sonra açılan önizleme (WhatsApp gibi): seçilen fotoğraf ve videolar, açıklama ve "sorun" işareti.
 * Açıklama çubuktaki yazıyla aynı taslaktır. Gönderilmeden kapatılırsa seçilenler atılır, yazı kalır.
 */
const show = defineModel<boolean>('show', { required: true })
const { composer, siteName } = defineProps<{ composer: Composer; siteName: string }>()
const emit = defineEmits<{ addFiles: [files: File[]] }>()
const { body, issue, attachments, isPreparing, canSend } = composer

/** Uploader'ın önizlemesi bizim listemizden beslenir; ekleme/çıkarma kararını composer verir. */
const previews = computed(() =>
  attachments.value.map((item) => ({ url: item.previewUrl, isImage: item.kind === 'PHOTO' })),
)

/** Vant seçilen dosyayı kendi listesine eklemesin diye false döner: tek doğru liste composer'da. */
const addMore: UploaderBeforeRead = (file) => {
  emit('addFiles', Array.isArray(file) ? file : [file])
  return false
}

async function send() {
  await composer.submit()
  show.value = false
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @closed="composer.clear()">
    <section class="photo-sheet">
      <h2 class="photo-sheet__title">{{ siteName }}</h2>
      <van-uploader :model-value="previews" :before-read="addMore" :max-count="LIMITS.attachments" multiple
        accept="image/*,video/*" upload-text="Ekle" @delete="(_: unknown, detail: { index: number }) =>
          composer.remove(attachments[detail.index]!.id)" />
      <van-loading v-if="isPreparing" size="18">Fotoğraflar hazırlanıyor…</van-loading>
      <van-cell-group inset class="photo-sheet__fields">
        <van-field v-model="body" type="textarea" rows="1" autosize maxlength="4000"
          placeholder="Açıklama ekle (isteğe bağlı)" />
        <van-cell center title="Bu bir sorun" label="Sorunlar'a düşer; çözülene kadar açık kalır.">
          <template #right-icon><van-switch v-model="issue" /></template>
        </van-cell>
      </van-cell-group>
      <!-- Sorun işaretliyse düğme de kırmızı: gönderirken ne gönderdiğin bellidir. -->
      <van-button :type="issue ? 'danger' : 'primary'" block round size="large" :disabled="!canSend || isPreparing"
        @click="send">
        {{ issue ? 'Sorun olarak gönder' : 'Gönder' }} · {{ attachments.length }} dosya
      </van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.photo-sheet {
  display: grid;
  gap: var(--space-4);
  max-height: 86dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.photo-sheet__title {
  margin: 0;
  padding-right: var(--space-8);
  font-size: var(--text-lg);
}

/* Beyaz pencerede beyaz grup kaybolmasın: alanlar hafif zeminli bir blok. */
.photo-sheet__fields {
  --van-cell-background: var(--surface-muted);
}
</style>
