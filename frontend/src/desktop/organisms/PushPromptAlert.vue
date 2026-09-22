<script setup lang="ts">
import { ref } from 'vue'
import { PUSH_STATE_TEXT } from '@/core/push/pushStateText'
import { usePush } from '@/core/push/usePush'
import InstallGuide from '@/shared/molecules/InstallGuide.vue'

const { message } = defineProps<{ message: string }>()
const { state, busy, enable } = usePush()
const guideOpen = ref(false)
</script>

<template>
  <el-alert v-if="state === 'off' || state === 'installFirst'" type="info" :closable="false" show-icon>
    <div class="push-alert">
      <div class="push-alert__text">
        <strong>{{ message }}</strong>
        <span>{{ PUSH_STATE_TEXT[state] }}</span>
      </div>
      <el-button v-if="state === 'off'" type="primary" size="small" :loading="busy" @click="enable">
        Bildirimleri aç
      </el-button>
      <el-button v-else size="small" @click="guideOpen = !guideOpen">Nasıl?</el-button>
      <InstallGuide v-if="guideOpen" class="push-alert__guide" />
    </div>
  </el-alert>
</template>

<style scoped>
.push-alert {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}

.push-alert__text {
  display: grid;
  flex: 1;
  min-width: 220px;
}

.push-alert__text span {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.push-alert__guide {
  flex-basis: 100%;
}
</style>
