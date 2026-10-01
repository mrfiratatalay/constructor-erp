import { ElMessageBox } from 'element-plus'

export interface ConfirmRequest {
  title: string
  message: string
  /** Onay düğmesinin yazısı: işin kendisi ("Sil", "Çıkar", "Sıfırla"), "Tamam" değil. */
  confirm: string
  /** Geri dönüşü zor iş (silme, çıkarma, iptal): onay düğmesi kırmızı. Varsayılan. */
  danger?: boolean
}

/**
 * Masaüstündeki her onay penceresi aynıdır: soru başlıkta, sonucu altta, Vazgeç solda, iş sağda; yıkıcı işte iş
 * düğmesi kırmızı. Vazgeçilirse ya da pencere kapanırsa false döner (Element Plus'ın fırlattığı "cancel" yutulur).
 */
export function confirmAction({ title, message, confirm, danger = true }: ConfirmRequest): Promise<boolean> {
  return ElMessageBox.confirm(message, title, {
    confirmButtonText: confirm,
    cancelButtonText: 'Vazgeç',
    type: 'warning',
    confirmButtonClass: danger ? 'el-button--danger' : '',
  }).then(
    () => true,
    () => false,
  )
}
