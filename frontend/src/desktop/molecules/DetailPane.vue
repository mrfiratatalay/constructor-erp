<script setup lang="ts">
/**
 * Sağ panelin iç düzeni: üstte sabit başlık, ortada kayan içerik (okunaklı genişlikte, ortalı),
 * altta sabit çubuk (ör. gönderme). Şantiye ve kişi ayrıntısı aynı düzeni kullanır.
 * bottom: içerik azken dibe yaslanır — sohbet böyle durur (WhatsApp Masaüstü).
 */
const { bottom = false } = defineProps<{ bottom?: boolean }>()
</script>

<template>
  <div class="detail-pane">
    <header v-if="$slots.header" class="detail-pane__header"><slot name="header" /></header>
    <el-scrollbar class="detail-pane__body" :class="{ 'detail-pane__body--bottom': bottom }">
      <div class="detail-pane__content" :class="{ 'detail-pane__content--bottom': bottom }"><slot /></div>
    </el-scrollbar>
    <footer v-if="$slots.footer" class="detail-pane__footer">
      <div class="detail-pane__footer-inner"><slot name="footer" /></div>
    </footer>
  </div>
</template>

<style scoped>
.detail-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.detail-pane__header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-soft);
  background: var(--surface);
}

.detail-pane__body {
  flex: 1;
  min-height: 0;
}

.detail-pane__content {
  display: grid;
  gap: var(--space-4);
  max-width: 760px;
  margin: 0 auto;
  padding: var(--space-5) var(--space-6);
}

/* Kayan alanın görünümü panel kadar uzar; içerik onun dibine oturur, kalan boşluk üstte kalır. */
.detail-pane__body--bottom :deep(.el-scrollbar__view) {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.detail-pane__content--bottom {
  flex: 1;
  align-content: end;
  width: 100%;
}

.detail-pane__footer {
  padding: var(--space-3) var(--space-6);
  border-top: 1px solid var(--border-soft);
  background: var(--surface);
}

.detail-pane__footer-inner {
  max-width: 760px;
  margin: 0 auto;
}
</style>
