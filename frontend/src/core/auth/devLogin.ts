/** Giriş ekranını tek dokunuşla doldurmak için hesap. */
export interface DevLogin {
  email: string
  password: string
}

/**
 * Yerelde her seferinde patronun bilgilerini yazmamak için; yalnızca geliştirme sunucusunda (npm run dev). Hesap
 * git'e girmeyen .env.development.local'dan gelir, koda girmez (Anayasa Madde 5). Derlenmiş arayüze (Docker, sunucu)
 * hiç girmez: derlenen paketteki her şey, içine yazılmış bir şifre de, sayfayı açan herkese açıktır.
 */
export function devLogin(): DevLogin | null {
  if (!import.meta.env.DEV) return null
  const email = import.meta.env.VITE_DEV_LOGIN_EMAIL
  const password = import.meta.env.VITE_DEV_LOGIN_PASSWORD
  if (!email || !password) return null
  return { email, password }
}
