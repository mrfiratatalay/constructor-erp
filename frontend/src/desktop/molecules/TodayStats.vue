<script setup lang="ts">
import { computed } from 'vue'
import { dayProgress, type DayCounts } from '@/core/puantaj/puantajBook'
import { STATUS_LOOKS, type DayStatus } from '@/core/puantaj/puantajLabels'
import MarkDot from '@/desktop/atoms/MarkDot.vue'

/**
 * Bugünün özeti, yalnızca gösterge (tıklanmaz; süzgeç listenin üstünde, kendi kontrolüyle durur). Solda geniş
 * "Bugünün yoklaması" kartı: halka kaçının işaretlendiğini gösterir ("2/6"), yanında kaçının beklediği yazar, bitince
 * yeşerir. Yanında dört durum kartı: sayı ve listedeki payı (kendi renginde çubuk). Izgara 8 + 4×4 = 24: kartlar eşit
 * genişlikte, eşit boyda.
 */
const { counts } = defineProps<{ counts: DayCounts }>()
const STATUSES = Object.keys(STATUS_LOOKS) as DayStatus[]
const FULL_HEIGHT = { height: '100%' }
const progress = computed(() => dayProgress(counts))
const complete = computed(() => progress.value.total > 0 && counts.unmarked === 0)
const shareOf = (value: number) => (progress.value.total ? Math.round((value / progress.value.total) * 100) : 0)
</script>

<template>
  <el-row :gutter="16">
    <el-col :span="8">
      <el-card shadow="never" :style="FULL_HEIGHT">
        <el-space :size="20">
          <!-- Renk açıkça verilir: verilmezse Element Plus kendi sabit mavisini (#20a0ff) çizer, temayı değil. -->
          <el-progress type="circle" :width="84" :stroke-width="8" :percentage="progress.percent"
            :color="complete ? 'var(--el-color-success)' : 'var(--el-color-primary)'">
            <el-text tag="b" size="large">{{ progress.marked }}/{{ progress.total }}</el-text>
          </el-progress>
          <el-space direction="vertical" alignment="flex-start" :size="4">
            <el-text tag="b" size="large">{{ complete ? 'Yoklama tamam' : 'Bugünün yoklaması' }}</el-text>
            <el-text :type="complete ? 'success' : 'info'">
              {{ complete ? 'Herkes işaretlendi' : `${counts.unmarked} kişi bekliyor` }}
            </el-text>
          </el-space>
        </el-space>
      </el-card>
    </el-col>
    <el-col v-for="status in STATUSES" :key="status" :span="4">
      <el-card shadow="never" :style="FULL_HEIGHT">
        <el-space direction="vertical" alignment="stretch" :size="12" style="width: 100%">
          <el-statistic :value="counts[status]">
            <template #title>
              <el-space :size="8"><MarkDot :mark="{ status }" />{{ STATUS_LOOKS[status].label }}</el-space>
            </template>
          </el-statistic>
          <el-progress :percentage="shareOf(counts[status])" :color="`var(--el-color-${STATUS_LOOKS[status].tone})`"
            :show-text="false" :stroke-width="6" />
        </el-space>
      </el-card>
    </el-col>
  </el-row>
</template>
