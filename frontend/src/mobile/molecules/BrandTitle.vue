<script setup lang="ts">
import CompanyLogo from '@/shared/atoms/CompanyLogo.vue'

/**
 * Ana ekranın lacivert başlığındaki marka: firmanın logosu (yoksa baş harfleri) ve yanında başlık. logoName, başlık
 * firmanın adı değilse (ör. "Malzemeler") baş harflerin kimin adından çıkacağıdır.
 */
const { title, logoName = null, logoUrl = null } = defineProps<{
  title: string
  logoName?: string | null
  logoUrl?: string | null
}>()
</script>

<template>
  <span class="brand-title">
    <CompanyLogo :name="logoName ?? title" :logo-url="logoUrl" :size="30" surface="dark" />
    <span class="brand-title__name">{{ title }}</span>
  </span>
</template>

<style scoped>
/* Sohbet başlığı gibi sağdaki eylemlere (＋) yer bırakır; uzun firma adı iki satıra kırılıp ＋'nın üstüne biniyordu. */
.brand-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  max-width: calc(100vw - 120px);
  min-width: 0;
  color: var(--brand-on-deep);
  font-size: var(--text-md);
  font-weight: var(--weight-black);
  letter-spacing: -0.01em;
}

.brand-title__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
