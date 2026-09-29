import { computed, ref } from 'vue'
import { useListPlatformAudit } from '@/core/api/generated/platform/platform'

/** Platformun bütün işlem geçmişi; işlem türüne ve firmaya göre süzülür. */
export function useAuditLog() {
  const { data, isPending } = useListPlatformAudit({ limit: 200 })
  const action = ref<string>('')
  const search = ref('')
  const entries = computed(() => {
    const needle = search.value.trim().toLocaleLowerCase('tr')
    return (data.value ?? []).filter((entry) =>
      (!action.value || entry.action === action.value)
      && `${entry.summary} ${entry.companyName ?? ''} ${entry.actorName ?? ''}`.toLocaleLowerCase('tr').includes(needle))
  })
  return { entries, action, search, isPending }
}
