import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  getGetTenantQueryKey,
  getListTenantAuditQueryKey,
  useChangeSubscriptionPlan,
  useChangeSubscriptionStatus,
  useChangeTenantStatus,
  useExtendSubscription,
  useRecordPayment,
  useUpdateTenant,
} from '@/core/api/generated/platform/platform'
import type { TenantDetail } from '@/core/api/generated/model'
import { refreshAdminLists } from '@/core/admin/adminCache'

/**
 * Firmaya yapılan platform işlemleri. Her uç güncel firma ayrıntısını döner: ekran ikinci istek atmadan yenilenir;
 * listeler, özet ve işlem geçmişi arkadan tazelenir.
 */
export function useTenantActions(companyId: MaybeRefOrGetter<string>) {
  const queryClient = useQueryClient()
  const onDetail = (value: TenantDetail) => {
    queryClient.setQueryData(getGetTenantQueryKey(toValue(companyId)), value)
    void queryClient.invalidateQueries({ queryKey: getListTenantAuditQueryKey(toValue(companyId)) })
    void refreshAdminLists(queryClient)
  }
  const options = { mutation: { onSuccess: onDetail } }
  const update = useUpdateTenant(options)
  const status = useChangeTenantStatus(options)
  const extend = useExtendSubscription(options)
  const plan = useChangeSubscriptionPlan(options)
  const periodStatus = useChangeSubscriptionStatus(options)
  const payment = useRecordPayment(options)
  const id = () => toValue(companyId)
  /** Bir işlem sürerken düğmeler kilitlenir: çift tıklama ikinci ödemeyi ya da ikinci dönemi kaydetmesin. */
  const isBusy = computed(() => [update, status, extend, plan, periodStatus, payment].some((m) => m.isPending.value))

  return {
    isBusy,
    update: (data: Parameters<typeof update.mutateAsync>[0]['data']) => update.mutateAsync({ companyId: id(), data }),
    changeStatus: (data: Parameters<typeof status.mutateAsync>[0]['data']) => status.mutateAsync({ companyId: id(), data }),
    extend: (data: Parameters<typeof extend.mutateAsync>[0]['data']) => extend.mutateAsync({ companyId: id(), data }),
    changePlan: (subscriptionId: string, planId: string) =>
      plan.mutateAsync({ companyId: id(), subscriptionId, data: { planId } }),
    changePeriodStatus: (subscriptionId: string, value: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED') =>
      periodStatus.mutateAsync({ companyId: id(), subscriptionId, data: { status: value } }),
    recordPayment: (data: Parameters<typeof payment.mutateAsync>[0]['data']) => payment.mutateAsync({ companyId: id(), data }),
  }
}
