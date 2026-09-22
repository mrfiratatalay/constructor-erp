<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { clockTime } from '@/core/format/dates'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/** menu yuvası: masaüstünde saatin yanında ⋯ menüsü. Düzeltilen gönderide saatin altında "düzenlendi" izi. */
const { post, showSite } = defineProps<{ post: PostView; showSite: boolean }>()
const emit = defineEmits<{ openSite: [siteId: string] }>()
</script>

<template>
  <header class="post-header">
    <UserAvatar :name="post.author.fullName" />
    <div class="post-header__who">
      <p class="post-header__name">{{ post.author.fullName }}</p>
      <button v-if="showSite" class="post-header__site" type="button" @click="emit('openSite', post.site.id)">
        <MapPin :size="13" />{{ post.site.name }}
      </button>
    </div>
    <span class="post-header__when">
      <time :datetime="post.createdAt">{{ clockTime(post.createdAt) }}</time>
      <span v-if="post.editedAt" class="post-header__edited">düzenlendi</span>
    </span>
    <slot name="menu" />
  </header>
</template>

<style scoped>
.post-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.post-header__who {
  display: grid;
  flex: 1;
  gap: 3px;
  justify-items: start;
  min-width: 0;
}

.post-header__name {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
}

.post-header__site {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  padding: 3px 10px 3px 8px;
  border: 0;
  border-radius: 999px;
  background: var(--brand-tint);
  color: var(--brand-primary);
  font: inherit;
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-header__when {
  display: grid;
  align-self: flex-start;
  justify-items: end;
  color: var(--text-subtle);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
}

.post-header__edited {
  font-size: var(--text-xs);
  font-style: italic;
}
</style>
