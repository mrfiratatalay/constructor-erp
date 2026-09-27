import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { MarkRequest } from '@/core/api/generated/model'
import { useClearMark, useMarkEntries, useMarkEntry } from '@/core/api/generated/puantaj/puantaj'
import type { DayStatus } from '@/core/puantaj/puantajLabels'
import { refreshPuantaj } from '@/core/puantaj/usePuantajRange'

/**
 * Günü işaretlemek. Her seçim anında kaydedilir; "Kaydet" ya da "Tamamla" yoktur. Toplu işaretleme şefin
 * seçtiklerini tek hamlede yazar (notları yerinde kalır). İşaret kaldırılınca gün yeniden "İşaretlenmedi" olur.
 */
export function usePuantajMarking() {
  const queryClient = useQueryClient()
  const mutation = { onSuccess: () => refreshPuantaj(queryClient) }
  const mark = useMarkEntry({ mutation })
  const clear = useClearMark({ mutation })
  const bulk = useMarkEntries({ mutation })
  return {
    mark: (entryId: string, day: string, data: MarkRequest) => mark.mutateAsync({ day, entryId, data }),
    setStatus: (entryId: string, day: string, status: DayStatus) =>
      mark.mutateAsync({ day, entryId, data: { status } }),
    clear: (entryId: string, day: string) => clear.mutateAsync({ day, entryId }),
    markAll: (entryIds: string[], day: string, status: DayStatus) =>
      bulk.mutateAsync({ day, data: { entryIds, status } }),
    isSaving: computed(() => mark.isPending.value || clear.isPending.value || bulk.isPending.value),
  }
}
