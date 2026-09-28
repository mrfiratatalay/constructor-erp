import { ElMessage, ElMessageBox } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { MovementRow } from '@/core/api/generated/model'
import { movementNumber } from '@/core/materials/quantity'
import { useMovementCommands } from '@/core/materials/useMovementCommands'

/** Vazgeçilirse Element Plus "cancel"/"close" fırlatır; bu bir hata değil. */
const dismissed = (error: unknown) => error === 'cancel' || error === 'close'

/**
 * Hareketin tablodan ve ayrıntıdan yapılan adımları, masaüstünün onay pencereleriyle: iptal nedeni zorunludur
 * (hareket silinmez, nedeniyle geçmişte kalır), teslim alma tek tıktır ve sonucu kısa bildirimle söylenir.
 */
export function useMovementPrompts() {
  const commands = useMovementCommands()

  async function deliver(row: MovementRow) {
    await commands.deliver(row.id).then(
      () => ElMessage.success(row.status === 'PENDING_CHECK' ? 'Kontrol edildi, stoğa girdi' : 'Teslim alındı'),
      (error) => ElMessage.error(errorMessage(error)),
    )
  }

  async function cancel(row: MovementRow) {
    try {
      const { value } = await ElMessageBox.prompt(
        'Hareket silinmez: nedeniyle birlikte geçmişte "İptal" olarak kalır ve hiçbir stoğa dokunmaz.',
        `${movementNumber(row.number)} iptal edilsin mi?`,
        {
          confirmButtonText: 'İptal et',
          cancelButtonText: 'Vazgeç',
          type: 'warning',
          confirmButtonClass: 'el-button--danger',
          inputPlaceholder: 'Neden? Ör. miktar yanlış girildi',
          inputValidator: (text: string) => text.trim().length > 0 || 'İptal nedenini yaz.',
        },
      )
      await commands.cancel(row.id, value)
      ElMessage.success('Hareket iptal edildi')
    } catch (error) {
      if (!dismissed(error)) ElMessage.error(errorMessage(error))
    }
  }

  return { deliver, cancel, isBusy: commands.isBusy }
}
