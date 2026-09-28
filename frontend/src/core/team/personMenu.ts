import type { PostMenuItem } from '@/core/posts/postMenu'
import type { Participant } from '@/core/sites/participants'
import { roleActions, type RoleAction } from '@/core/team/roleChange'

export type PersonAction = 'loginLink' | 'edit' | RoleAction | 'remove'

/**
 * Katılımcıya dokununca (masaüstünde ⌄) patronun menüsü. Kendi satırında yalnızca kendi adı ve numarası: patron
 * kendini çıkaramaz, kendi rolünü değiştiremez (firmada her zaman bir patron kalır). Kişinin sahip olmadığı üç
 * rol seçilebilir (Patron, Şef, Depo sorumlusu, Çalışan). Şef, depo sorumlusu ve çalışan bu menüyü görmez; arar.
 */
export function personMenu(person: Participant, canManage: boolean): PostMenuItem<PersonAction>[] {
  if (!canManage) return []
  if (person.isViewer) return [{ action: 'edit', label: 'Adımı ve numaramı düzenle' }]
  return [
    { action: 'loginLink', label: 'Giriş linki gönder' },
    { action: 'edit', label: 'Düzenle' },
    ...roleActions(person.role),
    { action: 'remove', label: 'Firmadan çıkar', danger: true },
  ]
}
