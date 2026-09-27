import { describe, expect, it } from 'vitest'
import type { RollCallView } from '@/core/api/generated/model'
import { rollCallCard } from '@/core/rollcall/rollCallCard'

const view = (fields: Partial<RollCallView> = {}): RollCallView => ({
  day: '2026-09-27',
  open: true,
  joinedCount: 0,
  ...fields,
})

describe('sohbetteki yoklama kartı', () => {
  it('çalışan henüz katılmadıysa düğme görünür', () => {
    const card = rollCallCard('2026-09-27', view(), false, 'Çamlıca')
    expect(card).toEqual({
      title: 'Yoklama · 27 Eylül Pazar',
      joined: 'Henüz katılan yok',
      status: '',
      done: false,
      action: 'join',
    })
  })

  it('katılınca saati yazar; başka şantiyeden katıldıysa o şantiyeyi de', () => {
    const mine = {
      status: 'PRESENT' as const,
      checkedInAt: '2026-09-27T08:12:00',
      siteName: 'Kartal',
    }
    expect(
      rollCallCard('2026-09-27', view({ joinedCount: 3, mine }), false, 'Kartal'),
    ).toMatchObject({
      joined: '3 kişi katıldı',
      status: '✓ Katıldın · 08:12',
      done: true,
      action: 'none',
    })
    expect(rollCallCard('2026-09-27', view({ mine }), false, 'Çamlıca').status).toBe(
      '✓ Katıldın · 08:12 · Kartal',
    )
  })

  it('patronun işaretlediği çalışan yine katılabilir; dünkü yoklama kapalıdır', () => {
    expect(
      rollCallCard('2026-09-27', view({ mine: { status: 'EXCUSED' } }), false, 'Çamlıca'),
    ).toMatchObject({
      status: 'İzinli olarak işaretlendi',
      action: 'join',
    })
    expect(rollCallCard('2026-09-26', view({ open: false }), false, 'Çamlıca')).toMatchObject({
      status: 'Yoklama kapandı',
      action: 'none',
    })
  })

  it('patron yoklamada sayılmaz: yalnızca sayıyı görür ve modüle geçer', () => {
    expect(rollCallCard('2026-09-27', view({ joinedCount: 5 }), true, 'Çamlıca')).toMatchObject({
      joined: '5 kişi katıldı',
      action: 'roll',
    })
  })
})
