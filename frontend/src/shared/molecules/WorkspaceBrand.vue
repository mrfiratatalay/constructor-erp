<script setup lang="ts">
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/**
 * Çalışma alanının kimliği: firmanın logosu ve adı, altında küçük "Constructor ERP". Ürün ile müşteri markası
 * karışmaz: öne çıkan firmadır, ürün imza gibi durur. compact: yalnızca logo.
 */
const { name, logoUrl = null, compact = false } = defineProps<{
  name: string
  logoUrl?: string | null
  compact?: boolean
}>()
</script>

<template>
  <div class="workspace-brand">
    <CompanyLogo :name="name" :logo-url="logoUrl" :size="40" surface="dark" />
    <div v-if="!compact" class="workspace-brand__text">
      <strong :title="name">{{ name }}</strong>
      <span>Constructor ERP</span>
    </div>
  </div>
</template>

<style scoped>
.workspace-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 0;
  color: var(--brand-on-deep);
}

.workspace-brand__text {
  display: grid;
  gap: 1px;
  min-width: 0;
}

.workspace-brand__text strong {
  overflow: hidden;
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-brand__text span {
  color: rgb(255 255 255 / 0.62);
  font-size: 11px;
  font-weight: var(--weight-semibold);
  letter-spacing: 0.02em;
  white-space: nowrap;
}
</style>
