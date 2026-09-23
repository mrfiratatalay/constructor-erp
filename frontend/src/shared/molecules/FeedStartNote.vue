<script setup lang="ts">
/**
 * Akışın en başındaki sistem satırları (WhatsApp'ta grubun kurulduğunu söyleyen gri yazılar):
 * şantiye oluşturuldu, sorumlusu kim. Gönderi değildir; kimseye ait değildir, o yüzden kart da değildir.
 * Yalnızca bütün geçmiş yüklendiğinde görünür: en üstte durması gereken satır, gerçekten en üstte durur.
 */
const { lines } = defineProps<{ lines: string[] }>()
</script>

<template>
  <ul class="feed-start">
    <li v-for="line in lines" :key="line" class="feed-start__line">{{ line }}</li>
  </ul>
</template>

<style scoped>
.feed-start {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: center;
}

.feed-start__line {
  justify-self: center;
  padding: 5px 12px;
  border-radius: 999px;
  background: var(--surface-muted);
  color: var(--text-muted);
  font-size: var(--text-xs);
}
</style>
