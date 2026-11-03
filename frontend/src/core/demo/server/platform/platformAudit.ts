import type { AuditEntryView } from '@/core/api/generated/model'
import { nowIso } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { newId } from '@/core/demo/server/demoIds'
import { companyById, personName } from '@/core/demo/server/demoSession'
import type { AuditRecord } from './platformRecords'

/** İşlem geçmişine yazılan Türkçe adlar (backend'deki StatusNames): geçmiş, arayüzün çevirisinden bağımsız okunur. */
export const STATUS_NAMES: Record<string, string> = {
  ACTIVE: 'aktif',
  SUSPENDED: 'askıya alındı',
  ARCHIVED: 'arşivlendi',
  CANCELLED: 'iptal edildi',
  CASH: 'nakit',
  BANK_TRANSFER: 'havale/EFT',
  OTHER: 'diğer',
}

/** '2026-11-03' → '03.11.2026' */
export const trDate = (day: string) => day.split('-').reverse().join('.')

/** Kritik platform işlemleri kimin, hangi firmada, ne yaptığıyla kaydedilir. */
export function recordAudit(action: string, companyId: string | null, summary: string, actorId: string): void {
  db().platform.audit.push({ id: newId(), action, companyId, summary, actorId, createdAt: nowIso() })
}

export function auditViewOf(entry: AuditRecord): AuditEntryView {
  return {
    id: entry.id,
    action: entry.action,
    companyId: entry.companyId,
    companyName: companyById(entry.companyId)?.name ?? null,
    summary: entry.summary,
    actorName: entry.actorId ? personName(entry.actorId) : null,
    createdAt: entry.createdAt,
  }
}

export function recentAudit(limit: number, companyId?: string): AuditEntryView[] {
  return db()
    .platform.audit.filter((entry) => !companyId || entry.companyId === companyId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map(auditViewOf)
}
