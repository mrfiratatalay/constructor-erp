<script setup lang="ts">
import { computed } from 'vue'
import type { UploadFile, UploadUserFile } from 'element-plus'
import { LIMITS } from '@/core/posts/attachments'
import type { Composer } from '@/core/posts/useComposer'

/**
 * Dosya seçince açılan önizleme (WhatsApp gibi): fotoğraf ve videolar kutucukta, belgeler adıyla; açıklama.
 * Açıklama çubuktaki yazıyla aynı taslaktır. Gönderilmeden kapatılırsa seçilenler atılır, yazı kalır.
 */
const open = defineModel<boolean>('open', { required: true })
const { composer, siteName } = defineProps<{ composer: Composer; siteName: string }>()
const emit = defineEmits<{ addFiles: [files: File[]] }>()
const { body, attachments, isPreparing, canSend } = composer

const visuals = computed(() => attachments.value.filter((item) => item.kind === 'PHOTO' || item.kind === 'VIDEO'))
const documents = computed(() => attachments.value.filter((item) => item.kind === 'DOCUMENT'))
/** el-upload'un önizlemesi bizim listemizden beslenir; kütüphane kimliği sayı bekler, sıra numarası verilir. */
const previews = computed<UploadUserFile[]>(() =>
  visuals.value.map((item, index) => ({ name: item.file.name, url: item.previewUrl, uid: index })),
)

function removeAt(uploadFile: UploadFile) {
  const item = visuals.value[Number(uploadFile.uid)]
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
      <p v-for="document in documents" :key="document.id" class="photo-dialog__document">
        <span>📄 {{ document.file.name }}</span>
        <el-button text size="small" @click="composer.remove(document.id)">Çıkar</el-button>
      </p>
      <span v-if="isPreparing" class="photo-dialog__hint">Fotoğraflar hazırlanıyor…</span>
      <el-input v-model="body" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" maxlength="4000"
        placeholder="Açıklama ekle (isteğe bağlı)" />
    </div>
    <template #footer>
      <el-button @click="open = false">Vazgeç</el-button>
      <el-button type="primary" :disabled="!canSend || isPreparing" @click="send">
        Gönder · {{ attachments.length }} dosya
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

.photo-dialog__document {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--surface-muted);
}

.photo-dialog__hint {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
