<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { HardHat } from 'lucide-vue-next'
import { useCurrentUser } from '@/core/auth/currentUser'
import { splitByAttention } from '@/core/today/attentionSites'
import { useToday } from '@/core/today/useToday'
import PushPromptCell from '@/mobile/organisms/PushPromptCell.vue'
import UploadQueueCells from '@/mobile/organisms/UploadQueueCells.vue'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
import SiteTodayCell from '@/mobile/organisms/SiteTodayCell.vue'
import TodayHero from '@/shared/organisms/TodayHero.vue'

const router = useRouter()
const { data: user } = useCurrentUser()
const { today, isLoading } = useToday()
const groups = computed(() => splitByAttention(today.value?.sites ?? []))
const open = (siteId: string) => router.push({ name: 'siteFeed', params: { siteId } })
</script>

<template>
  <main class="today">
    <TodayHero v-if="today && user" :name="user.fullName" :company="user.companyName" :date="today.date"
      :totals="today.totals" />
    <van-skeleton v-else :row="5" />
    <PushPromptCell message="Sahadan sorun gelince telefonuna hemen haber gelsin." />
    <UploadQueueCells />
    <template v-if="today">
      <section v-if="groups.attention.length" class="today__group">
        <SectionHeading title="Dikkat isteyen" :hint="`${groups.attention.length} şantiye`" />
        <van-cell-group inset>
          <SiteTodayCell v-for="site in groups.attention" :key="site.siteId" :site="site" @open="open" />
        </van-cell-group>
      </section>
      <section v-if="groups.calm.length" class="today__group">
        <SectionHeading title="Diğer şantiyeler" :hint="`${groups.calm.length} şantiye`" />
        <van-cell-group inset>
          <SiteTodayCell v-for="site in groups.calm" :key="site.siteId" :site="site" @open="open" />
        </van-cell-group>
      </section>
      <van-empty v-if="!today.sites.length && !isLoading"
        description="Aktif şantiye yok. Şantiyeler sayfasından ilk şantiyeni ekleyebilirsin.">
        <template #image><HardHat :size="48" class="today__empty-icon" /></template>
      </van-empty>
    </template>
  </main>
</template>

<style scoped>
.today {
  display: grid;
  gap: var(--space-5);
  align-content: start;
  padding: calc(var(--space-4) + env(safe-area-inset-top, 0px)) var(--space-4)
    calc(110px + env(safe-area-inset-bottom, 0px));
}

.today__group {
  display: grid;
  gap: var(--space-3);
}

.today__empty-icon {
  color: var(--text-subtle);
}
</style>
