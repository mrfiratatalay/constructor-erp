import type { RollCallView } from '@/core/api/generated/model'
import { clockTime, dayTitle } from '@/core/format/dates'
import { statusLabel } from '@/core/rollcall/rollCallLabels'

/** join: "Yoklamaya Katıl" düğmesi. roll: patronun "Yoklamayı gör"ü. none: düğme yok (katıldı ya da kapandı). */
export type CardAction = 'join' | 'roll' | 'none'

export interface RollCallCard {
  title: string
  joined: string
  status: string
  action: CardAction
}

/**
 * Sohbetteki yoklama mesajının kartı. Çalışan kendi durumunu görür ("✓ Katıldın · 08:12") ya da düğmeye basar;
 * patron yoklamada sayılmaz, yalnızca kaç kişinin katıldığını görür ve modüle geçer. Dünkü mesaj kapanmıştır.
 * siteName: kartın durduğu şantiye; kişi başka şantiyenin mesajından katıldıysa o şantiyenin adı da yazar.
 */
export function rollCallCard(day: string, view: RollCallView | undefined, isOwner: boolean, siteName: string): RollCallCard {
  const card = { title: `Yoklama · ${dayTitle(day)}`, joined: joinedLine(view), status: '', action: 'none' as CardAction }
  if (isOwner) return { ...card, action: 'roll' }
  if (!view) return card
  const mine = view.mine
  if (mine?.status === 'PRESENT') return { ...card, status: joinedStatus(mine.checkedInAt, mine.siteName, siteName) }
  if (!view.open) return { ...card, status: 'Yoklama kapandı' }
  return { ...card, status: mine ? `${statusLabel(mine.status)} olarak işaretlendi` : '', action: 'join' }
}

function joinedLine(view: RollCallView | undefined): string {
  if (!view) return ''
  return view.joinedCount ? `${view.joinedCount} kişi katıldı` : 'Henüz katılan yok'
}

function joinedStatus(checkedInAt: string | null | undefined, joinedSite: string | null | undefined, here: string): string {
  if (!checkedInAt) return '✓ Geldi olarak işaretlendi'
  const elsewhere = joinedSite && joinedSite !== here ? ` · ${joinedSite}` : ''
  return `✓ Katıldın · ${clockTime(checkedInAt)}${elsewhere}`
}
