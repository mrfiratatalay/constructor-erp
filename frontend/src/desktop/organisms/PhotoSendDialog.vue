<script setup lang="ts">
import { computed } from 'vue'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { LIMITS } from '@/core/posts/attachments'
import type { Composer } from '@/core/posts/useComposer'

/**
 * 📷'dan sonra açılan önizleme (WhatsApp gibi): seçilen fotoğraf ve videolar, açıklama ve "sorun" işareti.
 * Açıklama çubuktaki yazıyla aynı taslaktır. Gönderilmeden kapatılırsa seçilenler atılır, yazı kalır.
 */
const open = defineModel<boolean>('open', { required: true })
const { composer, siteName } = defineProps<{ composer: Composer; siteName: string }>()
const emit = defineEmits<{ addFiles: [files: File[]] }>()
const { body, issue, attachments, isPreparing, canSend } = composer

/** el-upload'un önizlemesi bizim listemizden beslenir; kütüphane kimliği sayı bekler, sıra numarası verilir. */
const previews = computed<UploadUserFile[]>(() =>
  attachments.value.map((item, index) => ({ name: item.file.name, url: item.previewUrl, uid: index })),
)

function removeAt(uploadFile: UploadFile) {
  const item = attachments.value[Number(uploadFile.uid)]
  if (item) composer.remove(item.id)
}

async function send() {
  await composer.submit()
  open.value = false
}
</script>

<template>
  <el-dialog v-model="open" :title="siteName" width="560px" @closed="composer.clear()">
    <div class="photo-dialog">
      <el-upload :file-list="previews" list-type="picture-card" multiple accept="image/*,video/*"
        :limit="LIMITS.attachments" :auto-upload="false"
        :on-change="(uploadFile: UploadFile) => uploadFile.raw && emit('addFiles', [uploadFile.raw])"
        :on-remove="removeAt">
        <span class="photo-dialog__plus">+</span>
      </el-upload>
      <span v-if="isPreparing" class="photo-dialog__hint">Fotoğraflar hazırlanıyor…</span>
      <el-input v-model="body" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" maxlength="4000"
        placeholder="Açıklama ekle (isteğe bağlı)" />
      <el-switch v-model="issue" active-text="Bu bir sorun: Sorunlar'a düşer, çözülene kadar açık kalır" />
    </div>
    <template #footer>
      <el-button @click="open = false">Vazgeç</el-button>
      <!-- Sorun işaretliyse düğme de kırmızı: gönderirken ne gönderdiğin bellidir. -->
      <el-button :type="issue ? 'danger' : 'primary'" :disabled="!canSend || isPreparing" @click="send">
        {{ issue ? 'Sorun olarak gönder' : 'Gönder' }} · {{ attachments.length }} dosya
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.photo-dialog {
  display: grid;
  gap: var(--space-4);
}

.photo-dialog__plus {
  color: var(--text-subtle);
  font-size: var(--text-xl);
}

.photo-dialog__hint {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
