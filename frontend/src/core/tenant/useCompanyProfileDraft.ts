import { computed, reactive, ref, watch, type Ref } from 'vue'
import type { CompanyProfileView } from '@/core/api/generated/model'
import { companyFields } from '@/core/tenant/companyProfileForm'

/** Otomatik sorgu yenilemesi, açık düzenleme panelindeki taslağı silmemeli. */
export function useCompanyProfileDraft(profile: Ref<CompanyProfileView | undefined>) {
  const baseline = ref(companyFields(profile.value))
  const form = reactive(companyFields(profile.value))
  const isDirty = computed(() => Object.keys(baseline.value).some((key) => {
    const field = key as keyof typeof form
    return form[field] !== baseline.value[field]
  }))
  watch(profile, (value) => {
    if (!value) return
    const pristine = !isDirty.value
    baseline.value = companyFields(value)
    if (pristine) Object.assign(form, baseline.value)
  }, { immediate: true })
  const resetForm = () => Object.assign(form, baseline.value)
  return { form, isDirty, resetForm }
}
