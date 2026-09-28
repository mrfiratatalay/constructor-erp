<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { PostView, ReturnDeliveryRequest } from '@/core/api/generated/model'
import { useDeliveryCard } from '@/core/tasks/useDeliveryCard'
import StatusTag from '@/desktop/atoms/StatusTag.vue'
import DeliveryReviewDialog from '@/desktop/organisms/DeliveryReviewDialog.vue'
import MarkablePhoto from '@/shared/molecules/MarkablePhoto.vue'

/**
 * Sohbetteki iş teslimi kartı (fotoğraflar baloncukta üstte). Teslim mesajında: iş, şantiye, kim, kaç fotoğraf,
 * durum; şef ya da patronda "İNCELE". Şefin cevabında: "Tamamlandı" ya da "İş tamamlanmadı" + eksik notu ve
 * noktalı fotoğraf; işin sorumlusunda "✅ İş Teslim Et" (eksiğini tamamlayıp yeniden teslim eder).
 */
const { post } = defineProps<{ post: PostView }>()
const emit = defineEmits<{ redeliver: [taskId: string] }>()
const { view, card, marked, approve, returnWith, isReviewing } = useDeliveryCard(() => post)
const reviewing = ref(false)

async function review(action: () => Promise<unknown>, done: string) {
  try {
    await action()
    reviewing.value = false
    ElMessage.success(done)
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}

const onApprove = () => review(approve, 'Onaylandı: iş tamamlandı.')
const onSendBack = (request: ReturnDeliveryRequest) => review(() => returnWith(request), 'Eksik çalışana gönderildi.')
</script>

<template>
  <el-space v-if="card && view" direction="vertical" alignment="flex-start" :size="4" class="delivery-card"
    data-testid="delivery-card">
    <el-text tag="b" size="large">{{ card.title }}</el-text>
    <el-text>{{ card.place }} · {{ card.task }}</el-text>
    <el-text v-for="line in card.lines" :key="line" type="info">{{ line }}</el-text>
    <MarkablePhoto v-if="card.showMark && marked?.url" :src="marked.thumbnailUrl ?? marked.url"
      :mark="view.mark ? { x: view.mark.x, y: view.mark.y } : null" class="delivery-card__mark" />
    <StatusTag v-if="card.status" :tone="card.status.tone">{{ card.status.label }}</StatusTag>
    <el-button v-if="card.action === 'review'" type="primary" @click="reviewing = true">İNCELE</el-button>
    <el-button v-else-if="card.action === 'redeliver'" type="success" @click="emit('redeliver', view.taskId)">
      ✅ İş Teslim Et
    </el-button>
    <DeliveryReviewDialog v-if="card.action === 'review'" v-model:show="reviewing" :delivery="view"
      :busy="isReviewing" @approve="onApprove" @send-back="onSendBack" />
  </el-space>
</template>

<style scoped>
.delivery-card {
  min-width: 240px;
  padding: var(--space-1) 0;
}

.delivery-card__mark {
  width: 240px;
}
</style>
