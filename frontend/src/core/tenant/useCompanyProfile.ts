import { computed } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  getGetCompanyProfileQueryKey,
  useGetCompanyProfile,
  useRemoveCompanyLogo,
  useUpdateCompanyProfile,
  useUploadCompanyLogo,
} from '@/core/api/generated/account/account'
import { sessionContextQuery } from '@/core/auth/sessionContext'
import { companyLogoProblem, companyProfileProblem, trimmedCompanyFields } from '@/core/tenant/companyProfileForm'
import { useCompanyProfileDraft } from '@/core/tenant/useCompanyProfileDraft'

export type { CompanyProfileForm } from '@/core/tenant/companyProfileForm'

/**
 * Firmanın kimliği (ad, iletişim, logo): patron düzenler. Kimlik değişince oturum bağlamı yenilenir: sol menüdeki ad
 * ve logo hemen değişir.
 */
export function useCompanyProfile() {
  const queryClient = useQueryClient()
  const profile = useGetCompanyProfile()
  const draft = useCompanyProfileDraft(profile.data)
  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetCompanyProfileQueryKey() })
    await queryClient.invalidateQueries({ queryKey: sessionContextQuery.queryKey })
  }
  const update = useUpdateCompanyProfile({ mutation: { onSuccess: refresh } })
  const upload = useUploadCompanyLogo({ mutation: { onSuccess: refresh } })
  const remove = useRemoveCompanyLogo({ mutation: { onSuccess: refresh } })
  const save = async () => {
    const problem = companyProfileProblem(draft.form)
    if (problem) throw new Error(problem)
    await update.mutateAsync({ data: trimmedCompanyFields(draft.form) })
    draft.resetForm()
  }
  return {
    profile: profile.data,
    isLoading: profile.isPending, isError: profile.isError, refetch: profile.refetch,
    ...draft, save, isSaving: update.isPending,
    uploadLogo: (file: File) => uploadValidatedLogo(file, upload.mutateAsync),
    removeLogo: () => remove.mutateAsync(),
    isUploading: upload.isPending, isRemoving: remove.isPending,
    isBusy: computed(() => update.isPending.value || upload.isPending.value || remove.isPending.value),
  }
}

async function uploadValidatedLogo(file: File, upload: ReturnType<typeof useUploadCompanyLogo>['mutateAsync']) {
  const problem = companyLogoProblem(file)
  if (problem) throw new Error(problem)
  return upload({ data: { file } })
}
