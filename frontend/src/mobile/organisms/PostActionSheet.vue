<script setup lang="ts">
import { computed, ref } from 'vue'
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { useCurrentUser } from '@/core/auth/currentUser'
import { canChangeIssueFlag, canCorrect, canDelete } from '@/core/posts/postPermissions'
import { usePostActions } from '@/core/posts/usePostActions'

/**
 * Gönderiye uzun basınca alttan açılan menü (WhatsApp gibi): Düzelt ve Sil. Düzeltmede yalnızca yazı ve
 * "sorun" işareti değişir, gönderide "düzenlendi" izi kalır; silinenin yerinde "silindi" izi kalır.
 */
const post = defineModel<PostView | null>({ required: true })
const { data: user } = useCurrentUser()
const { correctPost, deletePost, isSaving } = usePostActions()
const correcting = ref<PostView | null>(null)
const body = ref('')
const issue = ref(false)

const actions = computed(() => {
  const target = post.value
  if (!target) return []
  const correct = canCorrect(target, user.value) ? [{ name: 'Düzelt', key: 'correct' }] : []
  const remove = canDelete(target, user.value) ? [{ name: 'Sil', key: 'delete', color: 'var(--status-danger)' }] : []
  return [...correct, ...remove]
})

function onSelect(action: { key: string }) {
  const target = post.value
  post.value = null
  if (!target) return
  if (action.key === 'correct') startCorrecting(target)
  else void confirmDelete(target)
}

function startCorrecting(target: PostView) {
  body.value = target.body ?? ''
  issue.value = target.issue
  correcting.value = target
}

async function saveCorrection() {
  if (!correcting.value) return
  try {
    await correctPost(correcting.value.id, body.value.trim() || null, issue.value)
    correcting.value = null
    showSuccessToast('Düzeltildi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

async function confirmDelete(target: PostView) {
  const confirmed = await showConfirmDialog({
    title: target.issue ? 'Sorun silinsin mi?' : 'Gönderi silinsin mi?',
    message: 'Yerinde "silindi" izi kalır; fotoğraf ve sesler kalıcı olarak silinir.',
    confirmButtonText: 'Sil',
    confirmButtonColor: 'var(--status-danger)',
    cancelButtonText: 'Vazgeç',
  }).then(() => true, () => false)
  if (!confirmed) return
  try {
    await deletePost(target.id)
    showSuccessToast('Silindi')
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-action-sheet :show="post !== null" :actions="actions" cancel-text="Vazgeç" teleport="body"
    @select="onSelect" @update:show="(open: boolean) => !open && (post = null)" />
  <van-popup :show="correcting !== null" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(open: boolean) => !open && (correcting = null)">
    <section class="correct-sheet">
      <h2 class="correct-sheet__title">Gönderiyi düzelt</h2>
      <van-cell-group inset class="correct-sheet__fields">
        <van-field v-model="body" type="textarea" rows="3" autosize maxlength="4000" placeholder="Yazı" />
        <van-cell center title="Bu bir sorun"
          :label="correcting && !canChangeIssueFlag(correcting) ? 'Çözülmüş sorunun işareti değişmez.' : undefined">
          <template #right-icon>
            <van-switch v-model="issue" :disabled="!correcting || !canChangeIssueFlag(correcting)" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-button type="primary" block round size="large" :loading="isSaving" @click="saveCorrection">
        Kaydet
      </van-button>
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
