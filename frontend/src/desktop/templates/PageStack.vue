<script setup lang="ts">
/**
 * Sayfanın dikey düzeni: bölümler alt alta, aralarında eşit boşluk. Izgara sütunu içerikten geniş olamaz
 * (minmax(0, 1fr)): geniş bir tablo sayfayı yana taşırmaz, kendi içinde kayar.
 */
const { gap = 16 } = defineProps<{ gap?: number }>()
</script>

<template>
  <div class="page-stack" :style="{ gap: `${gap}px` }"><slot /></div>
</template>

<style scoped>
.page-stack {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  min-width: 0;
}
</style>
