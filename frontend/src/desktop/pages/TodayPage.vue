<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUser } from '@/core/auth/currentUser'
import { splitByAttention } from '@/core/today/attentionSites'
import { useToday } from '@/core/today/useToday'
import SectionHeading from '@/shared/molecules/SectionHeading.vue'
import PushPromptAlert from '@/desktop/organisms/PushPromptAlert.vue'
import SiteTodayCard from '@/desktop/organisms/SiteTodayCard.vue'
import TodayHero from '@/shared/organisms/TodayHero.vue'
import UploadQueueList from '@/desktop/organisms/UploadQueueList.vue'

const router = useRouter()
const { data: user } = useCurrentUser()
const { today, isLoading } = useToday()
const groups = computed(() => splitByAttention(today.value?.sites ?? []))
const open = (siteId: string) => router.push({ name: 'siteFeed', params: { siteId } })
</script>

<template>
  <div class="today">
    <TodayHero v-if="today && user" :name="user.fullName" :company="user.companyName" :date="today.date"
      :totals="today.totals" />
    <el-skeleton v-else :rows="5" animated />
    <PushPromptAlert message="Sahadan sorun gelince bu bilgisayara hemen bildirim gelsin." />
    <UploadQueueList />
    <template v-if="today">
      <section v-if="groups.attention.length" class="today__group">
        <SectionHeading title="Dikkat isteyen" :hint="`${groups.attention.length} şantiye`" />
        <div class="today__grid">
          <SiteTodayCard v-for="site in groups.attention" :key="site.siteId" :site="site" @open="open" />
        </div>
      </section>
      <section v-if="groups.calm.length" class="today__group">
        <SectionHeading title="Diğer şantiyeler" :hint="`${groups.calm.length} şantiye`" />
        <div class="today__grid">
          <SiteTodayCard v-for="site in groups.calm" :key="site.siteId" :site="site" @open="open" />
        </div>
      </section>
      <el-empty v-if="!today.sites.length && !isLoading"
        description="Aktif şantiye yok. Şantiyeler sayfasından ilk şantiyeni ekleyebilirsin." />
    </template>
  </div>
</template>

<style scoped>
.today {
  display: grid;
  gap: var(--space-6);
  align-content: start;
  max-width: 1180px;
}

.today__group {
  display: grid;
  gap: var(--space-4);
}

.today__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: var(--space-4);
}
</style>
