import type { ChangeTenantStatusRequestStatus } from '@/core/api/generated/model'

/** Firma yaşam döngüsü eylemleri: silme yok; askıya al, arşivle, yeniden aç. Her biri onay ister, nedeni geçmişe yazılır. */
export interface LifecycleAction {
  status: ChangeTenantStatusRequestStatus
  label: string
  confirm: string
  danger: boolean
}

const ACTIONS: LifecycleAction[] = [
  { status: 'ACTIVE', label: 'Yeniden aç', confirm: 'Firmanın çalışma alanı (aboneliği geçerliyse) hemen açılır.', danger: false },
  { status: 'SUSPENDED', label: 'Askıya al', confirm: 'Firmanın bütün kişileri hemen kilit ekranına düşer. Veri silinmez.', danger: true },
  { status: 'ARCHIVED', label: 'Arşivle', confirm: 'Firma arşive alınır, çalışma alanı kapanır. Veri silinmez; geri açılabilir.', danger: true },
]

export function lifecycleActions(current: string): LifecycleAction[] {
  return ACTIONS.filter((action) => action.status !== current)
}
