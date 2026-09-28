<script setup lang="ts">
import { computed } from 'vue'
import { CalendarOff, CircleCheck, CircleDashed, CircleX } from 'lucide-vue-next'
import type { DayCounts } from '@/core/puantaj/puantajBook'

/**
 * Bugünün özeti, dört kart. "İşaretlenmedi" eyleme dönüşen sayıdır: sıfıra inince yoklama kendiliğinden tamamdır.
 * Yarım gün "Geldi" kartında yazar. Sayıya ekipler de girer (ekip tek kalemdir).
 */
const { counts, complete } = defineProps<{ counts: DayCounts; complete: boolean }>()

const cards = computed(() => [
  {
    key: 'present',
    title: 'Geldi',
    value: counts.PRESENT,
    icon: CircleCheck,
    color: 'var(--el-color-success)',
    note: counts.HALF_DAY ? `Ayrıca ${counts.HALF_DAY} yarım gün` : 'Tam gün',
  },
  { key: 'absent', title: 'Gelmedi', value: counts.ABSENT, icon: CircleX, color: 'var(--el-color-danger)',
    note: 'Bugün sahada yok' },
  { key: 'leave', title: 'İzinli', value: counts.LEAVE, icon: CalendarOff, color: 'var(--el-color-primary)',
    note: 'Bilinen, onaylı yokluk' },
  {
    key: 'unmarked',
    title: 'İşaretlenmedi',
    value: counts.unmarked,
    icon: CircleDashed,
    color: 'var(--el-color-info)',
    note: complete ? 'Bugünün yoklaması tamam' : 'Şefin işaretlemesi bekleniyor',
  },
])
</script>

<template>
  <el-row :gutter="16">
    <el-col v-for="card in cards" :key="card.key" :span="6">
      <el-card shadow="never">
        <el-statistic :value="card.value">
          <template #title>
            <el-space :size="6">
              <el-icon :color="card.color" :size="16"><component :is="card.icon" /></el-icon>{{ card.title }}
            </el-space>
          </template>
        </el-statistic>
        <el-text :type="card.key === 'unmarked' && complete ? 'success' : 'info'" size="small">{{ card.note }}</el-text>
      </el-card>
    </el-col>
  </el-row>
</template>
