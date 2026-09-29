<script setup lang="ts">
import { ArrowUpRight, Boxes, Clock3, Truck } from 'lucide-vue-next'
import type { MaterialSummary } from '@/core/api/generated/model'
import SummaryCard from '@/desktop/molecules/SummaryCard.vue'

/**
 * Özet kartları. Ton, torba ve m² tek sayıda toplanamaz: kartlar kalem, hareket ve kayıt sayar. Her kart tıklanır:
 * malzeme sayısı Stok sekmesini, gönderim ve dışarı verme listeyi bu aya süzer, beklenen iadeler iade listesini açar.
 */
const { summary } = defineProps<{ summary: MaterialSummary | undefined }>()
const emit = defineEmits<{ open: [key: 'materials' | 'toSite' | 'outbound' | 'returns'] }>()
</script>

<template>
  <el-row :gutter="16">
    <el-col :span="6">
      <SummaryCard title="Toplam Malzeme" :value="summary?.activeMaterials" unit="kalem" caption="Aktif malzeme çeşidi"
        :icon="Boxes" tone="site" @open="emit('open', 'materials')" />
    </el-col>
    <el-col :span="6">
      <SummaryCard title="Bu Ay Şantiyelere" :value="summary?.sentToSitesThisMonth" unit="hareket"
        caption="Şantiyelere giden malzeme" :icon="Truck" tone="used" @open="emit('open', 'toSite')" />
    </el-col>
    <el-col :span="6">
      <SummaryCard title="Dışarı Verilen" :value="summary?.outboundThisMonth" unit="hareket"
        caption="Bu ay firma dışı çıkış" :icon="ArrowUpRight" tone="out" @open="emit('open', 'outbound')" />
    </el-col>
    <el-col :span="6">
      <SummaryCard title="Beklenen İadeler" :value="summary?.awaitingReturns" unit="kayıt" :icon="Clock3" tone="return"
        :caption="summary?.overdueReturns ? `${summary.overdueReturns} tanesinin tarihi geçti` : 'Geri dönüşü beklenen'"
        :alert="!!summary?.overdueReturns" @open="emit('open', 'returns')" />
    </el-col>
  </el-row>
</template>
