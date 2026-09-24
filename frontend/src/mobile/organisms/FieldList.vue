<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { showImagePreview } from 'vant'
import { Ellipsis } from 'lucide-vue-next'
import type { PostView, SiteView } from '@/core/api/generated/model'
import { dayDividerText } from '@/core/field/fieldDays'
import { fieldSummary } from '@/core/field/fieldSummary'
import { useFieldUpdates } from '@/core/field/useFieldUpdates'
import FieldActionSheet from '@/mobile/organisms/FieldActionSheet.vue'
import FieldDayTitle from '@/shared/molecules/FieldDayTitle.vue'
import FieldHero from '@/shared/molecules/FieldHero.vue'
import FieldEntry from '@/shared/organisms/FieldEntry.vue'
import QueuedFieldEntry from '@/shared/organisms/QueuedFieldEntry.vue'

/**
 * Şantiyenin Saha sekmesi: bir pano değil, görsel bir günlük. Üstte son saha fotoğrafı geniş, altında tek
 * akış: bugün en üstte, aşağı kaydırdıkça önceki günler gelir; her güncellemenin fotoğrafı kendi satırında.
 */
const { site } = defineProps<{ site: SiteView }>()
const { days, isEmpty, isLoading, hasMore, isLoadingMore, loadMore } = useFieldUpdates(() => site.id)
const summary = computed(() => fieldSummary(days.value, site.photoUrl ?? null))
const acting = ref<PostView | null>(null)

function openPhotos(urls: string[], index: number) {
  showImagePreview({ images: urls, startPosition: index, closeable: true })
}

/** Günlük bugünden başlar: sayfanın kaydırması sohbetten (dipten) kalmasın. */
onMounted(() => window.scrollTo({ top: 0 }))
</script>

<template>
  <FieldHero v-if="summary" :summary="summary" @open="(url) => openPhotos([url], 0)" />
  <van-skeleton v-if="isLoading" :row="6" />
  <van-empty v-else-if="isEmpty" image-size="72"
    description="Şantiyede bugün ne oldu? Aşağıya yaz, fotoğrafını ekle: herkes burada görür." />
  <van-list v-else :loading="isLoadingMore" :finished="!hasMore" finished-text=""
    loading-text="Önceki günler geliyor…" @load="loadMore()">
    <section v-for="(day, index) in days" :key="day.key" class="field-list__day">
      <FieldDayTitle :text="index === 0 ? day.title : dayDividerText(day)" :lead="index === 0" />
      <QueuedFieldEntry v-for="post in day.pending" :key="post.id" :post="post" />
      <FieldEntry v-for="post in day.entries" :key="post.id" :post="post" @open-photos="openPhotos">
        <template #menu>
          <button type="button" class="field-list__more" aria-label="Güncelleme işlemleri" @click="acting = post">
            <Ellipsis :size="18" />
          </button>
        </template>
      </FieldEntry>
    </section>
  </van-list>
  <FieldActionSheet v-model="acting" />
</template>

<style scoped>
.field-list__day {
  display: grid;
}

/* Parmakla rahat basılsın diye simgeden büyük; göze batmasın diye soluk. */
.field-list__more {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--text-subtle);
}
</style>
