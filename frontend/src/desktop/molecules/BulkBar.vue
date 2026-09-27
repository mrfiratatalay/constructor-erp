<script setup lang="ts">
import { STATUS_LOOKS, type DayStatus } from '@/core/puantaj/puantajLabels'

/**
 * Seçilenleri tek hamlede işaretlemek: şef gelenleri seçer, "Geldi" der. Seçimde ekip varsa yalnızca Geldi ve
 * Gelmedi önerilir (ekibin yarım günü, izni olmaz). Notlar yerinde kalır.
 */
const { count, choices } = defineProps<{ count: number; choices: DayStatus[] }>()
const emit = defineEmits<{ choose: [status: DayStatus]; cancel: [] }>()
</script>

<template>
  <el-alert type="info" :closable="false" show-icon :title="`${count} satır seçildi. Bugün ne olarak işaretlensin?`">
    <el-space wrap :size="8">
      <el-button v-for="status in choices" :key="status" size="small" plain :type="STATUS_LOOKS[status].tone"
        @click="emit('choose', status)">
        {{ STATUS_LOOKS[status].label }}
      </el-button>
      <el-button size="small" link @click="emit('cancel')">Seçimi bırak</el-button>
    </el-space>
  </el-alert>
</template>
