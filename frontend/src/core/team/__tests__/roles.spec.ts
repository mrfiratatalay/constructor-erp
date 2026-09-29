import { describe, expect, it } from 'vitest'
import { roleActions } from '@/core/team/roleChange'
import { roleAllows, routeAllows, ROLE_LABELS } from '@/core/team/roles'

describe('depo sorumlusu rolü', () => {
  it('yoklamada sayılmaz, yoklama da almaz: ne Puantajım ne Yoklama onundur', () => {
    expect(roleAllows({ workerOnly: true }, 'WAREHOUSE')).toBe(false)
    expect(roleAllows({ rollCallOnly: true }, 'WAREHOUSE')).toBe(false)
    expect(ROLE_LABELS.WAREHOUSE).toBe('Depo Sorumlusu')
  })

  it('adresin izni rol adından değil backend’in verdiği anahtarlardan okunur', () => {
    const meta = { permission: 'VIEW_PRODUCTION' } as const
    expect(routeAllows(meta, { role: 'WAREHOUSE', permissions: ['VIEW_PRODUCTION'] })).toBe(true)
    expect(routeAllows(meta, { role: 'WORKER', permissions: [] })).toBe(false)
  })

  it('patronun menüsünde kişinin sahip olmadığı üç rol, sabit sırayla', () => {
    expect(roleActions('WORKER').map((item) => item.label)).toEqual([
      'Patron yap',
      'Şef yap',
      'Depo sorumlusu yap',
    ])
    expect(roleActions('WAREHOUSE').map((item) => item.label)).toEqual([
      'Patron yap',
      'Şef yap',
      'Çalışan yap',
    ])
  })
})
