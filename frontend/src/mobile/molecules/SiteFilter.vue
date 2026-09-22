<script setup lang="ts">
import { computed } from 'vue'
import type { SiteView } from '@/core/api/generated/model'

/** Akışı şantiyeye göre süzer; boş seçim "tüm şantiyeler" demektir. */
const selected = defineModel<string | undefined>({ required: true })
const { sites } = defineProps<{ sites: SiteView[] }>()

const options = computed(() => [
  { text: 'Tüm şantiyeler', value: '' },
  ...sites.map((site) => ({ text: site.name, value: site.id })),
])
</script>

<template>
  <van-dropdown-menu class="site-filter">
    <van-dropdown-item :model-value="selected ?? ''" :options="options"
      @update:model-value="(value: string) => (selected = value || undefined)" />
  </van-dropdown-menu>
</template>

<style scoped>
/* Sayfadaki diğer beyaz yüzeyler yuvarlak; Vant'ın süzgeç çubuğu da onlara uysun. */
.site-filter {
  overflow: hidden;
  border-radius: var(--radius-md);
}

/* Vant seçiliyi ortalar; süzgeç tek başına dururken sayfanın sol hizasına oturması daha okunur. */
.site-filter :deep(.van-dropdown-menu__item) {
  justify-content: flex-start;
  padding-left: var(--van-cell-horizontal-padding);
}
</style>
