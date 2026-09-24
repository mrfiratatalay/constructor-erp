<script setup lang="ts">
import { watch } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { useSearch } from '@/core/search/useSearch'
import SearchResults from '@/mobile/organisms/SearchResults.vue'

/** "Bu şantiyede ara" (WhatsApp'taki sohbet içi arama): mesaja dokununca akış o mesaja gider. */
const show = defineModel<boolean>('show', { required: true })
const { siteId } = defineProps<{ siteId: string }>()
const emit = defineEmits<{ open: [postId: string] }>()
const search = useSearch([], () => siteId)
watch(show, (open) => !open && search.clear())

function open(post: PostView) {
  show.value = false
  emit('open', post.id)
}
</script>

<template>
  <van-popup v-model:show="show" position="top" teleport="body" class="site-search" safe-area-inset-top>
    <van-search v-model="search.text.value" placeholder="Bu şantiyede ara" autofocus show-action
      action-text="Kapat" @cancel="show = false" />
    <section v-if="search.isActive.value" class="site-search__results">
      <SearchResults :sites="[]" :posts="search.posts.value" :searching="search.isSearching.value"
        :show-site-name="false" @open-post="open" />
    </section>
  </van-popup>
</template>

<style scoped>
.site-search {
  max-height: 80dvh;
}

.site-search__results {
  display: grid;
  gap: var(--space-3);
  max-height: 70dvh;
  overflow-y: auto;
  padding-bottom: var(--space-4);
}
</style>
