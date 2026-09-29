<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showFailToast, showSuccessToast, type UploaderFileListItem } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MovementRow } from '@/core/api/generated/model'
import { fileSize } from '@/core/format/fileSize'
import { DOCUMENT_ACCEPT, MAX_DOCUMENT_BYTES } from '@/core/materials/documentRules'
import { deliverLabel, movementActions } from '@/core/materials/movementActions'
import { movementNumber, withUnit } from '@/core/materials/quantity'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useMovementCommands } from '@/core/materials/useMovementCommands'
import { useMovementDetail } from '@/core/materials/useMovementDetail'
import MovementStatusTag from '@/mobile/atoms/MovementStatusTag.vue'
import HistorySteps from '@/mobile/molecules/HistorySteps.vue'
import MovementFactCells from '@/mobile/molecules/MovementFactCells.vue'
import MovementEditSheet from '@/mobile/organisms/MovementEditSheet.vue'
import MovementTypeBadge from '@/shared/atoms/MovementTypeBadge.vue'

/**
 * Telefonda hareketin ayrıntısı, alttan açılır (adres: ?hareket=…): bilgiler, ödünçte geri dönüş, belgeler (fotoğraf
 * çekip eklenebilir), Saha referansı, değişmez geçmiş; altta durum ve izne göre adımlar.
 */
const { movementId } = defineProps<{ movementId: string | null }>()
const emit = defineEmits<{ close: []; open: [id: string]; takeReturn: [id: string]; cancel: [row: MovementRow] }>()
const { detail } = useMovementDetail(() => movementId)
const { can } = useMaterialPermissions()
const commands = useMovementCommands()
const router = useRouter()
const editing = ref(false)
const actions = computed(() => (detail.value ? movementActions(detail.value.movement.status, can) : null))
const returned = computed(() => (detail.value ? Math.round(((detail.value.returnedQuantity ?? 0) / detail.value.movement.quantity) * 100) : 0))

const attempt = (work: Promise<unknown>, done: string) =>
  work.then(() => showSuccessToast(done), (error) => showFailToast(errorMessage(error)))
const deliver = () => detail.value && attempt(commands.deliver(detail.value.movement.id), 'Stoğa girdi')
const attach = (items: UploaderFileListItem | UploaderFileListItem[]) =>
  detail.value && attempt(commands.attach(detail.value.movement.id, [items].flat().flatMap((item) => (item.file ? [item.file] : []))), 'Belge eklendi')
</script>

<template>
  <van-popup :show="!!movementId" position="bottom" round closeable teleport="body" :style="{ height: '88dvh' }"
    @update:show="(value: boolean) => !value && emit('close')">
    <div v-if="detail" class="detail-sheet">
      <div class="detail-sheet__head">
        <strong>{{ movementNumber(detail.movement.number) }} · {{ detail.movement.materialName }}</strong>
        <van-space :size="6"><MovementTypeBadge :type="detail.movement.type" /><MovementStatusTag :status="detail.movement.status" /></van-space>
      </div>
      <van-cell-group v-if="detail.movement.purpose === 'LOANED'" inset title="Geri dönüş">
        <van-cell :title="`${withUnit(detail.returnedQuantity ?? 0, detail.movement.unit)} döndü`"
          :value="detail.remainingQuantity ? `${withUnit(detail.remainingQuantity, detail.movement.unit)} bekliyor` : 'Tamamı döndü'">
          <template #label><van-progress :percentage="returned" :show-pivot="false" stroke-width="6" /></template>
        </van-cell>
        <van-cell v-for="line in detail.returns" :key="line.id" :title="movementNumber(line.number)"
          :value="withUnit(line.quantity, detail.movement.unit)" :label="line.destinationName" is-link @click="emit('open', line.id)" />
      </van-cell-group>
      <MovementFactCells :detail="detail" />
      <van-cell-group inset title="Belgeler">
        <van-cell v-for="document in detail.documents" :key="document.id" :title="document.fileName"
          :value="fileSize(document.sizeBytes)" :url="document.url" is-link />
        <van-cell v-if="can('CREATE_MATERIAL_MOVEMENT')" center title="Belge ekle" label="İrsaliye, fatura, teslim tutanağı">
          <template #right-icon>
            <van-uploader :accept="DOCUMENT_ACCEPT" :max-size="MAX_DOCUMENT_BYTES" multiple :preview-image="false"
              :after-read="attach"><van-button size="small" icon="plus" round>Ekle</van-button></van-uploader>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group v-if="detail.fieldPosts.length" inset title="Saha">
        <van-cell v-for="post in detail.fieldPosts" :key="post.postId" :title="`${post.siteName} Saha akışında`" is-link
          @click="router.push({ name: 'siteField', params: { siteId: post.siteId } })" />
      </van-cell-group>
      <van-cell-group inset title="Geçmiş"><div class="detail-sheet__history"><HistorySteps :history="detail.history" /></div></van-cell-group>
      <van-space v-if="actions" class="detail-sheet__actions" :size="8" fill>
        <van-button v-if="actions.deliver" type="primary" round block @click="deliver">{{ deliverLabel(detail.movement.status) }}</van-button>
        <van-button v-if="actions.takeReturn" type="primary" plain round block @click="emit('takeReturn', detail.movement.id)">İade al</van-button>
        <van-button v-if="actions.edit" round block @click="editing = true">Düzelt</van-button>
        <van-button v-if="actions.cancel" type="danger" plain round block @click="emit('cancel', detail.movement)">İptal et</van-button>
      </van-space>
      <MovementEditSheet v-model:open="editing" :detail="detail" />
    </div>
    <van-skeleton v-else :row="8" style="padding-top: 48px" />
  </van-popup>
</template>

<style scoped>
.detail-sheet {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-5) 0 calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.detail-sheet__head {
  display: grid;
  gap: var(--space-2);
  padding: 0 var(--space-4);
  padding-right: var(--space-10);
  font-size: var(--text-md);
}

.detail-sheet__history {
  padding: var(--space-2) var(--space-3) 0;
}

.detail-sheet__actions {
  padding: 0 var(--space-4);
}
</style>
