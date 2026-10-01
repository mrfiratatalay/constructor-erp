import { showConfirmDialog } from 'vant'

export interface ConfirmRequest {
  title: string
  message: string
  /** Onay düğmesinin yazısı: işin kendisi ("Sil", "Çıkar", "Sıfırla"), "Tamam" değil. */
  confirm: string
  /** Geri dönüşü zor iş (silme, çıkarma, iptal): onay yazısı kırmızı. Varsayılan. */
  danger?: boolean
}

/**
 * Telefondaki her onay penceresi aynıdır: soru başlıkta, sonucu altta, Vazgeç solda, iş sağda; yıkıcı işte iş
 * kırmızı. Vazgeçilirse false döner.
 */
export function confirmAction({ title, message, confirm, danger = true }: ConfirmRequest): Promise<boolean> {
  return showConfirmDialog({
    title,
    message,
    confirmButtonText: confirm,
    confirmButtonColor: danger ? 'var(--status-danger)' : undefined,
    cancelButtonText: 'Vazgeç',
  }).then(
    () => true,
    () => false,
  )
}
