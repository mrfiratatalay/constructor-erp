/** "0532 123 45 67" → "tel:05321234567": arama uygulaması boşluk ve tireyle numarayı tanımayabilir. */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
