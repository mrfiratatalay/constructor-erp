<script setup lang="ts">
import { showFailToast, type UploaderBeforeRead, type UploaderFileListItem } from 'vant'
import { DOCUMENT_ACCEPT, documentsProblem } from '@/core/shipments/movementForm'

const files = defineModel<UploaderFileListItem[]>({ required: true })
const beforeRead: UploaderBeforeRead = (selected) => {
  const existing = files.value.flatMap((item) => item.file ? [item.file] : [])
  const problem = documentsProblem([...existing, ...(Array.isArray(selected) ? selected : [selected])])
  if (problem) showFailToast(problem)
  return !problem
}
</script>

<template>
  <van-cell-group inset>
    <van-cell>
      <template #title>
        <van-uploader v-model="files" :accept="DOCUMENT_ACCEPT" :before-read="beforeRead" multiple
          upload-text="Belge ekle" />
        <p class="movement-upload__help">PDF, JPG veya PNG · Dosya başına en çok 10 MB</p>
      </template>
    </van-cell>
  </van-cell-group>
</template>

<style scoped>
.movement-upload__help { margin: var(--space-2) 0 0; font-size: var(--text-xs); color: var(--text-muted); }
</style>
