import type { DayRecord, MemberDayView, RollCallCounts } from '@/core/api/generated/model'
import { clockTime } from '@/core/format/dates'

/**
 * Patronun ekranındaki üç bölüm, bu sırayla: iş bekleyen önce. Katılmayanlar (kaydı yok, patron işaretleyecek),
 * Gelmeyenler (gelmedi ya da izinli), Gelenler. Boş bölüm ekranda durmaz (TASARIM.md İlke 3).
 */
export interface RollSections {
  missing: MemberDayView[]
  absent: MemberDayView[]
  present: MemberDayView[]
}

export function rollSections(members: MemberDayView[]): RollSections {
  return {
    missing: members.filter((member) => !member.record),
    absent: members.filter((member) => member.record && member.record.status !== 'PRESENT'),
    present: members.filter((member) => member.record?.status === 'PRESENT'),
  }
}

/** "8 geldi · 1 gelmedi · 1 izinli · 2 katılmadı"; katılmayan yoksa son parça yazılmaz. */
export function countsLine(counts: RollCallCounts, unit = ''): string {
  const parts = [
    `${counts.present}${unit} geldi`,
    `${counts.absent}${unit} gelmedi`,
    `${counts.excused}${unit} izinli`,
  ]
  if (counts.missing) parts.push(`${counts.missing}${unit} katılmadı`)
  return parts.join(' · ')
}

/**
 * Satırın ikinci satırı. Gelende: kendisi katıldıysa saati ve şantiyesi ("08:12 · Namık Kemal"). Patronun
 * işaretlediği satırda (gelmedi, izinli ya da katılmadan geldi): kimin işaretlediği. Katılmayanda boş: bölümün
 * adı zaten söylüyor (TASARIM.md İlke 3).
 */
export function rowDetail(record: DayRecord | null | undefined): string {
  if (record?.status === 'PRESENT' && record.checkedInAt) {
    return [clockTime(record.checkedInAt), record.siteName].filter(Boolean).join(' · ')
  }
  return record?.markedByName ? `${record.markedByName} işaretledi` : ''
}
