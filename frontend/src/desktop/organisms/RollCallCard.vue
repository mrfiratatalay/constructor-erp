<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ClipboardCheck } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { PostView } from '@/core/api/generated/model'
import { useRollCallCard } from '@/core/rollcall/useRollCallCard'

/**
 * Sohbetteki yoklama mesajının kartı (WhatsApp'taki anket gibi): gün, kaç kişi katıldı ve "Yoklamaya Katıl".
 * Katılan kendi saatini görür; patron yoklamada sayılmaz, düğme yerine "Yoklamayı gör" ile Yoklama'ya geçer.
 */
const { post } = defineProps<{ post: PostView }>()
const router = useRouter()
const { card, join, isJoining } = useRollCallCard(() => post)

async function onJoin() {
  try {
    await join()
    ElMessage.success('Yoklamaya katıldın')
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <div class="roll-call-card">
    <p class="roll-call-card__title"><ClipboardCheck :size="18" />{{ card.title }}</p>
    <p v-if="card.joined" class="roll-call-card__line">{{ card.joined }}</p>
    <p v-if="card.status" class="roll-call-card__status" :class="{ 'roll-call-card__status--done': card.done }">
      {{ card.status }}
    </p>
    <el-button v-if="card.action === 'join'" type="primary" :loading="isJoining" @click="onJoin">
      Yoklamaya Katıl
    </el-button>
    <el-button v-else-if="card.action === 'roll'" @click="router.push({ name: 'attendance' })">
      Yoklamayı gör
    </el-button>
  </div>
</template>

<style scoped>
.roll-call-card {
  display: grid;
  gap: var(--space-2);
  width: min(260px, 100%);
  padding: var(--space-1) 0;
}

.roll-call-card p {
  margin: 0;
}

.roll-call-card__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--brand-deep);
  font-weight: var(--weight-bold);
}

.roll-call-card__line {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.roll-call-card__status {
  color: var(--text-muted);
  font-weight: var(--weight-semibold);
}

.roll-call-card__status--done {
  color: var(--status-success);
}

.roll-call-card .el-button {
  width: 100%;
  margin: 0;
}
</style>
