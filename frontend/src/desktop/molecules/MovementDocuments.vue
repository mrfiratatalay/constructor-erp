<script setup lang="ts">
import { FileUp } from 'lucide-vue-next'
import { ElMessage, type UploadFile, type UploadFiles, type UploadUserFile } from 'element-plus'
import { DOCUMENT_ACCEPT, documentsProblem } from '@/core/shipments/movementForm'

const files = defineModel<UploadUserFile[]>({ required: true })
function validate(file: UploadFile, uploads: UploadFiles) {
  const documents = uploads.flatMap((upload) => upload.raw ? [upload.raw] : [])
  const problem = documentsProblem(documents)
  if (!problem) return
  files.value = uploads.filter((upload) => upload.uid !== file.uid)
  ElMessage.warning(problem)
}
</script>

<template>
  <el-upload v-model:file-list="files" :auto-upload="false" :accept="DOCUMENT_ACCEPT" :on-change="validate" multiple drag>
    <div class="documents">
      <FileUp :size="28" :stroke-width="1.5" aria-hidden="true" />
      <strong>İrsaliye yükle</strong>
      <span>Dosyayı buraya bırakın veya seçin</span>
      <small>PDF, JPG veya PNG · Dosya başına en çok 10 MB</small>
    </div>
  </el-upload>
</template>

<style scoped>
.documents { display: grid; justify-items: center; gap: var(--space-2); color: var(--text-muted); }
.documents svg { color: var(--brand-primary); }
.documents strong { color: var(--text-strong); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
.documents span, .documents small { font-size: var(--text-xs); }
:deep(.el-upload) { width: 100%; }
:deep(.el-upload-dragger) { padding: var(--space-5); background: var(--surface-muted); border-color: var(--border-strong); }
</style>
