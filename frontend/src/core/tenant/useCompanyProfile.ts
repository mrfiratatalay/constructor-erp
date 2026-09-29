import { reactive, watch } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import {
  getGetCompanyProfileQueryKey,
  useGetCompanyProfile,
  useRemoveCompanyLogo,
  useUpdateCompanyProfile,
  useUploadCompanyLogo,
} from '@/core/api/generated/account/account'
import { sessionContextQuery } from '@/core/auth/sessionContext'

/** Formun alanları düz metindir (boş bırakılan alan sunucuda boşa çevrilir). */
export interface CompanyProfileForm {
  name: string
  phone: string
  email: string
  city: string
}

/**
 * Firmanın kimliği (ad, iletişim, logo): patron düzenler. Kimlik değişince oturum bağlamı yenilenir: sol menüdeki ad
 * ve logo hemen değişir.
 */
export function useCompanyProfile() {
  const queryClient = useQueryClient()
  const profile = useGetCompanyProfile()
  const form = reactive<CompanyProfileForm>({ name: '', phone: '', email: '', city: '' })
  watch(profile.data, (value) => value && Object.assign(form, {
    name: value.name, phone: value.phone ?? '', email: value.email ?? '', city: value.city ?? '',
  }), { immediate: true })

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetCompanyProfileQueryKey() })
    await queryClient.invalidateQueries({ queryKey: sessionContextQuery.queryKey })
  }
  const update = useUpdateCompanyProfile({ mutation: { onSuccess: refresh } })
  const upload = useUploadCompanyLogo({ mutation: { onSuccess: refresh } })
  const remove = useRemoveCompanyLogo({ mutation: { onSuccess: refresh } })

  return {
    profile: profile.data,
    isLoading: profile.isPending,
    form,
    save: () => update.mutateAsync({ data: { ...form } }),
    isSaving: update.isPending,
    uploadLogo: (file: File) => upload.mutateAsync({ data: { file } }),
    removeLogo: () => remove.mutateAsync(),
    isUploading: upload.isPending,
  }
}
