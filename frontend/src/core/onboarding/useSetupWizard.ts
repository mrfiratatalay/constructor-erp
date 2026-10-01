import { computed, reactive, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { errorMessage } from '@/core/api/errors'
import { useCompleteSetup, useGetSetupInvite, useUploadSetupLogo } from '@/core/api/generated/setup/setup'
import type { SetupInviteView } from '@/core/api/generated/model'
import { useSignIn } from '@/core/auth/useSignIn'
import { SETUP_STEPS, setupRequestOf, stepProblem, type SetupForms } from '@/core/onboarding/setupSteps'

function blankForms(): SetupForms {
  return {
    company: { name: '', phone: '', email: '', city: '' },
    owner: { fullName: '', email: '', password: '', passwordAgain: '' },
    site: { name: '', address: '' },
    withSite: true,
  }
}

/** Adımlar arası geçiş: ileri gitmeden önce adımın eksiği denetlenir, geri dönüş serbesttir. */
function useSetupNavigation(forms: SetupForms) {
  const step = ref(0)
  const problem = ref<string | null>(null)
  const goTo = (index: number) => {
    problem.value = null
    step.value = Math.min(Math.max(index, 0), SETUP_STEPS.length - 1)
  }
  const next = () => {
    const found = stepProblem(step.value, forms)
    if (found) problem.value = found
    else goTo(step.value + 1)
  }
  // Uyarı açıkken kişi alanı düzeltirse uyarı da güncellenir (sıradaki eksiği söyler ya da kalkar); eski uyarı
  // düzeltilmiş alanın altında kalıp kafa karıştırmasın.
  watch(forms, () => {
    if (problem.value) problem.value = stepProblem(step.value, forms)
  })
  const skipSite = () => {
    forms.withSite = false
    goTo(SETUP_STEPS.length - 1)
  }
  return { step, problem, next, back: () => goTo(step.value - 1), skipSite }
}

/** Platform ekibinin girdiği bilgiler forma önceden dolar; patron dilediğini düzeltir. */
function prefillFrom(forms: SetupForms, invite: SetupInviteView) {
  const { companyName, phone, email, city } = invite
  Object.assign(forms.company, { name: companyName, phone: phone ?? '', email: email ?? '', city: city ?? '' })
  forms.owner.email = email ?? ''
}

const messageOf = (error: Ref<unknown>) => computed(() => (error.value ? errorMessage(error.value) : null))

/**
 * Satın alan firmanın kurulum linki: firma bilgileri → patron hesabı → ilk şantiye → bitir. Link kimliktir; oturum
 * yoktur. Bitince patronun oturumu açılır ve kendi çalışma alanına geçer.
 */
export function useSetupWizard() {
  const token = String(useRoute().params.token)
  const invite = useGetSetupInvite(token, { query: { retry: false } })
  const forms = reactive(blankForms())
  const logoUrl = ref<string | null>(null)
  watch(invite.data, (value) => {
    if (value) prefillFrom(forms, value)
    logoUrl.value = value?.logoUrl ?? null
  }, { immediate: true })

  const upload = useUploadSetupLogo({ mutation: { onSuccess: (result) => (logoUrl.value = result.logoUrl) } })
  const complete = useCompleteSetup({ mutation: { onSuccess: useSignIn() } })

  return {
    invite: invite.data,
    isLoading: invite.isPending,
    inviteError: messageOf(invite.error),
    forms,
    logoUrl,
    ...useSetupNavigation(forms),
    uploadLogo: (file: File) => upload.mutateAsync({ token, data: { file } }),
    isUploading: upload.isPending,
    uploadError: messageOf(upload.error),
    finish: () => complete.mutate({ token, data: setupRequestOf(forms) }),
    isFinishing: complete.isPending,
    finishError: messageOf(complete.error),
  }
}
