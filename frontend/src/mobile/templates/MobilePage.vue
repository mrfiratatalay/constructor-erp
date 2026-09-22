<script setup lang="ts">
import { useRouter } from 'vue-router'

/** Vant'ın başlık çubuğu; renk, yükseklik ve yazı ağırlığı tema değişkenlerinden gelir. */
const { title, back = false } = defineProps<{ title: string; back?: boolean }>()
const router = useRouter()

function goBack() {
  if (window.history.state?.back) router.back()
  else void router.replace({ name: 'feed' })
}
</script>

<template>
  <van-nav-bar :title="title" :left-arrow="back" safe-area-inset-top fixed placeholder @click-left="goBack">
    <template #right><slot name="action" /></template>
  </van-nav-bar>
  <main class="mobile-page">
    <slot />
  </main>
</template>

<style scoped>
.mobile-page {
  display: grid;
  gap: var(--space-4);
  align-content: start;
  padding: var(--space-4);
  /* Alt sekme çubuğu içeriği kapatmasın; telefonun alt çentik boşluğu da hesaba katılır. */
  padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
}
</style>
