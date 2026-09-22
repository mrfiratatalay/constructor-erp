<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CircleCheck, Phone } from 'lucide-vue-next'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { dateTime } from '@/core/format/dates'
import { telHref } from '@/core/format/phone'
import { issueAge } from '@/core/issues/issueAge'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import { useResolvePrompt } from '@/desktop/resolvePrompt'
import IssueFooter from '@/shared/molecules/IssueFooter.vue'
import PostMedia from '@/shared/molecules/PostMedia.vue'

/**
 * Sağ panelde seçili sorun: yaşı, şantiyesi (şantiyeye götürür), bildiren ve 📞; tam metin ve büyük
 * fotoğraflar; altta tek büyük "Çözüldü". Çözülünce resolved yayar: kuyruk sıradakine geçer.
 */
const { post } = defineProps<{ post: PostView }>()
const emit = defineEmits<{ resolved: [post: PostView] }>()
const router = useRouter()
const { data: user } = useCurrentUser()
const promptResolve = useResolvePrompt()
const viewer = ref<{ urls: string[]; index: number } | null>(null)
const age = computed(() => issueAge(post.createdAt))
/** Kişi kendi bildirdiği sorunda kendini aramaz. */
const phone = computed(() => (post.author.id === user.value?.id ? null : post.author.phone))

async function resolve() {
  if (await promptResolve(post)) emit('resolved', post)
}
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="issue-detail__head">
        <span class="issue-detail__who">
          <span :class="['issue-detail__age', `issue-detail__age--${age.tone}`]">
            {{ post.resolution ? `Bildirildi ${dateTime(post.createdAt)}` : age.label }}
          </span>
          <span>
            <el-link type="primary" @click="router.push({ name: 'siteFeed', params: { siteId: post.site.id } })">
              {{ post.site.name }}
            </el-link>
            · {{ post.author.fullName }}
          </span>
        </span>
        <el-button v-if="phone" tag="a" :href="telHref(phone)" class="issue-detail__call">
          <Phone :size="15" class="issue-detail__icon" />{{ phone }}
        </el-button>
      </div>
    </template>
    <p v-if="post.body" class="issue-detail__body">{{ post.body }}</p>
    <PostMedia :media="post.media" @open-photos="(urls, index) => (viewer = { urls, index })" />
    <IssueFooter :post="post" />
    <template v-if="!post.resolution" #footer>
      <el-button type="success" size="large" class="issue-detail__resolve" @click="resolve">
        <CircleCheck :size="18" class="issue-detail__icon" />Çözüldü
      </el-button>
    </template>
  </DetailPane>
  <el-image-viewer v-if="viewer" :url-list="viewer.urls" :initial-index="viewer.index" teleported
    @close="viewer = null" />
</template>

<style scoped>
.issue-detail__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.issue-detail__who {
  display: grid;
  flex: 1;
  gap: 2px;
  min-width: 0;
  color: var(--text-muted);
}

.issue-detail__who :deep(.el-link) {
  vertical-align: baseline;
  font-weight: var(--weight-bold);
}

.issue-detail__age {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.issue-detail__age--warning {
  color: var(--status-warning);
}

.issue-detail__age--danger {
  color: var(--status-danger);
}

.issue-detail__body {
  margin: 0;
  font-size: var(--text-md);
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.issue-detail__icon {
  margin-right: 6px;
}

.issue-detail__call {
  text-decoration: none;
}

.issue-detail__resolve {
  width: 100%;
}
</style>
