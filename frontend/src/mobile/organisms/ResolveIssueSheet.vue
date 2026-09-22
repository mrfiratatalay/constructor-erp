<script setup lang="ts">
import { ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { useResolveIssue } from '@/core/issues/useIssues'

/** Açık sorunu kapatır; not isteğe bağlı ("Demir geldi, döküm yarın"). */
const post = defineModel<PostView | null>({ required: true })
const { resolve, isResolving } = useResolveIssue()
const note = ref('')

watch(post, () => (note.value = ''))

async function confirm() {
  if (!post.value) return
  try {
    await resolve(post.value.id, note.value.trim() || null)
    showSuccessToast('Sorun çözüldü')
    post.value = null
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup :show="post !== null" position="bottom" round closeable @close="post = null">
    <section class="resolve-sheet">
      <h2 class="resolve-sheet__title">Sorun çözüldü mü?</h2>
      <p class="resolve-sheet__site">{{ post?.site.name }}</p>
      <van-cell-group inset>
        <van-field v-model="note" type="textarea" rows="2" autosize maxlength="1000"
          placeholder="Nasıl çözüldü? (isteğe bağlı)" />
      </van-cell-group>
      <van-button type="success" block round :loading="isResolving" @click="confirm">Çözüldü olarak işaretle</van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.resolve-sheet {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.resolve-sheet__title {
  margin: 0;
  font-size: 18px;
}

.resolve-sheet__site {
  margin: 0;
  color: var(--text-muted);
}
</style>
