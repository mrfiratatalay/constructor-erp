<script setup lang="ts">
/** Başlık çubuğunda iki satırlık başlık: ad ve altında küçük ikinci satır (WhatsApp'ta grubun üyeleri gibi). */
const { title, subtitle } = defineProps<{ title: string; subtitle: string }>()
</script>

<template>
  <span class="page-title">
    <strong>{{ title }}</strong>
    <small>{{ subtitle }}</small>
  </span>
</template>

<style scoped>
/* İki satır çubuğun yüksekliğini bozmasın: ikinci satır küçük ve sıkışık. */
.page-title {
  display: grid;
  overflow: hidden;
  line-height: 1.25;
}

.page-title strong {
  overflow: hidden;
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-title small {
  overflow: hidden;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: var(--weight-regular);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
