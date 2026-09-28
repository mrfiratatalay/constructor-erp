import { ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import type { DayMarkView } from '@/core/api/generated/model'
import { draftOf, requestOf, type MarkDraft } from '@/core/puantaj/markDraft'
import { usePuantajMarking } from '@/core/puantaj/usePuantajMarking'

export type { MarkDraft } from '@/core/puantaj/markDraft'

/** Düzenlenen gün: hangi kalemin hangi günü, şimdiki işareti. */
export interface EditedDay {
  entryId: string
  day: string
  mark?: DayMarkView
}

/**
 * Bir günü ayrıntısıyla işaretlemek: önce durum, gerekiyorsa mesai ve not. Her değişiklik anında kaydedilir
 * ("Kaydet" yoktur); kaydın izi (kim, ne zaman) işaretin kendisinde durur.
 */
export function useDayEditor(edited: MaybeRefOrGetter<EditedDay | null>) {
  const marking = usePuantajMarking()
  const draft = ref<MarkDraft>(draftOf())
  watch(() => toValue(edited)?.mark, (mark) => (draft.value = draftOf(mark)), { immediate: true })

  async function save(change: Partial<MarkDraft>) {
    const target = toValue(edited)
    const next = { ...draft.value, ...change }
    draft.value = next
    if (!target || !next.status) return
    await marking.mark(target.entryId, target.day, requestOf({ ...next, status: next.status }))
  }

  async function clear() {
    const target = toValue(edited)
    draft.value = draftOf()
    if (target?.mark) await marking.clear(target.entryId, target.day)
  }

  return { draft, save, clear, isSaving: marking.isSaving }
}
