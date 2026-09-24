/** "0532 123 45 67" → "tel:05321234567": arama uygulaması boşluk ve tireyle numarayı tanımayabilir. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

/**
 * Numara okunur gruplarla yazılır: "05528137850" → "0552 813 78 50", "+905528137850" → "+90 552 813 78 50".
 * Tanınmayan biçim olduğu gibi kalır: yanlış bölmektense hiç bölmemek.
 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  const local = digits.startsWith('90') && digits.length === 12 ? digits.slice(2) : digits.replace(/^0/, '')
  if (local.length !== 10) return phone
  const grouped = `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8)}`
  return phone.trim().startsWith('+') ? `+90 ${grouped}` : `0${grouped}`
}

/**
 * WhatsApp bağlantısı numarayı ülke koduyla ve yalnızca rakamla ister: "0532 123 45 67" → "905321234567".
 * Tanınmayan biçimde (ör. yurt dışı "+49 …") rakamlar olduğu gibi gider.
 */
export function whatsappNumber(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  if (digits.length === 10) return `90${digits}`
  if (digits.length === 11 && digits.startsWith('0')) return `9${digits}`
  return digits
}
