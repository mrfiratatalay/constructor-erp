import { toValue, type MaybeRefOrGetter } from 'vue'
import { useGetTenant, useListTenantAudit, useListTenantMembers } from '@/core/api/generated/platform/platform'

/** Bir firmanın ayrıntısı (dönemler, ödemeler), kişileri ve işlem geçmişi; işlemler useTenantActions'ta. */
export function useTenantDetail(companyId: MaybeRefOrGetter<string>) {
  const detail = useGetTenant(() => toValue(companyId))
  const members = useListTenantMembers(() => toValue(companyId))
  const audit = useListTenantAudit(() => toValue(companyId))
  return {
    tenant: detail.data,
    isPending: detail.isPending,
    loadError: detail.error,
    members: members.data,
    audit: audit.data,
  }
}
