<script setup lang="ts">
import { computed } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { timeAgo } from '@/core/format/dates'
import { issueAge } from '@/core/issues/issueAge'
import { postPreview } from '@/core/posts/postPreview'
import ListRow from '@/desktop/molecules/ListRow.vue'

/**
 * Sorun kuyruğu. Açık sorunda yaş, satırın sol şeridini boyar (dün amber, 2+ gün kırmızı): hiçbir şey
 * yapılmazsa liste kendiliğinden kızarır. Çözülende şerit yok, "çözüldü · ne zaman" yazar.
 */
const { issues, selectedId, resolved = false } = defineProps<{
  issues: PostView[]
  selectedId: string | null
  resolved?: boolean
}>()
const emit = defineEmits<{ select: [postId: string] }>()

const rows = computed(() =>
  issues.map((post) => {
    const age = issueAge(post.createdAt)
    const tone = !resolved && (age.tone === 'warning' || age.tone === 'danger') ? age.tone : undefined
    const when = resolved && post.resolution ? `Çözüldü · ${timeAgo(post.resolution.resolvedAt)}` : age.label
    return { post, tone, when, preview: postPreview(post) }
  }),
)
</script>

<template>
  <ListRow v-for="{ post, tone, when, preview } in rows" :key="post.id" :tone="tone"
    :selected="post.id === selectedId" @select="emit('select', post.id)">
    <template #title>{{ post.site.name }}</template>
    <template #meta>
      <span :class="tone && `issue-list__age--${tone}`">{{ when }}</span>
    </template>
    <span class="issue-list__preview">{{ preview }}</span>
  </ListRow>
</template>

<style scoped>
.issue-list__age--warning {
  color: var(--status-warning);
  font-weight: var(--weight-semibold);
}

.issue-list__age--danger {
  color: var(--status-danger);
  font-weight: var(--weight-semibold);
}

.issue-list__preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
