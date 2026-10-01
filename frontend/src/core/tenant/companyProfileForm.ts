import type { CompanyProfileView } from '@/core/api/generated/model'

export interface CompanyProfileForm {
  name: string
  phone: string
  email: string
  city: string
}

export function companyFields(profile?: CompanyProfileView): CompanyProfileForm {
  return { name: profile?.name ?? '', phone: profile?.phone ?? '', email: profile?.email ?? '', city: profile?.city ?? '' }
}

export function trimmedCompanyFields(form: CompanyProfileForm): CompanyProfileForm {
  return { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), city: form.city.trim() }
}

export function companyProfileProblem(form: CompanyProfileForm): string | null {
  const fields = trimmedCompanyFields(form)
  if (!fields.name) return 'Firma adını girin.'
  if (fields.name.length > 120) return 'Firma adı en fazla 120 karakter olabilir.'
  if (fields.phone.length > 20) return 'Telefon en fazla 20 karakter olabilir.'
  if (fields.city.length > 60) return 'Şehir en fazla 60 karakter olabilir.'
  if (fields.email.length > 254 || (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))) {
    return 'Geçerli bir e-posta adresi girin.'
  }
  return null
}

export function companyLogoProblem(file: File): string | null {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) return 'PNG, JPEG veya WEBP dosyası seçin.'
  if (!file.size || file.size > 2 * 1024 * 1024) return 'Logo en fazla 2 MB olabilir.'
  return null
}
