import type { MemberView } from '@/core/api/generated/model'
import { whatsappNumber } from '@/core/format/phone'

/**
 * WhatsApp o kişinin sohbetinde, mesaj yazılmış hâlde açılır; patron yalnızca gönder'e basar.
 * Numarası kayıtlı olmayan eski bir kişide WhatsApp kişi seçtirir.
 */
export function whatsappShareUrl(member: Pick<MemberView, 'fullName' | 'phone'>, loginUrl: string): string {
  const message = `Merhaba ${member.fullName}, Kızılkan Şantiye'ye girmek için bu linke dokun: ${loginUrl}`
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
