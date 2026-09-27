import { ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import type { DayMarkView, MarkRequest } from '@/core/api/generated/model'
import type { DayStatus } from '@/core/puantaj/puantajLabels'
import { usePuantajMarking } from '@/core/puantaj/usePuantajMarking'

/** Düzenlenen gün: hangi kalemin hangi günü, şimdiki işareti. */
export interface EditedDay {
  entryId: string
  day: string
  mark?: DayMarkView
}

/** Formdaki hâli: durum seçilmemişse mesai ve not bekler (işaretsiz güne not yazılmaz). */
export interface MarkDraft {
  status: DayStatus | null
  overtimeHours: number
  note: string
}

const draftOf = (mark?: DayMarkView): MarkDraft => ({
  status: mark?.status ?? null,
  overtimeHours: mark?.overtimeHours ?? 0,
  note: mark?.note ?? '',
})

/** Mesai yalnızca Geldi gününe yazılır: başka duruma geçince düşer. */
const requestOf = (draft: MarkDraft & { status: DayStatus }): MarkRequest => ({
  status: draft.status,
  overtimeHours: draft.status === 'PRESENT' && draft.overtimeHours > 0 ? draft.overtimeHours : null,
  note: draft.note.trim() || null,
})

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
