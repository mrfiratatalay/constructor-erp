import type { PostMenuItem } from '@/core/posts/postMenu'
import type { Participant } from '@/core/sites/participants'

export type PersonAction = 'loginLink' | 'edit' | 'toggleRole' | 'remove'

/**
 * Katılımcıya dokununca (masaüstünde ⌄) patronun menüsü. Kendi satırında yalnızca kendi adı ve numarası: patron
 * kendini çıkaramaz, kendi rolünü değiştiremez (firmada her zaman bir patron kalır). Şef bu menüyü görmez; arar.
 */
export function personMenu(person: Participant, canManage: boolean): PostMenuItem<PersonAction>[] {
  if (!canManage) return []
  if (person.isViewer) return [{ action: 'edit', label: 'Adımı ve numaramı düzenle' }]
  return [
    { action: 'loginLink', label: 'Giriş linki gönder' },
    { action: 'edit', label: 'Düzenle' },
    { action: 'toggleRole', label: person.role === 'OWNER' ? 'Şef yap' : 'Patron yap' },
    { action: 'remove', label: 'Firmadan çıkar', danger: true },
  ]
}
