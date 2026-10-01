/**
 * Girişten sonra dönülecek sayfa (?next=…): yalnızca uygulamanın kendi yolu. Adres çubuğundaki değer herkesin
 * yazabileceği bir şeydir; "//başka-site" ya da "https://…" gibi bir değer kişiyi uygulamanın dışına götürmesin
 * (açık yönlendirme), oltalama bağlantısına çevrilmesin.
 */
export function returnPath(next: unknown): string | null {
  if (typeof next !== 'string' || !next.startsWith('/')) return null
  return next.startsWith('//') || next.startsWith('/\\') ? null : next
}
