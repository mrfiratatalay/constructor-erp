import { describe, expect, it } from 'vitest'
import type { AttendanceEntryView, SiteAttendanceSheet, WorkerView } from '@/core/api/generated/model'
import { markLabel } from '@/core/attendance/attendanceLabels'
import {
  buildRoll,
  orderRoll,
  pendingSites,
  quickMark,
  recordedRoll,
  splitRoll,
  type RollRow,
} from '@/core/attendance/dailyRoll'

const worker = (id: string, fullName: string): WorkerView => ({ id, fullName })
const ALI = worker('ali', 'Ali Usta')
const CEM = worker('cem', 'Cem Kaya')
const VELI = worker('veli', 'Veli Kaya')
const sick = (who: WorkerView): AttendanceEntryView => ({ worker: who, status: 'ABSENT', reason: 'SICK' })
const came = (who: WorkerView): AttendanceEntryView => ({ worker: who, status: 'PRESENT' })

function sheet(siteId: string, workers: WorkerView[], recorded: AttendanceEntryView[] = []): SiteAttendanceSheet {
  const recordedAt = recorded.length ? '2026-09-25T06:00:00Z' : undefined
  const counts = { present: 0, absent: 0, excused: 0 }
  return { siteId, siteName: siteId, workers, day: { siteId, day: '2026-09-25', recordedAt, counts, entries: recorded } }
}

const names = (rows: RollRow[]) => rows.map((row) => row.worker.fullName)

describe('buildRoll', () => {
  it('bütün şantiyelerin personeli tek listede, alfabe sırasıyla; kayıttaki işaret gelir, kalanlar "Geldi"', () => {
    const rows = buildRoll([sheet('avrupa', [VELI], [sick(VELI)]), sheet('camlica', [CEM, ALI])], [])
    expect(names(rows)).toEqual(['Ali Usta', 'Cem Kaya', 'Veli Kaya'])
    expect(rows.map((row) => row.siteName)).toEqual(['camlica', 'camlica', 'avrupa'])
    expect(rows.map((row) => row.mark.status)).toEqual(['PRESENT', 'PRESENT', 'ABSENT'])
  })

  it('bu ekranda dokunulan işaret kayıttakini geçer', () => {
    const sheets = [sheet('avrupa', [VELI], [sick(VELI)])]
    const touched = [{ ...buildRoll(sheets, [])[0]!, mark: quickMark('PRESENT', null) }]
    expect(buildRoll(sheets, touched)[0]?.mark.status).toBe('PRESENT')
  })
})

describe('splitRoll ve etiketler', () => {
  it('gelenler ve gelmeyenler (izinli dahil) ayrılır; satırda durum ve nedeni yazar', () => {
    const rows = buildRoll([sheet('s', [ALI, CEM, VELI], [came(ALI), sick(CEM), { worker: VELI, status: 'EXCUSED' }])], [])
    const { came: here, away } = splitRoll(rows)
    expect(names(here)).toEqual(['Ali Usta'])
    expect(away.map((row) => markLabel(row.mark.status, row.mark.reason))).toEqual(['Gelmedi · Hasta', 'İzinli'])
  })

  it('küçük seçim işarete çevrilir: İzinli ayrı durumdur, diğerleri "Gelmedi" + neden', () => {
    expect(quickMark('EXCUSED', null)).toEqual({ status: 'EXCUSED', reason: null, note: null })
    expect(quickMark('UNEXCUSED', null)).toEqual({ status: 'ABSENT', reason: 'UNEXCUSED', note: null })
  })
})

describe('pendingSites', () => {
  it('alınmamış şantiye kaydedilir; alınmış ve dokunulmamış olan yeniden yazılmaz', () => {
    const sheets = [sheet('avrupa', [VELI], [sick(VELI)]), sheet('camlica', [ALI])]
    const pending = pendingSites(sheets, buildRoll(sheets, []), [])
    expect(pending).toEqual([{ siteId: 'camlica', entries: [{ workerId: 'ali', status: 'PRESENT', reason: null, note: null }] }])
  })

  it('dokunulan ya da listesi eksik kalan (sonradan personel eklenen) alınmış şantiye de kaydedilir', () => {
    const recorded = [sheet('avrupa', [VELI], [sick(VELI)]), sheet('camlica', [ALI, CEM], [came(ALI)])]
    const touched = [{ ...buildRoll(recorded, [])[2]!, mark: quickMark('PRESENT', null) }]
    expect(pendingSites(recorded, buildRoll(recorded, touched), touched).map((site) => site.siteId)).toEqual([
      'avrupa',
      'camlica',
    ])
  })

  it('personeli olmayan şantiye gönderilmez', () => {
    expect(pendingSites([sheet('bos', [])], [], [])).toEqual([])
  })
})

describe('orderRoll ve recordedRoll', () => {
  it('tek listede önce gelenler, sonra gelmeyenler gelir', () => {
    const rows = buildRoll([sheet('s', [ALI, CEM, VELI], [sick(ALI), came(CEM), came(VELI)])], [])
    expect(names(orderRoll(rows))).toEqual(['Cem Kaya', 'Veli Kaya', 'Ali Usta'])
  })

  it('geçmiş gün yalnızca o günün kaydıdır; sonradan eklenen personel ve kaydı olmayan şantiye gelmez', () => {
    const rows = recordedRoll([sheet('avrupa', [VELI, CEM], [sick(VELI)]), sheet('camlica', [ALI])])
    expect(names(rows)).toEqual(['Veli Kaya'])
    expect(rows[0]?.mark.status).toBe('ABSENT')
  })
})
