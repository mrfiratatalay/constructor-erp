import { describe, expect, it } from 'vitest'
import type { CrewRef, ProductionEntryView, ProductionItemView } from '@/core/api/generated/model'
import { crewIdForText, crewSuggestions, crewTextOf } from '@/core/production/itemForm'
import { recentRows } from '@/core/production/productionBoard'
import { tradeKind } from '@/core/production/tradeKind'
import { crewChoices } from '@/core/production/useProductionItemEditor'

describe('imalatın küçük parçaları', () => {
  it('simge türün adından okunur, Türkçe harfle ve kelimenin başından', () => {
    expect(tradeKind('Demir İşleri')).toBe('rebar')
    expect(tradeKind('B Blok Sıva')).toBe('plaster')
    expect(tradeKind('ELEKTRİK')).toBe('electric')
    expect(tradeKind('Mekanik Tesisat')).toBe('mechanical')
    expect(tradeKind('Seramik')).toBe('tile')
    expect(tradeKind('Asfalt')).toBe('other')
  })

  it('son girişler imalatıyla eşlenir; silinmiş imalatın girişi düşer', () => {
    const items = [{ id: 'demir' }] as ProductionItemView[]
    const entries = [
      { id: 'a', itemId: 'demir' },
      { id: 'b', itemId: 'silinen' },
    ] as ProductionEntryView[]
    expect(recentRows(entries, items).map((row) => row.entry.id)).toEqual(['a'])
  })

  it('düzenlenen imalatın yoklamadan çıkmış taşeronu seçeneklerde kalır, iki kez eklenmez', () => {
    const kaya = { id: 'kaya', name: 'Kaya Demir', archived: false } as CrewRef
    const eski = { id: 'eski', name: 'Eski Taşeron', archived: true } as CrewRef
    const editing = { crew: eski } as ProductionItemView
    expect(crewChoices([kaya], editing).map((crew) => crew.id)).toEqual(['kaya', 'eski'])
    expect(crewChoices([kaya], { crew: kaya } as ProductionItemView)).toEqual([kaya])
    expect(crewChoices([kaya], null)).toEqual([kaya])
  })
})

describe('telefonda yazılan taşeron', () => {
  const crews = [{ id: 'kaya', name: 'Kaya Demir', archived: false }] as CrewRef[]

  it('listedeki ada eşitse o ekip, değilse yeni taşeronun adı', () => {
    expect(crewIdForText('kaya DEMİR', crews)).toBe('kaya')
    expect(crewIdForText(' Renk Boya ', crews)).toBe('Renk Boya')
    expect(crewIdForText('  ', crews)).toBeUndefined()
    expect(crewTextOf('kaya', crews)).toBe('Kaya Demir')
    expect(crewTextOf('Renk Boya', crews)).toBe('Renk Boya')
    expect(crewTextOf(undefined, crews)).toBe('')
  })
})

describe('taşeron önerileri', () => {
  const crew = (id: string, name: string) => ({ id, name, archived: false }) as CrewRef

  it('yazılana uyanlar, ada göre, aynı ad bir kez, en fazla sekiz', () => {
    const crews = [crew('b', 'Öz Yapı'), crew('a', 'Kaya Demir'), crew('c', 'öz yapı')]
    expect(crewSuggestions(crews, '').map((one) => one.id)).toEqual(['a', 'b'])
    expect(crewSuggestions(crews, 'YAP').map((one) => one.id)).toEqual(['b'])
    const many = Array.from({ length: 12 }, (_, index) => crew(`${index}`, `Ekip ${index + 10}`))
    expect(crewSuggestions(many, '')).toHaveLength(8)
  })
})
