<script setup lang="ts">
import { ElMessage, type UploadFile, type UploadFiles } from 'element-plus'
import { CloudUpload } from 'lucide-vue-next'
import { DOCUMENT_ACCEPT, documentError } from '@/core/materials/documentRules'

/**
 * Belge / irsaliye: sürükle-bırak ya da seç; PDF, JPG, PNG, en çok 10 MB. Dosyalar hemen gönderilmez, hareket
 * kaydedilince onunla birlikte gider. Uygun olmayan dosya eklenmez, nedeni söylenir.
 */
const files = defineModel<File[]>({ required: true })

function added(file: UploadFile, all: UploadFiles) {
  const raw = file.raw
  const problem = raw ? documentError(raw) : 'Dosya okunamadı.'
  if (problem) {
    ElMessage.warning(problem)
    all.splice(all.indexOf(file), 1)
    return
  }
  files.value = all.flatMap((item) => (item.raw ? [item.raw] : []))
}

const removed = (_file: UploadFile, all: UploadFiles) =>
  (files.value = all.flatMap((item) => (item.raw ? [item.raw] : [])))
</script>

<template>
  <el-upload drag multiple :auto-upload="false" :accept="DOCUMENT_ACCEPT" :limit="5" :on-change="added"
    :on-remove="removed" :on-exceed="() => ElMessage.warning('Bir harekete en çok 5 belge eklenir.')">
    <el-space direction="vertical" :size="4">
      <el-text type="primary"><CloudUpload :size="26" /></el-text>
      <el-text><el-text type="primary" tag="b">Dosya seçin</el-text> veya buraya sürükleyin</el-text>
      <el-text type="info" size="small">PDF, JPG, PNG (en çok 10 MB)</el-text>
    </el-space>
  </el-upload>
</template>
