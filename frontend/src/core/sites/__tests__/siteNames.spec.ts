import { describe, expect, it } from 'vitest'
import type { SiteView } from '@/core/api/generated/model'
import { leadNames, siteNames } from '@/core/sites/siteNames'

const SITES: SiteView[] = [
  { id: 'a', name: 'Çamlıca Konutları', status: 'ACTIVE', leads: [] },
  { id: 'b', name: 'Kartal B Blok', status: 'ACTIVE', leads: [{ id: 'u', fullName: 'Ahmet Usta' }] },
]

describe('siteNames', () => {
  it('seçili şantiyelerin adlarını sırayla yazar, boşsa tire koyar', () => {
    expect(siteNames(['b', 'a'], SITES)).toBe('Çamlıca Konutları, Kartal B Blok')
    expect(siteNames([], SITES)).toBe('—')
  })

  it('sorumlusu olmayan şantiyeyi açıkça belirtir', () => {
    expect(leadNames(SITES[1]!.leads)).toBe('Ahmet Usta')
    expect(leadNames([])).toBe('Sorumlu atanmadı')
  })
})
