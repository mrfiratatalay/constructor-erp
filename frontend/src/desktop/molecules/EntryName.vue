<script setup lang="ts">
import { computed } from 'vue'
import { Users } from 'lucide-vue-next'
import type { RosterEntryView } from '@/core/api/generated/model'
import { entrySubtitle, entryTitle } from '@/core/puantaj/puantajLabels'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Satırın kişisi: avatar, kalın ad, altında gri görev. Ekip kare, ikonlu avatarla ayrışır. Ada tıklayınca kişinin
 * ya da ekibin ayı açılır. Listeden çıkmış kalem yalnızca geçmiş günleri için görünür; altında bu yazar.
 */
const { entry } = defineProps<{ entry: RosterEntryView }>()
const emit = defineEmits<{ open: [] }>()
const subtitle = computed(() => (entry.archived ? 'Listeden çıktı' : entrySubtitle(entry)))
</script>

<template>
  <el-space :size="12" class="entry-name">
    <el-avatar v-if="entry.kind === 'CREW'" shape="square" :size="36"><Users :size="18" /></el-avatar>
    <UserAvatar v-else :name="entry.name" :size="36" />
    <el-space direction="vertical" alignment="flex-start" :size="0">
      <el-link underline="never" class="entry-name__link" :title="entryTitle(entry)" @click="emit('open')">
        <b>{{ entryTitle(entry) }}</b>
      </el-link>
      <el-text v-if="subtitle" type="info" size="small">{{ subtitle }}</el-text>
    </el-space>
  </el-space>
</template>

<style scoped>
/* Ad sütunu dardır (200 px): çok uzun ad satırı beş satıra şişirmesin, en fazla iki satır; tamamı title'da. */
.entry-name__link :deep(.el-link__inner) {
  min-width: 0;
}

.entry-name__link b {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow-wrap: anywhere;
}
</style>
