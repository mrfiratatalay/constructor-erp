<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ClipboardCheck } from 'lucide-vue-next'
import { useGetAttendanceOverview } from '@/core/api/generated/attendance/attendance'
import { todayLine } from '@/core/attendance/attendanceSummary'
import { dayTitle, todayIsoDate } from '@/core/format/dates'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Yoklama geçmişi (Yoklama ekranındaki "Geçmiş"): şantiyeler ve BUGÜNÜN durumu ("Bugün 10 geldi · 2 gelmedi ·
 * 0 izinli"; alınmadıysa son yoklama günü). Gelmeyen varsa sağda kırmızı etiketle görünür. Şantiyeye dokununca ay ay
 * geçmişi açılır.
 */
const router = useRouter()
const { data: sites, isLoading } = useGetAttendanceOverview()
const open = (siteId: string) => router.push({ name: 'siteAttendance', params: { siteId } })
</script>

<template>
  <MobilePage title="Yoklama geçmişi" :subtitle="dayTitle(todayIsoDate())" back>
    <van-skeleton v-if="isLoading" :row="5" />
    <van-cell-group v-else-if="sites?.length" inset>
      <van-cell v-for="site in sites" :key="site.siteId" :title="site.siteName" :label="todayLine(site) || undefined"
        center is-link @click="open(site.siteId)">
        <template #value>
          <StatusTag v-if="site.today?.absent" tone="danger">{{ site.today.absent }} gelmedi</StatusTag>
          <span v-else>{{ site.workerCount }} personel</span>
        </template>
      </van-cell>
    </van-cell-group>
    <van-empty v-else description="Henüz şantiye yok.">
      <template #image><ClipboardCheck :size="48" class="attendance__empty-icon" /></template>
    </van-empty>
  </MobilePage>
</template>

<style scoped>
.attendance__empty-icon {
  color: var(--text-subtle);
}
</style>
