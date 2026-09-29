import type { OnboardingLink } from '@/core/api/generated/model'
import { dateTime } from '@/core/format/dates'

/**
 * Kurulum linkinin müşteriye gidecek mesajı. Link yalnızca üretildiği an görünür (sunucuda açık hâli yoktur); ekip onu
 * WhatsApp'tan ya da e-postayla gönderir.
 */
export function onboardingMessage(companyName: string, link: OnboardingLink): string {
  return `Merhaba, ${companyName} için Constructor ERP çalışma alanınız hazır. Kurulumu bu bağlantıdan tamamlayabilirsiniz `
    + `(${dateTime(link.expiresAt)} tarihine kadar, tek kullanımlık): ${link.url}`
}

export function onboardingWhatsappUrl(companyName: string, link: OnboardingLink): string {
  return `https://wa.me/?text=${encodeURIComponent(onboardingMessage(companyName, link))}`
}

export function onboardingMailUrl(companyName: string, email: string | null | undefined, link: OnboardingLink): string {
  const subject = encodeURIComponent('Constructor ERP kurulum bağlantınız')
  return `mailto:${email ?? ''}?subject=${subject}&body=${encodeURIComponent(onboardingMessage(companyName, link))}`
}
