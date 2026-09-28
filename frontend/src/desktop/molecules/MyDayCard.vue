<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Copy } from 'lucide-vue-next'
import type { MyDayView } from '@/core/api/generated/model'
import { dateTime, dayTitle } from '@/core/format/dates'
import { formatPhone } from '@/core/format/phone'
import { hoursText } from '@/core/puantaj/puantajLabels'
import MarkTag from '@/desktop/atoms/MarkTag.vue'

/**
 * Puantajım'da seçili günün kaydı: durum, mesai ve kimin ne zaman yazdığı. Yanlışsa işaretleyen aranır; bilgisayar
 * telefon edemediği için numarası yazar ve kopyalanır (başlıktaki 📞 gibi). Şefin notu görünmez.
 */
const { day, mark = undefined } = defineProps<{ day: string; mark?: MyDayView }>()

async function copy(phone: string) {
  const copied = await navigator.clipboard?.writeText(phone).then(() => true, () => false)
  if (copied) ElMessage.success('Numara kopyalandı')
  else ElMessage.error('Kopyalanamadı')
}
</script>

<template>
  <el-card shadow="never">
    <template #header><b>{{ dayTitle(day) }}</b></template>
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Durum">
        <MarkTag v-if="mark" :mark="mark" />
        <el-text v-else type="info">İşaretlenmedi</el-text>
      </el-descriptions-item>
      <el-descriptions-item v-if="mark?.overtimeHours" label="Mesai">
        {{ hoursText(mark.overtimeHours) }} saat
      </el-descriptions-item>
      <el-descriptions-item v-if="mark" label="İşaretleyen">
        {{ mark.markedByName }} · {{ dateTime(mark.markedAt) }}
      </el-descriptions-item>
      <el-descriptions-item v-if="mark?.markedByPhone" label="Numarası">
        <el-space :size="8">
          {{ formatPhone(mark.markedByPhone) }}
          <el-button text size="small" :icon="Copy" @click="copy(mark.markedByPhone)">Kopyala</el-button>
        </el-space>
      </el-descriptions-item>
    </el-descriptions>
    <el-text type="info" size="small">
      {{ mark ? 'Yanlışsa işaretleyeni ara; o gün hatırlıyordur.' : 'Şefin işaretleyince burada görünür.' }}
    </el-text>
  </el-card>
</template>
