<script setup lang="ts">
import { ref } from 'vue'
import { BellRing } from 'lucide-vue-next'
import { usePush } from '@/core/push/usePush'
import InstallGuide from '@/shared/molecules/InstallGuide.vue'

/**
 * Bildirimler kapalıysa tek satırlık nazik hatırlatma; açıksa ya da desteklenmiyorsa hiç görünmez.
 * Ana içeriğin önüne geçmez: sayfanın sonunda durur, kurulum adımları yalnızca istenince açılır.
 */
const { message } = defineProps<{ message: string }>()
const { state, busy, enable } = usePush()
const guideOpen = ref(false)
</script>

<template>
  <van-cell-group v-if="state === 'off' || state === 'installFirst'" inset>
    <van-cell center :title="message">
      <template #icon><BellRing :size="18" class="push-cell__icon" /></template>
      <template #value>
        <van-button v-if="state === 'off'" type="primary" size="small" round :loading="busy" @click="enable">
          Aç
        </van-button>
        <van-button v-else size="small" round plain type="primary" @click="guideOpen = !guideOpen">Nasıl?</van-button>
      </template>
    </van-cell>
    <van-cell v-if="guideOpen"><InstallGuide /></van-cell>
  </van-cell-group>
</template>

<style scoped>
.push-cell__icon {
  flex: none;
  margin-right: var(--space-3);
  color: var(--brand-primary);
}
</style>
