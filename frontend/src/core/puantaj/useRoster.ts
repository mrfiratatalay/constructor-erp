import { useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { RosterEntryRequest } from '@/core/api/generated/model'
import {
  useAddRosterEntry,
  useArchiveRosterEntry,
  useUpdateRosterEntry,
} from '@/core/api/generated/puantaj/puantaj'
import { refreshPuantaj } from '@/core/puantaj/usePuantajRange'

/**
 * Listenin kalemleri: uygulaması olmayan bir kişiyi ya da taşeron ekibi eklemek, düzeltmek, listeden çıkarmak.
 * Uygulamadaki çalışan listeye kendiliğinden gelir; onun yalnızca görevi düzeltilir.
 */
export function useRoster() {
  const queryClient = useQueryClient()
  const mutation = { onSuccess: () => refreshPuantaj(queryClient) }
  const add = useAddRosterEntry({ mutation })
  const update = useUpdateRosterEntry({ mutation })
  const archive = useArchiveRosterEntry({ mutation })
  return {
    add: (data: RosterEntryRequest) => add.mutateAsync({ data }),
    update: (entryId: string, data: RosterEntryRequest) => update.mutateAsync({ entryId, data }),
    archive: (entryId: string) => archive.mutateAsync({ entryId }),
    isSaving: computed(() => add.isPending.value || update.isPending.value || archive.isPending.value),
  }
}
