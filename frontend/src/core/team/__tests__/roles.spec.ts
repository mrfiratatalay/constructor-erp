import { describe, expect, it } from 'vitest'
import { roleActions } from '@/core/team/roleChange'
import { isCountedInPuantaj, roleAllows, ROLE_LABELS } from '@/core/team/roles'

describe('depo sorumlusu rolü', () => {
  it('çalışan gibi yoklamada sayılır ve Puantajım onundur; Yoklama değil', () => {
    expect(isCountedInPuantaj('STOREKEEPER')).toBe(true)
    expect(isCountedInPuantaj('WORKER')).toBe(true)
    expect(isCountedInPuantaj('SITE_LEAD')).toBe(false)
    expect(roleAllows({ workerOnly: true }, 'STOREKEEPER')).toBe(true)
    expect(roleAllows({ rollCallOnly: true }, 'STOREKEEPER')).toBe(false)
    expect(ROLE_LABELS.STOREKEEPER).toBe('Depo sorumlusu')
  })

  it('patronun menüsünde kişinin sahip olmadığı üç rol, sabit sırayla', () => {
    expect(roleActions('WORKER').map((item) => item.label)).toEqual([
      'Patron yap',
      'Şef yap',
      'Depo sorumlusu yap',
    ])
    expect(roleActions('STOREKEEPER').map((item) => item.label)).toEqual([
      'Patron yap',
      'Şef yap',
      'Çalışan yap',
    ])
  })
})
