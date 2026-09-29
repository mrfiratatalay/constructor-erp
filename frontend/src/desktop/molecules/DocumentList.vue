<script setup lang="ts">
import { FileText, Image as ImageIcon, Paperclip } from 'lucide-vue-next'
import type { DocumentView } from '@/core/api/generated/model'
import { fileSize } from '@/core/format/fileSize'

/** Hareketin belgeleri: tıklayınca yeni sekmede açılır (PDF okuyucu, fotoğraf). Belge yoksa liste hiç çizilmez. */
const { documents } = defineProps<{ documents: DocumentView[] }>()
</script>

<template>
  <el-space v-if="documents.length" direction="vertical" alignment="stretch" :size="8" fill style="width: 100%">
    <el-link v-for="document in documents" :key="document.id" :href="document.url" target="_blank" underline="never">
      <el-space :size="10">
        <el-text type="primary">
          <component :is="document.contentType === 'application/pdf' ? FileText : ImageIcon" :size="20" />
        </el-text>
        <el-text tag="b">{{ document.fileName }}</el-text>
        <el-text type="info" size="small">{{ fileSize(document.sizeBytes) }}</el-text>
      </el-space>
    </el-link>
  </el-space>
  <el-text v-else type="info" size="small"><Paperclip :size="13" /> Belge eklenmemiş</el-text>
</template>
