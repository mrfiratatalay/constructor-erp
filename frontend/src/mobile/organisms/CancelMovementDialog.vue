<script setup lang="ts">
import { ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MovementRow } from '@/core/api/generated/model'
import { movementNumber } from '@/core/materials/quantity'
import { useMovementCommands } from '@/core/materials/useMovementCommands'

/**
 * İptal onayı, nedeniyle: hareket silinmez, "İptal · neden · kim · ne zaman" olarak geçmişte kalır ve hiçbir stoğa
 * dokunmaz. Neden yazılmadan iptal edilmez.
 */
const row = defineModel<MovementRow | null>({ required: true })
const commands = useMovementCommands()
const reason = ref('')
watch(row, () => (reason.value = ''))

async function beforeClose(action: string) {
  if (action !== 'confirm' || !row.value) return true
  if (!reason.value.trim()) {
    showFailToast('İptal nedenini yaz.')
    return false
  }
  try {
    await commands.cancel(row.value.id, reason.value.trim())
    showSuccessToast('Hareket iptal edildi')
    return true
  } catch (error) {
    showFailToast(errorMessage(error))
    return false
  }
}
</script>

<template>
  <van-dialog :show="!!row" :title="row ? `${movementNumber(row.number)} iptal edilsin mi?` : ''" show-cancel-button
    confirm-button-text="İptal et" confirm-button-color="var(--status-danger)" cancel-button-text="Vazgeç"
    :before-close="beforeClose" teleport="body" @update:show="(value: boolean) => !value && (row = null)">
    <van-cell-group inset style="margin: 12px 0">
      <van-field v-model="reason" type="textarea" rows="2" autosize maxlength="300" placeholder="Neden? Ör. miktar yanlış girildi" />
    </van-cell-group>
  </van-dialog>
</template>
