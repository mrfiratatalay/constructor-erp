<script setup lang="ts">
import { Share, SquarePlus } from 'lucide-vue-next'

/** Apple, web uygulaması ana ekrana eklenmeden bildirime izin vermiyor; önce bu adım. */
const STEPS = [
  { icon: Share, text: "Safari'nin altındaki Paylaş düğmesine dokun." },
  { icon: SquarePlus, text: 'Listeden "Ana Ekrana Ekle"yi seç.' },
  { icon: null, text: 'Ana ekrandaki Constructor ERP ikonundan aç, bildirimleri buradan aç.' },
]
</script>

<template>
  <ol class="install-guide">
    <li v-for="(step, index) in STEPS" :key="step.text">
      <span class="install-guide__step">{{ index + 1 }}</span>
      <span class="install-guide__text">
        <component :is="step.icon" v-if="step.icon" :size="16" class="install-guide__icon" />
        {{ step.text }}
      </span>
    </li>
  </ol>
</template>

<style scoped>
.install-guide {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--text-sm);
  line-height: 1.5;
}

.install-guide li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}

/* Metin tek bir kutu içinde: ikon ve yazı satır satır bölünmez. */
.install-guide__text {
  flex: 1;
  min-width: 0;
}

.install-guide__icon {
  vertical-align: -3px;
  margin-right: 2px;
}

.install-guide__step {
  display: grid;
  place-items: center;
  flex: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--brand-tint);
  color: var(--brand-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}
</style>
