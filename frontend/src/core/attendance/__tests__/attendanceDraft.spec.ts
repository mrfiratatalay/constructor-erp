import { describe, expect, it } from 'vitest'
import type { AttendanceEntryView, WorkerView } from '@/core/api/generated/model'
import {
  absenceChoiceOf,
  absenceMark,
  buildDraft,
  CAME,
  countMarks,
  presenceRate,
  toRequest,
} from '@/core/attendance/attendanceDraft'

const worker = (id: string, fullName: string): WorkerView => ({ id, fullName })
const ALI = worker('ali', 'Ali Usta')
const CAGLAR = worker('caglar', 'Çağlar Demir')
const CEM = worker('cem', 'Cem Kaya')
const sick = (who: WorkerView): AttendanceEntryView => ({ worker: who, status: 'ABSENT', reason: 'SICK', note: 'Aradı' })
const names = (rows: { worker: WorkerView }[]) => rows.map((row) => row.worker.fullName)

describe('buildDraft', () => {
  it('yoklama alınmamışsa herkes "Geldi" başlar, Türkçe alfabe sırasıyla', () => {
    const rows = buildDraft({ workers: [CAGLAR, CEM, ALI], recorded: [], current: [], withRoster: false })
    expect(names(rows)).toEqual(['Ali Usta', 'Cem Kaya', 'Çağlar Demir'])
    expect(rows.every((row) => row.mark === CAME)).toBe(true)
  })

  it('geçmiş gün düzenlenirken o günün listesi kalır; sonradan eklenen personel eklenmez', () => {
    const rows = buildDraft({ workers: [ALI, CEM], recorded: [sick(ALI)], current: [], withRoster: false })
    expect(names(rows)).toEqual(['Ali Usta'])
    expect(rows[0]?.mark).toEqual({ status: 'ABSENT', reason: 'SICK', note: 'Aradı' })
  })

  it('bugün düzenlenirken yeni personel "Geldi" gelir; pencerede yapılan işaret kayıttakini geçer', () => {
    const current = [{ worker: ALI, mark: CAME }]
    const rows = buildDraft({ workers: [ALI, CEM], recorded: [sick(ALI)], current, withRoster: true })
    expect(names(rows)).toEqual(['Ali Usta', 'Cem Kaya'])
    expect(rows.map((row) => row.mark.status)).toEqual(['PRESENT', 'PRESENT'])
  })
})

describe('absenceMark', () => {
  it('İzinli ayrı durumdur; ötekiler "Gelmedi" + neden, not kırpılır', () => {
    expect(absenceMark('EXCUSED', null)).toEqual({ status: 'EXCUSED', reason: null, note: null })
    expect(absenceMark('OTHER', '  Doktora gitti ')).toEqual({ status: 'ABSENT', reason: 'OTHER', note: 'Doktora gitti' })
    expect(absenceChoiceOf(absenceMark('SICK', null))).toBe('SICK')
    expect(absenceChoiceOf(CAME)).toBeNull()
  })
})

describe('sayım', () => {
  it('geldi, gelmedi, izinli sayılır; yüzde yuvarlanır, kayıt yoksa yüzde yok', () => {
    const marks = [CAME, CAME, absenceMark('SICK', null), absenceMark('EXCUSED', null)]
    expect(countMarks(marks)).toEqual({ present: 2, absent: 1, excused: 1 })
    expect(presenceRate({ present: 11, absent: 1, excused: 0 })).toBe(92)
    expect(presenceRate({ present: 0, absent: 0, excused: 0 })).toBeNull()
  })

  it('kaydedilecek liste kişi kimliğiyle gider', () => {
    expect(toRequest([{ worker: ALI, mark: CAME }])).toEqual({
      entries: [{ workerId: 'ali', status: 'PRESENT', reason: null, note: null }],
    })
  })
})
