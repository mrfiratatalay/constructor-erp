<script setup lang="ts">
import { computed } from 'vue'
import { Camera, HardHat, MessageSquareText } from 'lucide-vue-next'
import type { SiteToday } from '@/core/api/generated/model'
import { leadNames } from '@/core/sites/siteNames'
import { siteTodayStatus } from '@/core/today/siteTodayStatus'
import StatusTag from '@/mobile/atoms/StatusTag.vue'

/** Telefonda şantiye listesi: Vant hücresi; solda son fotoğraf, sağda gidiş oku. */
const { site } = defineProps<{ site: SiteToday }>()
const emit = defineEmits<{ open: [siteId: string] }>()
const status = computed(() => siteTodayStatus(site))
</script>

<template>
  <van-cell is-link center @click="emit('open', site.siteId)">
    <template #icon>
      <span class="site-cell__photo">
        <img v-if="site.latestPhotoUrl" :src="site.latestPhotoUrl" alt="" loading="lazy" />
        <HardHat v-else :size="22" />
      </span>
    </template>
    <template #title>
      <span class="site-cell__head">
        <span class="site-cell__name">{{ site.name }}</span>
        <StatusTag :tone="status.tone">{{ status.label }}</StatusTag>
      </span>
    </template>
    <template #label>
      <span class="site-cell__leads">{{ leadNames(site.leads) }}</span>
      <span class="site-cell__counts">
        <span><MessageSquareText :size="13" />{{ site.postsToday }}</span>
        <span><Camera :size="13" />{{ site.photosToday }}</span>
      </span>
    </template>
  </van-cell>
</template>

<style scoped>
.site-cell__photo {
  display: grid;
  place-items: center;
  flex: none;
  overflow: hidden;
  width: 52px;
  height: 52px;
  margin-right: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--surface-muted);
  color: var(--text-subtle);
}

.site-cell__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.site-cell__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.site-cell__name {
  font-weight: var(--weight-bold);
}

.site-cell__leads {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-cell__counts {
  display: flex;
  gap: var(--space-4);
  margin-top: 2px;
  font-variant-numeric: tabular-nums;
}

.site-cell__counts span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
