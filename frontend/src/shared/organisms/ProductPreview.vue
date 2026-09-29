<script setup lang="ts">
import { ClipboardCheck, HardHat, Layers, Package } from 'lucide-vue-next'
import ProductMark from '@/shared/atoms/ProductMark.vue'
import PreviewBoard from '@/shared/molecules/PreviewBoard.vue'

/**
 * Tanıtım sayfasındaki ürün önizlemesi: gerçek ekranın sadeleştirilmiş çizimi. Ekran görüntüsü yerine çizim, çünkü
 * veriye bağlı değildir ve her ekranda keskin görünür. Dar ekranda yan menü gizlenir.
 */
const NAV = [
  { icon: HardHat, label: 'Şantiyeler', active: true },
  { icon: ClipboardCheck, label: 'Yoklama' },
  { icon: Package, label: 'Malzemeler' },
  { icon: Layers, label: 'İlerleme' },
]
</script>

<template>
  <div class="preview" role="img" aria-label="Constructor ERP şantiye ekranı önizlemesi">
    <div class="preview__bar"><i /><i /><i /><span>app.constructor-erp.com/santiyeler</span></div>
    <div class="preview__body">
      <nav class="preview__nav blueprint">
        <ProductMark :size="28" surface="dark" />
        <span v-for="item in NAV" :key="item.label" :class="{ 'is-active': item.active }">
          <component :is="item.icon" :size="15" /> {{ item.label }}
        </span>
      </nav>
      <PreviewBoard />
    </div>
  </div>
</template>

<style scoped>
.preview {
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.18);
  border-radius: var(--radius-lg);
  background: var(--canvas);
  box-shadow: var(--shadow-deep);
  color: var(--text-strong);
  font-size: var(--text-xs);
  text-align: left;
}

.preview__bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: var(--surface);
  border-bottom: 1px solid var(--border-soft);
}

.preview__bar i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border-strong);
}

.preview__bar span {
  margin-left: var(--space-3);
  padding: 3px 12px;
  border-radius: 999px;
  background: var(--surface-muted);
  color: var(--text-subtle);
}

.preview__body {
  display: grid;
  grid-template-columns: 150px 1fr;
  min-height: 300px;
}

.preview__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-3);
  color: rgb(255 255 255 / 0.75);
}

.preview__nav span {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 7px 8px;
  border-radius: 8px;
}

.preview__nav .is-active {
  background: var(--brand-signature);
  color: var(--brand-deep);
  font-weight: var(--weight-bold);
}

@media (width < 720px) {
  .preview__body { grid-template-columns: 1fr; }
  .preview__nav { display: none; }
}
</style>
