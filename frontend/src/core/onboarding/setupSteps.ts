/** Sihirbazın formları düz metindir; boş bırakılan isteğe bağlı alan gönderilirken boşa çevrilir. */
export interface SetupForms {
  company: { name: string; phone: string; email: string; city: string }
  owner: { fullName: string; email: string; password: string; passwordAgain: string }
  site: { name: string; address: string }
  /** İlk şantiye isteğe bağlıdır: patron bu adımı atlayıp şantiyeyi sonra açabilir. */
  withSite: boolean
}

export const SETUP_STEPS = [
  { key: 'company', title: 'Firma', description: 'Ad, iletişim ve logo' },
  { key: 'owner', title: 'Hesabınız', description: 'Patron girişi' },
  { key: 'site', title: 'İlk şantiye', description: 'İsteğe bağlı' },
  { key: 'done', title: 'Hazır', description: 'Kontrol edip bitirin' },
] as const

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function ownerProblem(owner: SetupForms['owner']): string | null {
  if (!owner.fullName.trim()) return 'Adınızı ve soyadınızı yazın.'
  if (!EMAIL.test(owner.email.trim())) return 'Giriş için geçerli bir e-posta adresi yazın.'
  if (owner.password.length < 8) return 'Şifre en az 8 karakter olmalı.'
  return owner.password === owner.passwordAgain ? null : 'Şifreler birbirini tutmuyor.'
}

/**
 * Adımdaki eksik: varsa kullanıcıya gösterilecek cümle, yoksa null. Sunucu aynı kuralları yeniden denetler; bu
 * yalnızca kişiyi son adımda değil, hatanın olduğu adımda durdurmak için.
 */
export function stepProblem(step: number, forms: SetupForms): string | null {
  if (step === 0) return forms.company.name.trim() ? null : 'Firmanızın adını yazın.'
  if (step === 1) return ownerProblem(forms.owner)
  if (step === 2 && forms.withSite) return forms.site.name.trim() ? null : 'Şantiyenin adını yazın ya da bu adımı atlayın.'
  return null
}

const blankToNull = (value: string) => (value.trim() ? value.trim() : null)

export function setupRequestOf(forms: SetupForms) {
  const { company, owner, site } = forms
  return {
    company: {
      name: company.name.trim(),
      phone: blankToNull(company.phone),
      email: blankToNull(company.email),
      city: blankToNull(company.city),
    },
    owner: { fullName: owner.fullName.trim(), email: owner.email.trim(), password: owner.password },
    firstSite: forms.withSite ? { name: site.name.trim(), address: blankToNull(site.address) } : undefined,
  }
}
