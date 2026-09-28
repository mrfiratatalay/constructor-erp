<script setup lang="ts">
/**
 * Hazır seçenekler, tek dokunuşla (ör. imalat türü, birim, taşeron): seçili olan dolu, öbürleri çerçeveli; Fırat'ın
 * yoklama süzgecindeki çiplerle aynı dil. Yazıyla girilen değer listede yoksa hiçbiri seçili görünmez.
 */
const value = defineModel<string | undefined>({ required: true })
const { options } = defineProps<{ options: { value: string; label: string }[] }>()
</script>

<template>
  <van-space wrap :size="8">
    <van-button v-for="option in options" :key="option.value" size="small" round type="primary"
      :plain="value !== option.value" :aria-pressed="value === option.value" @click="value = option.value">
      {{ option.label }}
    </van-button>
  </van-space>
</template>
