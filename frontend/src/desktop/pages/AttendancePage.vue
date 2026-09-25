<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGetAttendanceOverview } from '@/core/api/generated/attendance/attendance'
import { todayLine } from '@/core/attendance/attendanceSummary'
import { useCurrentUser } from '@/core/auth/currentUser'
import { dayTitle, todayIsoDate } from '@/core/format/dates'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import ListHeader from '@/desktop/molecules/ListHeader.vue'
import ListRow from '@/desktop/molecules/ListRow.vue'
import WelcomePane from '@/desktop/molecules/WelcomePane.vue'
import SiteAttendancePanel from '@/desktop/organisms/SiteAttendancePanel.vue'
import WorkerAttendancePanel from '@/desktop/organisms/WorkerAttendancePanel.vue'
import SplitView from '@/desktop/templates/SplitView.vue'

/**
 * Yoklama (sol menüde Şantiyeler'in altında), Şantiyeler ekranıyla aynı kalıp: solda şantiyeler ve BUGÜNÜN
 * durumu, sağda seçili şantiyenin geçmişi ya da bir personelin ayı. /yoklama, /yoklama/:siteId ve
 * /yoklama/:siteId/personel/:workerId aynı sayfadır: liste yerinde kalır, yalnızca sağ taraf değişir.
 */
const route = useRoute()
const { data: user } = useCurrentUser()
const { data: sites, isLoading } = useGetAttendanceOverview()
const siteId = computed(() => (route.params.siteId ? String(route.params.siteId) : null))
const workerId = computed(() => (route.params.workerId ? String(route.params.workerId) : null))
const selected = computed(() => sites.value?.find((site) => site.siteId === siteId.value) ?? null)
</script>

<template>
  <SplitView>
    <template #list-header>
      <ListHeader title="Yoklama" :meta="dayTitle(todayIsoDate())" />
    </template>
    <template #list>
      <el-skeleton v-if="isLoading" :rows="6" animated class="attendance-page__skeleton" />
      <ListRow v-for="site in sites" :key="site.siteId" :to="{ name: 'siteAttendance', params: { siteId: site.siteId } }"
        :selected="site.siteId === siteId">
        <template #title>{{ site.siteName }}</template>
        <template #meta>
          <StatusTag v-if="site.today?.absent" tone="danger">{{ site.today.absent }} gelmedi</StatusTag>
          <span v-else>{{ site.workerCount }} personel</span>
        </template>
        <template v-if="todayLine(site)">{{ todayLine(site) }}</template>
      </ListRow>
      <el-empty v-if="sites && !sites.length" :image-size="72" description="Henüz şantiye yok." />
    </template>
    <template #detail>
      <WorkerAttendancePanel v-if="siteId && workerId" :key="workerId" :site-id="siteId" :worker-id="workerId" />
      <SiteAttendancePanel v-else-if="selected" :key="selected.siteId" :site-id="selected.siteId"
        :site-name="selected.siteName" />
      <WelcomePane v-else :company-name="user?.companyName" />
    </template>
  </SplitView>
</template>

<style scoped>
.attendance-page__skeleton {
  padding: var(--space-4);
}
</style>
