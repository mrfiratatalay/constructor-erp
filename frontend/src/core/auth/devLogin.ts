/** Giriş ekranını tek dokunuşla doldurmak için hesap. */
export interface DevLogin {
  email: string
  password: string
}

/**
 * Yerelde her seferinde patronun bilgilerini yazmamak için. Hesap derlemede ortamdan gelir, koda girmez (Anayasa
 * Madde 5): geliştirme sunucusunda git'e girmeyen .env.development.local'dan, Docker'da docker-compose.yml'in
 * backend'e verdiği ilk yöneticiden. Bu değerler verilmeden derlenen arayüzde (ör. bir sunucuya kurulum) düğme yoktur.
 */
export function devLogin(): DevLogin | null {
  const email = import.meta.env.VITE_DEV_LOGIN_EMAIL
  const password = import.meta.env.VITE_DEV_LOGIN_PASSWORD
  if (!email || !password) return null
  return { email, password }
}
