<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import { useSearch } from '@/core/search/useSearch'
import SearchResults from '@/desktop/organisms/SearchResults.vue'

/** "Bu şantiyede ara", WhatsApp Masaüstü'ndeki gibi sağ panelde; mesaja tıklayınca akış o mesaja gider. */
const { siteId } = defineProps<{ siteId: string }>()
const emit = defineEmits<{ open: [postId: string]; close: [] }>()
const search = useSearch([], () => siteId)
</script>

<template>
  <aside class="search-panel">
    <header class="search-panel__bar">
      <el-button text circle aria-label="Kapat" @click="emit('close')"><X :size="18" /></el-button>
      <strong>Mesaj ara</strong>
    </header>
    <div class="search-panel__field">
      <el-input v-model="search.text.value" placeholder="Bu şantiyede ara" clearable autofocus>
        <template #prefix><Search :size="16" /></template>
      </el-input>
    </div>
    <el-scrollbar class="search-panel__body">
      <SearchResults v-if="search.isActive.value" :sites="[]" :posts="search.posts.value"
        :searching="search.isSearching.value" :show-site-name="false" @open-post="(post) => emit('open', post.id)" />
    </el-scrollbar>
  </aside>
</template>

<style scoped>
.search-panel {
  display: flex;
  flex-direction: column;
  width: var(--layout-info-width);
  min-height: 0;
  border-left: 1px solid var(--border-soft);
  background: var(--surface);
}

.search-panel__bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-soft);
}

.search-panel__field {
  padding: var(--space-3) var(--space-4);
}

.search-panel__body {
  flex: 1;
  min-height: 0;
}
</style>
