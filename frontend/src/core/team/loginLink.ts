/** WhatsApp'ta hazır mesajla açılır; patron yalnızca kişiyi seçip gönderir. */
export function whatsappShareUrl(fullName: string, loginUrl: string): string {
  const message = `Merhaba ${fullName}, Kızılkan Şantiye'ye girmek için bu linke dokun: ${loginUrl}`
  return `https://wa.me/?text=${encodeURIComponent(message)}`
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
