import type { MediaView, TaskDeliveryView } from '@/core/api/generated/model'
import { dateTime } from '@/core/format/dates'
import type { StatusTone } from '@/core/format/statusTone'
import { taskName } from '@/core/tasks/taskIcon'

/** review: şefin "İNCELE" düğmesi. redeliver: çalışanın "İş Teslim Et" düğmesi (eksik dönmüş işte). */
export type DeliveryAction = 'review' | 'redeliver' | null

/** showMark: şefin eksik cevabında noktalı fotoğraf gösterilir (çalışan eksik olan yeri görsün). */
export interface DeliveryCard {
  title: string
  lines: string[]
  status: { label: string; tone: StatusTone } | null
  action: DeliveryAction
  showMark: boolean
}

const DELIVERY_STATUS: Record<TaskDeliveryView['status'], { label: string; tone: StatusTone }> = {
  PENDING: { label: 'Kontrol bekliyor', tone: 'warning' },
  APPROVED: { label: 'Onaylandı', tone: 'success' },
  RETURNED: { label: 'Eksik var', tone: 'danger' },
}

/**
 * Sohbetteki iş teslimi kartı. Aynı teslime iki mesaj bağlıdır: çalışanın fotoğraflı teslimi ve şefin cevabı.
 * postId hangisinin baloncuğunda olduğunu söyler. Teslim: "✅ İŞ TESLİM EDİLDİ", iş, 👤 kim, 📷 kaç fotoğraf,
 * durum ve şefte "İNCELE". Cevap: "✅ TAMAMLANDI" ve onaylayan ya da "❌ İŞ TAMAMLANMADI", eksik notu, yeri ve
 * noktalı fotoğraf; işin sorumlusunda "İşi Teslim Et".
 */
export function deliveryCard(view: TaskDeliveryView, postId: string): DeliveryCard {
  const task = taskName(view.taskTitle)
  if (postId === view.postId) {
    return {
      title: '✅ İŞ TESLİM EDİLDİ',
      lines: [task, `👤 ${view.deliveredBy.fullName}`, `📷 ${view.photos.length} fotoğraf`],
      status: DELIVERY_STATUS[view.status],
      action: view.canReview ? 'review' : null,
      showMark: false,
    }
  }
  if (view.status === 'RETURNED') {
    return {
      title: '❌ İŞ TAMAMLANMADI',
      lines: [`Eksik: ${view.missingNote ?? ''}`, `📍 ${view.siteName} · ${task}`],
      status: null,
      action: view.canRedeliver ? 'redeliver' : null,
      showMark: !!view.mark,
    }
  }
  const reviewer = view.reviewedBy ? `Onaylayan: ${view.reviewedBy.fullName}` : ''
  const at = view.reviewedAt ? ` · ${dateTime(view.reviewedAt)}` : ''
  return { title: '✅ TAMAMLANDI', lines: [task, reviewer + at], status: null, action: null, showMark: false }
}

/** Eksik gösterilen fotoğraf: şefin noktayı koyduğu fotoğraf; nokta yoksa gösterilmez. */
export function markedPhoto(view: TaskDeliveryView): MediaView | null {
  if (!view.mark) return null
  return view.photos.find((photo) => photo.id === view.mark?.mediaId) ?? null
}

/**
 * Kart kendini tazeler (sohbetin akışı gibi): fotoğraf sunucuda işlenirken sık (4 sn; "Hazırlanıyor" kalmasın),
 * sonra seyrek (15 sn; öbür telefondaki şefin cevabı karttaki durumu değiştirir).
 */
export function deliveryRefreshInterval(view: TaskDeliveryView | undefined): number {
  return view?.photos.some((photo) => photo.status === 'PROCESSING') ? 4_000 : 15_000
}
