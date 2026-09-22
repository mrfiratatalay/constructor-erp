<script setup lang="ts">
import { computed } from 'vue'
import { Camera, HardHat, MessageSquareText } from 'lucide-vue-next'
import type { SiteToday } from '@/core/api/generated/model'
import { leadNames } from '@/core/sites/siteNames'
import { siteTodayStatus } from '@/core/today/siteTodayStatus'
import StatusTag from '@/desktop/atoms/StatusTag.vue'

/** Bilgisayarda şantiye ızgarası: üstte son fotoğraf, altında günün özeti. */
const { site } = defineProps<{ site: SiteToday }>()
const emit = defineEmits<{ open: [siteId: string] }>()
const status = computed(() => siteTodayStatus(site))
</script>

<template>
  <el-card class="site-card" shadow="hover" :body-style="{ padding: '0' }" @click="emit('open', site.siteId)">
    <div class="site-card__photo">
      <img v-if="site.latestPhotoUrl" :src="site.latestPhotoUrl" alt="" loading="lazy" />
      <HardHat v-else :size="30" />
    </div>
    <div class="site-card__body">
      <div class="site-card__head">
        <span class="site-card__name">{{ site.name }}</span>
        <StatusTag :tone="status.tone">{{ status.label }}</StatusTag>
      </div>
      <p class="site-card__leads">{{ leadNames(site.leads) }}</p>
      <p class="site-card__counts">
        <span><MessageSquareText :size="14" />{{ site.postsToday }}</span>
        <span><Camera :size="14" />{{ site.photosToday }}</span>
      </p>
    </div>
  </el-card>
</template>

<style scoped>
.site-card {
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s;
}

.site-card:hover {
  transform: translateY(-2px);
}

.site-card__photo {
  display: grid;
  place-items: center;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  background: var(--surface-muted);
  color: var(--text-subtle);
}

.site-card__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.site-card__body {
  display: grid;
  gap: 6px;
  justify-items: start;
  padding: var(--space-4);
}

.site-card__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.site-card__name {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  letter-spacing: -0.01em;
}

.site-card__leads,
.site-card__counts {
  margin: 0;
  max-width: 100%;
  overflow: hidden;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-card__counts {
  display: flex;
  gap: var(--space-4);
  font-variant-numeric: tabular-nums;
}

.site-card__counts span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
</style>
