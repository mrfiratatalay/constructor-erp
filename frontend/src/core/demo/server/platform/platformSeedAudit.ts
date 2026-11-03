import { addDays, at, today } from '@/core/demo/server/demoClock'
import type { DemoDatabase } from '@/core/demo/server/demoDb'
import { fixedId, ID_GROUP, type SeedContext } from '@/core/demo/server/seed/seedContext'

type AuditRow = [number, string, string, string | null, string]

/** [gün, saat, işlem, firma adı, özet]: platform ekibinin son iki ayı (backend'deki özet biçimleriyle). */
function rows(trDate: (day: string) => string): AuditRow[] {
  const day = (delta: number) => trDate(addDays(today(), delta))
  return [
    [-45, '10:00', 'TENANT_CREATED', 'Doğu Karadeniz İnşaat', 'Doğu Karadeniz İnşaat firması açıldı'],
    [-41, '11:00', 'TENANT_CREATED', 'Rize Çay Yapı', 'Rize Çay Yapı firması açıldı'],
    [-40, '15:20', 'SETUP_COMPLETED', 'Rize Çay Yapı', 'Rize Çay Yapı kurulumu tamamladı (Tamer Şen)'],
    [-30, '10:00', 'SUBSCRIPTION_EXTENDED', 'Atalay Yapı', `Abonelik: Professional, 12 ay (${day(-30)} – ${day(334)})`],
    [-30, '10:05', 'PAYMENT_RECORDED', 'Atalay Yapı', `Ödeme alındı: 49900 TL (havale/EFT, ${day(-30)})`],
    [-12, '09:15', 'PLAN_UPDATED', null, 'Starter paketi güncellendi'],
    [-9, '16:45', 'TENANT_STATUS_CHANGED', 'Of Yapı', 'Firma durumu: askıya alındı'],
    [-6, '11:30', 'SALES_REQUEST_UPDATED', null, 'Vakfıkebir Yapı başvurusu: CONTACTED'],
    [-2, '14:00', 'SALES_REQUEST_UPDATED', null, 'Akyazı Mimarlık başvurusu: WON'],
    [-2, '14:02', 'TENANT_CREATED', 'Akyazı Mimarlık', 'Akyazı Mimarlık firması açıldı'],
    [-2, '14:05', 'INVITE_CREATED', 'Akyazı Mimarlık', 'Kurulum linki üretildi'],
    [-1, '10:20', 'TENANT_UPDATED', 'Karadeniz Yapı Taahhüt', 'Firma bilgileri güncellendi'],
  ]
}

export function seedAudit(draft: DemoDatabase, context: SeedContext, trDate: (day: string) => string): void {
  const companyIdOf = (name: string | null) => draft.companies.find((company) => company.name === name)?.id ?? null
  rows(trDate).forEach(([delta, time, action, company, summary], index) => {
    const actor = action === 'SETUP_COMPLETED' ? draft.people.find((person) => person.fullName === 'Tamer Şen') : undefined
    draft.platform.audit.push({
      id: fixedId(ID_GROUP.platform + 5, index + 1),
      action,
      companyId: companyIdOf(company),
      summary,
      actorId: actor?.id ?? context.people.admin.id,
      createdAt: at(delta, time),
    })
  })
}
