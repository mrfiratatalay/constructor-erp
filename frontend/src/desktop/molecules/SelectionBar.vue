<script setup lang="ts">
import { computed } from 'vue'
import { STATUS_LOOKS, type DayStatus } from '@/core/puantaj/puantajLabels'

/**
 * Seçilenleri tek hamlede işaretleme şeridi: seçim yapılınca alttan kayarak açılan çekmece. Sayfayı itmez, arkayı
 * kilitlemez (satırlar seçilmeye devam eder). Şef kimi seçtiğini adlarından görür, adın ×'iyle seçimden çıkarır;
 * sonra "Bugün:" ve kendi renginde büyük düğmeler, "Vazgeç". Listenin dibinde çekmece kadar pay bırakır ki son
 * satır onun altında kalmasın.
 */
interface Picked {
  id: string
  name: string
}

const HEIGHT = 128
const SHOWN = 8
const { items, choices } = defineProps<{ items: Picked[]; choices: DayStatus[] }>()
const emit = defineEmits<{ choose: [status: DayStatus]; deselect: [id: string]; cancel: [] }>()
const shown = computed(() => items.slice(0, SHOWN))
const rest = computed(() => items.length - shown.value.length)
const ROOM = { height: `${HEIGHT}px` }
</script>

<template>
  <div v-if="items.length" :style="ROOM" aria-hidden="true" />
  <el-drawer :model-value="items.length > 0" direction="btt" :size="HEIGHT" :with-header="false" :modal="false"
    modal-penetrable :lock-scroll="false" @close="emit('cancel')">
    <el-row justify="space-between" align="middle" :gutter="16">
      <el-space wrap :size="8">
        <el-text tag="b" size="large">{{ items.length }} seçildi:</el-text>
        <el-tag v-for="item in shown" :key="item.id" type="primary" size="large" closable disable-transitions
          @close="emit('deselect', item.id)">
          {{ item.name }}
        </el-tag>
        <el-text v-if="rest" type="info">ve {{ rest }} kişi daha</el-text>
      </el-space>
      <el-space :size="8">
        <el-text type="info" size="large">Bugün:</el-text>
        <el-button v-for="status in choices" :key="status" size="large" :type="STATUS_LOOKS[status].tone"
          @click="emit('choose', status)">
          {{ STATUS_LOOKS[status].label }}
        </el-button>
        <el-button size="large" @click="emit('cancel')">Vazgeç</el-button>
      </el-space>
    </el-row>
  </el-drawer>
</template>
