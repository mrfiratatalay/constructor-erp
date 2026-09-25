<script setup lang="ts">
import type { Component } from 'vue'
import { MapPin, MessageCircle } from 'lucide-vue-next'
import { SITE_TABS, type SiteTab } from '@/core/sites/useSiteTab'

/** Şantiye başlığının altındaki iki sekme: Sohbet ve Saha. İçerik sekmelerin altında değil, sayfanın kendisinde. */
const { active } = defineProps<{ active: SiteTab }>()
const emit = defineEmits<{ change: [tab: SiteTab] }>()

const ICONS: Record<SiteTab, Component> = { chat: MessageCircle, field: MapPin }
</script>

<template>
  <van-tabs :active="active" class="site-tabs" @change="(name: string | number) => emit('change', name as SiteTab)">
    <van-tab v-for="item in SITE_TABS" :key="item.tab" :name="item.tab">
      <template #title>
        <span class="site-tabs__label"><component :is="ICONS[item.tab]" :size="16" />{{ item.label }}</span>
      </template>
    </van-tab>
  </van-tabs>
</template>

<style scoped>
.site-tabs {
  --van-tabs-line-height: var(--layout-subbar-height);
  --van-tabs-nav-background: transparent;
  --van-tab-font-size: var(--text-base);
  --van-tab-active-text-color: var(--brand-primary);
  --van-tabs-bottom-bar-width: 56px;
}

.site-tabs__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: var(--weight-semibold);
}
</style>
