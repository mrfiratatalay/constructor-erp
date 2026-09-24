<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import type { SiteView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { dayDividerText } from '@/core/field/fieldDays'
import { fieldMenu } from '@/core/field/fieldMenu'
import { fieldSummary } from '@/core/field/fieldSummary'
import { useFieldUpdates } from '@/core/field/useFieldUpdates'
import PostMenu from '@/desktop/molecules/PostMenu.vue'
import PostCorrectDialog from '@/desktop/organisms/PostCorrectDialog.vue'
import { useFieldMenuActions } from '@/desktop/postActions'
import FieldDayTitle from '@/shared/molecules/FieldDayTitle.vue'
import FieldHero from '@/shared/molecules/FieldHero.vue'
import FieldEntry from '@/shared/organisms/FieldEntry.vue'
import QueuedFieldEntry from '@/shared/organisms/QueuedFieldEntry.vue'

/**
 * Şantiyenin Saha sekmesi: bir pano değil, görsel bir günlük. Üstte son saha fotoğrafı geniş, altında tek
 * akış: bugün en üstte, aşağı indikçe önceki günler; her güncellemenin fotoğrafı kendi satırında.
 */
const { site } = defineProps<{ site: SiteView }>()
const { data: user } = useCurrentUser()
const { days, isEmpty, isLoading, hasMore, isLoadingMore, loadMore } = useFieldUpdates(() => site.id)
const { correcting, run } = useFieldMenuActions()
const summary = computed(() => fieldSummary(days.value, site.photoUrl ?? null))
const viewer = ref<{ urls: string[]; index: number } | null>(null)
const root = useTemplateRef<HTMLElement>('root')

/** Günlük bugünden başlar: panelin kaydırması sohbetten (dipten) kalmasın. Kayan öğe sağ panelin gövdesidir. */
onMounted(() => root.value?.closest('.el-scrollbar__wrap')?.scrollTo({ top: 0 }))
</script>

<template>
  <div ref="root" class="field-column">
    <FieldHero v-if="summary" :summary="summary" @open="(url) => (viewer = { urls: [url], index: 0 })" />
    <el-skeleton v-if="isLoading" :rows="6" animated />
    <el-empty v-else-if="isEmpty" :image-size="72" class="field-column__empty"
      description="Şantiyede bugün ne oldu? Aşağıya yaz, fotoğrafını ekle: herkes burada görür." />
    <section v-for="(day, index) in days" :key="day.key" class="field-column__day">
      <FieldDayTitle :text="index === 0 ? day.title : dayDividerText(day)" :lead="index === 0" />
      <QueuedFieldEntry v-for="post in day.pending" :key="post.id" :post="post" />
      <FieldEntry v-for="post in day.entries" :key="post.id" :post="post"
        @open-photos="(urls, start) => (viewer = { urls, index: start })">
        <template #menu>
          <PostMenu :items="fieldMenu(post, user)" @select="(action) => run(action, post)" />
        </template>
      </FieldEntry>
    </section>
    <el-button v-if="hasMore" class="field-column__more" :loading="isLoadingMore" @click="loadMore()">
      Önceki günler
    </el-button>
    <el-image-viewer v-if="viewer" :url-list="viewer.urls" :initial-index="viewer.index" teleported
      @close="viewer = null" />
    <PostCorrectDialog v-model="correcting" />
  </div>
</template>

<style scoped>
.field-column {
  display: grid;
  gap: var(--space-2);
}

.field-column__day {
  display: grid;
}

.field-column__empty {
  padding: var(--space-8) 0;
}

.field-column__more {
  justify-self: center;
  margin-top: var(--space-2);
}
</style>
