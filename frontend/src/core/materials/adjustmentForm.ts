import type { AdjustmentRequest } from '@/core/api/generated/model'
import { todayIsoDate } from '@/core/format/dates'
import { newId } from '@/core/posts/newId'

/**
 * Sayım düzeltmesi: bir lokasyonda sayılan miktar. Sistem miktarı ekranda yazar, fark kendiliğinden hesaplanır;
 * neden zorunludur. Eski hareketler değişmez, fark ayrı bir hareket olur.
 */
export interface AdjustmentForm {
  id: string
  materialId: string
  locationId: string | null
  counted: number | null
  reason: string
  day: string
  note: string
}

export const emptyAdjustmentForm = (
  materialId: string,
  locationId: string | null,
): AdjustmentForm => ({
  id: newId(),
  materialId,
  locationId,
  counted: null,
  reason: '',
  day: todayIsoDate(),
  note: '',
})

export function adjustmentError(form: AdjustmentForm, system: number | null): string {
  if (!form.locationId) return 'Sayımın yapıldığı lokasyonu seç.'
  if (form.counted === null || form.counted < 0) return 'Sayılan miktarı yaz.'
  if (system !== null && form.counted === system) return 'Sayım sistemle aynı: düzeltme gerekmez.'
  if (!form.reason.trim()) return 'Farkın nedenini seç ya da yaz.'
  return form.day > todayIsoDate() ? 'İleri bir tarihe sayım girilmez.' : ''
}

export const adjustmentRequestOf = (form: AdjustmentForm): AdjustmentRequest => ({
  id: form.id,
  materialId: form.materialId,
  locationId: form.locationId ?? '',
  countedQuantity: form.counted ?? 0,
  reason: form.reason.trim(),
  day: form.day,
  note: form.note.trim() || null,
})
