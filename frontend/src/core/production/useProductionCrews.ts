import { useQueryClient } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter } from 'vue'
import {
  getListProductionCrewsQueryKey,
  useListProductionCrews,
} from '@/core/api/generated/production/production'
import { useAddRosterEntry } from '@/core/api/generated/puantaj/puantaj'

/**
 * İmalatın taşeron seçimi: firmanın taşeron ekipleri (yoklamadaki ekipler, tek liste). Listede yoksa şef adını
 * yazıp ekler; ekip yoklama listesine de girer.
 */
export function useProductionCrews(enabled: MaybeRefOrGetter<boolean>) {
  const queryClient = useQueryClient()
  const crews = useListProductionCrews({ query: { enabled } })
  const add = useAddRosterEntry({
    mutation: {
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: getListProductionCrewsQueryKey() }),
    },
  })

  async function addCrew(name: string): Promise<string> {
    const crew = await add.mutateAsync({
      data: { kind: 'CREW', name: name.trim(), trade: null, phone: null },
    })
    return crew.id
  }

  return { crews: computed(() => crews.data.value ?? []), addCrew, isAdding: add.isPending }
}
