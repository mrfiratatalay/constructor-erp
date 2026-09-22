<script setup lang="ts">
import { BellRing } from 'lucide-vue-next'
import { usePush } from '@/core/push/usePush'

/**
 * Bildirimler kapalıysa listenin sonunda tek satırlık nazik hatırlatma; açıksa hiç görünmez.
 * Ana içeriğin önüne geçmez. Ayrıntılı ayar kullanıcı panelindedir.
 */
const { message } = defineProps<{ message: string }>()
const { state, busy, enable } = usePush()
</script>

<template>
  <p v-if="state === 'off'" class="push-line">
    <BellRing :size="16" class="push-line__icon" />
    <span>{{ message }}</span>
    <el-button link type="primary" :loading="busy" @click="enable">Aç</el-button>
  </p>
</template>

<style scoped>
.push-line {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  padding: var(--space-3) var(--space-4);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.push-line span {
  flex: 1;
}

.push-line__icon {
  color: var(--brand-primary);
}
</style>
