import type { DayMarkView, MarkRequest } from '@/core/api/generated/model'
import type { DayStatus } from '@/core/puantaj/puantajLabels'

/** Bir günün düzenlenen hâli: durum seçilmemişse mesai ve not bekler (işaretsiz güne not yazılmaz). */
export interface MarkDraft {
  status: DayStatus | null
  overtimeHours: number
  note: string
}

export const draftOf = (mark?: DayMarkView): MarkDraft => ({
  status: mark?.status ?? null,
  overtimeHours: mark?.overtimeHours ?? 0,
  note: mark?.note ?? '',
})

/** Mesai yalnızca Geldi gününe yazılır: başka duruma geçince düşer. Boş not kaydedilmez. */
export const requestOf = (draft: MarkDraft & { status: DayStatus }): MarkRequest => ({
  status: draft.status,
  overtimeHours: draft.status === 'PRESENT' && draft.overtimeHours > 0 ? draft.overtimeHours : null,
  note: draft.note.trim() || null,
})

/**
 * Şimdiki işarete bir değişiklik uygulanmış istek: tek alan değişir (durum, mesai ya da not), öbürleri yerinde kalır.
 * Durum yoksa (işaretsiz gün) istek yoktur.
 */
export function changedRequest(current: DayMarkView | undefined, change: Partial<MarkDraft>): MarkRequest | null {
  const next = { ...draftOf(current), ...change }
  return next.status ? requestOf({ ...next, status: next.status }) : null
}
