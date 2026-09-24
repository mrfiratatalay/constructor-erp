<script setup lang="ts">
/**
 * Akıştaki sistem satırı (WhatsApp'ta grubun içindeki gri yazılar): "Patron şantiyeyi kurdu",
 * "Patron, Musa'yı ekledi". Kimseye ait değildir, o yüzden baloncuk da değildir.
 */
const { text } = defineProps<{ text: string }>()
</script>

<template>
  <p class="system-line"><span>{{ text }}</span></p>
</template>

<style scoped>
.system-line {
  display: flex;
  justify-content: center;
  margin: 0;
}

.system-line span {
  padding: 5px 12px;
  border-radius: var(--radius-md);
  background: var(--surface-muted);
  color: var(--text-muted);
  font-size: var(--text-xs);
  text-align: center;
}
</style>
