<script setup lang="ts">
import { ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { PostView, ReturnDeliveryRequest } from '@/core/api/generated/model'
import { useDeliveryCard } from '@/core/tasks/useDeliveryCard'
import StatusTag from '@/mobile/atoms/StatusTag.vue'
import DeliveryReviewSheet from '@/mobile/organisms/DeliveryReviewSheet.vue'
import MarkablePhoto from '@/shared/molecules/MarkablePhoto.vue'

/**
 * Sohbetteki iş teslimi kartı (fotoğraflar baloncukta üstte). Teslim mesajında: iş, şantiye, kim, kaç fotoğraf,
 * durum; şef ya da patronda büyük "İNCELE". Şefin cevabında: "Tamamlandı" ya da "İş tamamlanmadı" + eksik notu ve
 * noktalı fotoğraf; işin sorumlusunda "✅ İş Teslim Et" (eksiğini tamamlayıp yeniden teslim eder). Teslimin
 * ayrıntısı gelene kadar (internet yavaş ya da istek düştü) mesajın kendi yazısı görünür: baloncuk boş kalmaz.
 */
const { post } = defineProps<{ post: PostView }>()
const emit = defineEmits<{ redeliver: [taskId: string] }>()
const { view, card, marked, approve, returnWith, isReviewing } = useDeliveryCard(() => post)
const reviewing = ref(false)

async function review(action: () => Promise<unknown>, done: string) {
  try {
    await action()
    reviewing.value = false
    showSuccessToast(done)
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}

const onApprove = () => review(approve, 'Onaylandı')
const onSendBack = (request: ReturnDeliveryRequest) => review(() => returnWith(request), 'Eksik gönderildi')
</script>

<template>
  <van-space v-if="card && view" direction="vertical" :size="4" class="delivery-card" data-testid="delivery-card">
    <strong>{{ card.title }}</strong>
    <span v-for="line in card.lines" :key="line" class="delivery-card__line">{{ line }}</span>
    <MarkablePhoto v-if="card.showMark && marked?.url" :src="marked.thumbnailUrl ?? marked.url"
      :mark="view.mark ? { x: view.mark.x, y: view.mark.y } : null" />
    <StatusTag v-if="card.status" :tone="card.status.tone">{{ card.status.label }}</StatusTag>
    <van-button v-if="card.action === 'review'" type="primary" block round @click="reviewing = true">
      İNCELE
    </van-button>
    <van-button v-else-if="card.action === 'redeliver'" type="success" block round
      @click="emit('redeliver', view.taskId)">
      ✅ İş Teslim Et
    </van-button>
    <DeliveryReviewSheet v-if="card.action === 'review'" v-model:show="reviewing" :delivery="view"
      :busy="isReviewing" @approve="onApprove" @send-back="onSendBack" />
  </van-space>
  <span v-else>{{ post.body }}</span>
</template>

<style scoped>
.delivery-card {
  width: min(250px, 100%);
  padding: var(--space-1) 0;
}

.delivery-card__line {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
