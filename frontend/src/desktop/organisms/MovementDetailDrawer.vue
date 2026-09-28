<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { MapPin } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import { documentError } from '@/core/materials/documentRules'
import { deliverLabel, movementActions } from '@/core/materials/movementActions'
import { movementNumber } from '@/core/materials/quantity'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useMovementCommands } from '@/core/materials/useMovementCommands'
import { useMovementDetail } from '@/core/materials/useMovementDetail'
import MovementStatusTag from '@/desktop/atoms/MovementStatusTag.vue'
import VerticalStack from '@/desktop/atoms/VerticalStack.vue'
import DocumentList from '@/desktop/molecules/DocumentList.vue'
import HistoryTimeline from '@/desktop/molecules/HistoryTimeline.vue'
import MovementFacts from '@/desktop/molecules/MovementFacts.vue'
import MovementRoute from '@/desktop/molecules/MovementRoute.vue'
import ReturnProgress from '@/desktop/molecules/ReturnProgress.vue'
import { useMovementPrompts } from '@/desktop/movementPrompts'
import MovementEditDialog from '@/desktop/organisms/MovementEditDialog.vue'
import MovementTypeBadge from '@/shared/atoms/MovementTypeBadge.vue'

/**
 * Hareketin ayrıntısı (adres: ?hareket=…): yolu, bilgileri, ödünçte geri dönüşü, belgeleri, Saha referansı ve
 * değişmez geçmişi. Altta durumuna ve kişinin iznine göre adımlar: teslim al, iade al, düzelt, iptal et.
 */
const { movementId } = defineProps<{ movementId: string | null }>()
const emit = defineEmits<{ close: []; open: [movementId: string]; takeReturn: [movementId: string] }>()
const { detail, isPending } = useMovementDetail(() => movementId)
const { can } = useMaterialPermissions()
const commands = useMovementCommands()
const prompts = useMovementPrompts()
const router = useRouter()
const editing = ref(false)
const showField = (siteId: string) => router.push({ name: 'siteField', params: { siteId } })
const actions = computed(() => (detail.value ? movementActions(detail.value.movement.status, can) : null))

async function attach(files: FileList | null) {
  const picked = Array.from(files ?? [])
  const problem = picked.map(documentError).find(Boolean)
  if (problem || !detail.value) return problem && ElMessage.warning(problem)
  await commands.attach(detail.value.movement.id, picked).then(
    () => ElMessage.success('Belge eklendi'), (error) => ElMessage.error(errorMessage(error)))
}
</script>

<template>
  <el-drawer :model-value="!!movementId" size="560px" @close="emit('close')">
    <template #header>
      <el-space v-if="detail" :size="10" wrap>
        <el-text tag="b" size="large">{{ movementNumber(detail.movement.number) }}</el-text>
        <MovementTypeBadge :type="detail.movement.type" />
        <MovementStatusTag :status="detail.movement.status" />
      </el-space>
    </template>
    <el-skeleton v-if="isPending && movementId" :rows="10" animated />
    <VerticalStack v-else-if="detail" :gap="20">
      <MovementRoute :row="detail.movement" />
      <ReturnProgress v-if="detail.movement.purpose === 'LOANED'" :detail="detail" @open="(id) => emit('open', id)" />
      <MovementFacts :detail="detail" @open="(id) => emit('open', id)" />
      <el-card shadow="never" header="Belgeler">
        <DocumentList :documents="detail.documents" />
        <template v-if="can('CREATE_MATERIAL_MOVEMENT')" #footer>
          <el-button text type="primary" tag="label">Belge ekle
            <input type="file" hidden multiple accept=".pdf,.jpg,.jpeg,.png" @change="attach(($event.target as HTMLInputElement).files)" />
          </el-button>
        </template>
      </el-card>
      <el-alert v-for="post in detail.fieldPosts" :key="post.postId" type="success" :closable="false">
        <el-space :size="6"><MapPin :size="15" />{{ post.siteName }} Saha akışında
          <el-link type="primary" @click="showField(post.siteId)">Göster</el-link></el-space>
      </el-alert>
      <el-card shadow="never" header="Geçmiş"><HistoryTimeline :history="detail.history" /></el-card>
    </VerticalStack>
    <template v-if="detail && actions" #footer>
      <el-button v-if="actions.cancel" type="danger" plain @click="prompts.cancel(detail.movement)">İptal et</el-button>
      <el-button v-if="actions.edit" @click="editing = true">Düzelt</el-button>
      <el-button v-if="actions.takeReturn" type="primary" plain @click="emit('takeReturn', detail.movement.id)">İade al</el-button>
      <el-button v-if="actions.deliver" type="primary" @click="prompts.deliver(detail.movement)">
        {{ deliverLabel(detail.movement.status) }}
      </el-button>
    </template>
    <MovementEditDialog v-if="detail" v-model:open="editing" :detail="detail" />
  </el-drawer>
</template>
