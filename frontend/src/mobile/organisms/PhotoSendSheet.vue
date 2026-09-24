<script setup lang="ts">
import { computed } from 'vue'
import type { UploaderBeforeRead } from 'vant'
import { LIMITS } from '@/core/posts/attachments'
import type { Composer } from '@/core/posts/useComposer'

/**
 * Dosya seçince açılan önizleme (WhatsApp gibi): fotoğraf ve videolar kutucukta, belgeler adıyla; altında
 * açıklama. Açıklama çubuktaki yazıyla aynı taslaktır. Gönderilmeden kapatılırsa seçilenler atılır, yazı kalır.
 */
const show = defineModel<boolean>('show', { required: true })
const { composer, siteName } = defineProps<{ composer: Composer; siteName: string }>()
const emit = defineEmits<{ addFiles: [files: File[]] }>()
const { body, attachments, isPreparing, canSend } = composer

const visuals = computed(() => attachments.value.filter((item) => item.kind === 'PHOTO' || item.kind === 'VIDEO'))
const documents = computed(() => attachments.value.filter((item) => item.kind === 'DOCUMENT'))
/** Uploader'ın önizlemesi bizim listemizden beslenir; ekleme/çıkarma kararını composer verir. */
const previews = computed(() => visuals.value.map((item) => ({ url: item.previewUrl, isImage: item.kind === 'PHOTO' })))

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
      <van-uploader v-if="!documents.length || visuals.length" :model-value="previews" :before-read="addMore"
        :max-count="LIMITS.attachments" multiple accept="image/*,video/*" upload-text="Ekle"
        @delete="(_: unknown, detail: { index: number }) => composer.remove(visuals[detail.index]!.id)" />
      <van-cell-group v-if="documents.length" inset>
        <van-cell v-for="document in documents" :key="document.id" :title="`📄 ${document.file.name}`">
          <template #right-icon>
            <van-button size="mini" plain @click="composer.remove(document.id)">Çıkar</van-button>
          </template>
        </van-cell>
      </van-cell-group>
      <van-loading v-if="isPreparing" size="18">Fotoğraflar hazırlanıyor…</van-loading>
      <van-cell-group inset class="photo-sheet__fields">
        <van-field v-model="body" type="textarea" rows="1" autosize maxlength="4000"
          placeholder="Açıklama ekle (isteğe bağlı)" />
      </van-cell-group>
      <van-button type="primary" block round size="large" :disabled="!canSend || isPreparing" @click="send">
        Gönder · {{ attachments.length }} dosya
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
