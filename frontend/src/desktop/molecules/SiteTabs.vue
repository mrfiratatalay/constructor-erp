<script setup lang="ts">
import type { Component } from 'vue'
import type { TabPaneName } from 'element-plus'
import { MapPin, MessageCircle } from 'lucide-vue-next'
import { SITE_TABS, type SiteTab } from '@/core/sites/useSiteTab'

/**
 * Şantiye başlığının altındaki iki sekme: Sohbet ve Saha. İçerik sekmelerin altında değil, panelin gövdesinde.
 * Başlık satırına çıkmaz, kendi ince satırında durur: bilgi paneli açıkken başlıkta ad, 🔍, 📞 ve ⋮'ye ancak yer
 * kalıyor; sekmeler oraya sıkışsa ad kısalırdı.
 */
const { active } = defineProps<{ active: SiteTab }>()
const emit = defineEmits<{ change: [tab: SiteTab] }>()

const ICONS: Record<SiteTab, Component> = { chat: MessageCircle, field: MapPin }
</script>

<template>
  <el-tabs :model-value="active" class="site-tabs" @tab-change="(name: TabPaneName) => emit('change', name as SiteTab)">
    <el-tab-pane v-for="item in SITE_TABS" :key="item.tab" :name="item.tab">
      <template #label>
        <span class="site-tabs__label"><component :is="ICONS[item.tab]" :size="16" />{{ item.label }}</span>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
/* Çizgi panelin kendi alt kenarıdır; sekmelerin ikinci çizgisi ve boş içerik alanı gösterilmez. */
.site-tabs :deep(.el-tabs__header) {
  margin: 0;
}

.site-tabs :deep(.el-tabs__nav-wrap::after),
.site-tabs :deep(.el-tabs__content) {
  display: none;
}

.site-tabs :deep(.el-tabs__item) {
  height: 40px;
  padding: 0 var(--space-5);
  font-weight: var(--weight-semibold);
}

.site-tabs__label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
