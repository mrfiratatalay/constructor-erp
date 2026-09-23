<script setup lang="ts">
/**
 * Masaüstü ana ekranlarının ortak iskeleti (WhatsApp Masaüstü): solda liste, sağda seçili olan.
 * Liste ve detay ayrı ayrı kayar; sayfa bütün olarak kaymaz. Şantiyeler ve Ekip aynı kalıptır:
 * amcan bir kere öğrenir, her yerde kullanır.
 */
</script>

<template>
  <div class="split-view">
    <section class="split-view__list">
      <div class="split-view__list-header"><slot name="list-header" /></div>
      <el-scrollbar class="split-view__list-body"><slot name="list" /></el-scrollbar>
    </section>
    <section class="split-view__detail"><slot name="detail" /></section>
  </div>
</template>

<style scoped>
.split-view {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  height: 100%;
}

.split-view__list {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border-right: 1px solid var(--border-soft);
  background: var(--surface);
}

.split-view__list-header {
  padding: var(--space-5) var(--space-4) var(--space-3);
  border-bottom: 1px solid var(--border-soft);
}

.split-view__list-body {
  flex: 1;
  min-height: 0;
}

.split-view__detail {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
</style>
