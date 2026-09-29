import { computed, ref } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useCreateTenant, useListPlans } from '@/core/api/generated/platform/platform'
import type { OnboardingLink } from '@/core/api/generated/model'
import { refreshAdminLists } from '@/core/admin/adminCache'
import { tenantRequestOf, type TenantForm } from '@/core/admin/tenantForm'

export interface CreatedTenant {
  companyId: string
  name: string
  email: string
  link: OnboardingLink
}

/**
 * Manuel satış: firma, paket ve dönem (ve alındıysa ödeme) tek istekte; cevaptaki kurulum linki yalnızca bu an
 * görünür, ekip onu müşteriye gönderir.
 */
export function useTenantCreation() {
  const queryClient = useQueryClient()
  const { data: plans } = useListPlans()
  const created = ref<CreatedTenant | null>(null)
  const mutation = useCreateTenant({ mutation: { onSuccess: () => refreshAdminLists(queryClient) } })

  async function create(form: TenantForm) {
    const result = await mutation.mutateAsync({ data: tenantRequestOf(form) })
    created.value = { companyId: result.companyId, name: form.name.trim(), email: form.email, link: result.invite }
    return result
  }

  return {
    plans: computed(() => (plans.value ?? []).filter((plan) => plan.status === 'ACTIVE')),
    create,
    created,
    isCreating: mutation.isPending,
  }
}
