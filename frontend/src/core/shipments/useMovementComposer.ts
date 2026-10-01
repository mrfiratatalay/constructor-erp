import { computed, ref } from 'vue'
import type { MovementKind } from '@/core/shipments/movementPresentation'
import { emptyMovementDraft, movementProblem, movementRequest, documentsProblem } from '@/core/shipments/movementForm'
import { useShipmentOptions } from '@/core/shipments/useShipmentOptions'
import { useShipmentSave } from '@/core/shipments/useShipmentSave'
import { useShipmentActions } from '@/core/shipments/useShipmentActions'
import { useShipments } from '@/core/shipments/useShipments'

function createComposerState() {
  const draft = ref(emptyMovementDraft('SITE'))
  const returnId = ref<string | null>(null)
  const { outside, isLoading, isError, refetch } = useShipments('')
  const original = computed(() => outside.value.find((row) => row.id === returnId.value) ?? null)
  function reset(kind: MovementKind) {
    draft.value = emptyMovementDraft(kind)
    returnId.value = null
  }
  return { draft, returnId, original, awaiting: outside, returnsLoading: isLoading, returnsError: isError, refetch, reset }
}

export function useMovementComposer() {
  const state = createComposerState()
  const options = useShipmentOptions()
  const saving = useShipmentSave()
  const actions = useShipmentActions()
  async function create(documents: File[]) {
    const problem = movementProblem(state.draft.value) ?? documentsProblem(documents)
    if (problem) throw new Error(problem)
    if (!options.mainDepot.value) throw new Error('Ana depo bulunamadı.')
    return saving.save(movementRequest(state.draft.value, options.mainDepot.value.id), documents)
  }
  async function receive() {
    if (!state.original.value?.awaitingReturn) throw new Error('Geri beklenen bir hareket seçin.')
    return actions.receive(state.original.value.id)
  }
  return {
    ...state, ...options, create, receive,
    isSaving: computed(() => saving.isSaving.value || actions.isBusy.value),
  }
}
