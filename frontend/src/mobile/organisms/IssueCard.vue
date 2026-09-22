<script setup lang="ts">
import { computed } from 'vue'
import { Phone } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { telHref } from '@/core/format/phone'
import { issueAge } from '@/core/issues/issueAge'
import PostMedia from '@/shared/molecules/PostMedia.vue'

/**
 * Sorunlar ekranındaki kart. Burada her şey zaten sorun; ayırt edici olan yaştır:
 * sol şerit ve yaş etiketi yaşa göre renklenir. Kişi kendi bildirdiği sorunda kendini aramaz.
 */
const { post, viewerId } = defineProps<{ post: PostView; viewerId?: string }>()
const emit = defineEmits<{
  resolve: [post: PostView]
  openSite: [siteId: string]
  openPhotos: [urls: string[], index: number]
}>()

const age = computed(() => issueAge(post.createdAt))
const phone = computed(() => (post.author.id === viewerId ? null : post.author.phone))
</script>

<template>
  <van-cell-group inset :class="['issue-card', `issue-card--${age.tone}`]">
    <van-cell :title="age.label" :label="`${post.site.name} · ${post.author.fullName}`" is-link :border="false"
      title-class="issue-card__age" @click="emit('openSite', post.site.id)" />
    <div class="issue-card__content">
      <p v-if="post.body" class="issue-card__body">{{ post.body }}</p>
      <PostMedia :media="post.media" @open-photos="(urls, index) => emit('openPhotos', urls, index)" />
    </div>
    <div class="issue-card__actions" :class="{ 'issue-card__actions--single': !phone }">
      <van-button type="success" plain round block @click="emit('resolve', post)">Çözüldü</van-button>
      <van-button v-if="phone" round block tag="a" :href="telHref(phone)">
        <Phone :size="16" class="issue-card__icon" />Ara
      </van-button>
    </div>
  </van-cell-group>
</template>

<style scoped>
/* Arka plan kenarlığın altına da uzanır: nötr şerit görünmez, amber ve kırmızı belirir. */
.issue-card {
  border-left: 4px solid transparent;
}

.issue-card--warning {
  border-left-color: var(--status-warning);
}

.issue-card--danger {
  border-left-color: var(--status-danger);
}

.issue-card :deep(.issue-card__age) {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-muted);
}

.issue-card--warning :deep(.issue-card__age) {
  color: var(--status-warning);
}

.issue-card--danger :deep(.issue-card__age) {
  color: var(--status-danger);
}

.issue-card__content {
  display: grid;
  gap: var(--space-3);
  padding: 0 var(--space-4) var(--space-3);
}

.issue-card__body {
  margin: 0;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.issue-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  padding: 0 var(--space-4) var(--space-4);
}

.issue-card__actions--single {
  grid-template-columns: 1fr;
}

.issue-card__icon {
  margin-right: 6px;
  vertical-align: -3px;
}
</style>
