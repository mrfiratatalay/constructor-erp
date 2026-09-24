<script setup lang="ts">
import { ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { usePostActions } from '@/core/posts/usePostActions'

/** Mesajı düzelt: yalnızca yazı değişir, baloncukta "düzenlendi" izi kalır. */
const post = defineModel<PostView | null>({ required: true })
const { correctPost, isSaving } = usePostActions()
const body = ref('')
watch(post, (target) => (body.value = target?.body ?? ''))

async function save() {
  if (!post.value) return
  try {
    await correctPost(post.value, body.value.trim() || null)
    post.value = null
    showSuccessToast('Düzeltildi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup :show="post !== null" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(open: boolean) => !open && (post = null)">
    <section class="correct-sheet">
      <h2 class="correct-sheet__title">Mesajı düzelt</h2>
      <van-cell-group inset class="correct-sheet__fields">
        <van-field v-model="body" type="textarea" rows="3" autosize maxlength="4000" placeholder="Yazı" />
      </van-cell-group>
      <van-button type="primary" block round size="large" :loading="isSaving" @click="save">Kaydet</van-button>
    </section>
  </van-popup>
</template>

<style scoped>
.correct-sheet {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-4) var(--space-4);
}

.correct-sheet__title {
  margin: 0;
  padding-right: var(--space-8);
  font-size: var(--text-lg);
}

/* Beyaz pencerede beyaz grup kaybolmasın: alanlar hafif zeminli bir blok. */
.correct-sheet__fields {
  --van-cell-background: var(--surface-muted);
}
</style>
