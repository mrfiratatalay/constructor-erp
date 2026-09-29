import { reactive } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  getListPlansQueryKey,
  useListFeatures,
  useListPlans,
  useUpdatePlan,
} from '@/core/api/generated/platform/platform'
import type { PlanAdminView, UpdatePlanRequest } from '@/core/api/generated/model'
import { refreshAdminLists } from '@/core/admin/adminCache'

/** Düzenleme formu; boş fiyat "teklifle", boş sınır "sınırsız" demektir. */
export type PlanForm = UpdatePlanRequest & { id: string }

export function planFormOf(plan: PlanAdminView): PlanForm {
  const { id, name, tagline = null, monthlyPrice = null, maxUsers = null, maxSites = null } = plan
  return {
    id, name, tagline, monthlyPrice, maxUsers, maxSites, highlighted: plan.highlighted, visible: plan.visible,
    status: plan.status as PlanForm['status'], features: [...plan.features],
  }
}

/** Paketler ve modüller: fiyat, sınır, görünürlük ve modül değişikliği bütün firmalara hemen yansır. */
export function usePlanAdmin() {
  const queryClient = useQueryClient()
  const { data: plans, isPending } = useListPlans()
  const { data: features } = useListFeatures()
  const editing = reactive<{ form: PlanForm | null }>({ form: null })
  const update = useUpdatePlan({
    mutation: {
      onSuccess: (value) => {
        queryClient.setQueryData(getListPlansQueryKey(), value)
        void refreshAdminLists(queryClient)
      },
    },
  })
  async function save() {
    if (!editing.form) return
    const { id, ...data } = editing.form
    await update.mutateAsync({ planId: id, data })
    editing.form = null
  }
  return {
    plans, features, isPending, editing,
    edit: (plan: PlanAdminView) => (editing.form = planFormOf(plan)),
    save, isSaving: update.isPending,
  }
}
