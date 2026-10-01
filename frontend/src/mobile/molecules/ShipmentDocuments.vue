<script setup lang="ts">
import type { DocumentView } from '@/core/api/generated/model'

defineProps<{ documents: DocumentView[] }>()
</script>

<template>
  <section class="movement-documents">
    <h3>İRSALİYE</h3>
    <van-cell-group v-if="documents.length" :border="false">
      <van-cell v-for="document in documents" :key="document.id" :title="document.fileName" icon="description"
        is-link tag="a" :href="document.url" target="_blank" rel="noopener noreferrer" />
    </van-cell-group>
    <p v-else>İrsaliye eklenmemiş.</p>
  </section>
</template>

<style scoped>
.movement-documents h3 { margin: 0 0 var(--space-2); color: var(--text-muted); font-size: var(--text-xs); letter-spacing: .05em; }
.movement-documents .van-cell { padding-inline: 0; color: var(--brand-primary); font-size: var(--text-sm); }
.movement-documents :deep(.van-cell__title) { overflow-wrap: anywhere; }
.movement-documents p { margin: 0; color: var(--text-subtle); font-size: var(--text-sm); }
</style>
