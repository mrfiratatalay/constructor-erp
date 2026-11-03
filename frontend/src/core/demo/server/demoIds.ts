/** Kayıt kimliği: gerçek backend gibi UUID. */
export const newId = (): string => crypto.randomUUID()

/** Bağlantılardaki token (katılma, kurulum, giriş linki): tahmin edilemez, adreste güvenle durur. */
export function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(18))
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
