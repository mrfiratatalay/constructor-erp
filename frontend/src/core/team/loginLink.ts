import type { InviteLink, MemberView } from '@/core/api/generated/model'
import { whatsappNumber } from '@/core/format/phone'

/** Linki gösteren pencerenin ihtiyacı kadarı: kime, hangi link. */
export interface IssuedLink {
  member: Pick<MemberView, 'id' | 'fullName' | 'phone'>
  link: InviteLink
}

/**
 * WhatsApp o kişinin sohbetinde, mesaj yazılmış hâlde açılır; patron yalnızca gönder'e basar. Mesaj firmanın adını
 * taşır (ürünün değil): kişi kendi firmasının çalışma alanına çağrıldığını bilir. Numarası kayıtlı olmayan eski bir
 * kişide WhatsApp kişi seçtirir.
 */
export function whatsappShareUrl(
  member: Pick<MemberView, 'fullName' | 'phone'>,
  loginUrl: string,
  companyName = '',
): string {
  const where = companyName ? `${companyName} çalışma alanına` : 'çalışma alanına'
  const message = `Merhaba ${member.fullName}, ${where} girmek için bu linke dokun: ${loginUrl}`
  const to = member.phone ? whatsappNumber(member.phone) : ''
  return `https://wa.me/${to}?text=${encodeURIComponent(message)}`
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Güvensiz bağlamda (http) ya da izin yoksa pano kullanılamaz; kullanıcı linki elle kopyalar.
    return false
  }
}
