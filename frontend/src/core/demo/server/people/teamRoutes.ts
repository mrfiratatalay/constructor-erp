import type { InviteLink, MemberView, UpdateMemberRequest } from '@/core/api/generated/model'
import { at } from '@/core/demo/server/demoClock'
import { badRequest, notFound } from '@/core/demo/server/demoError'
import { newToken } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { patch, post } from '@/core/demo/server/demoRouter'
import { personById, requireRole, type Member } from '@/core/demo/server/demoSession'
import type { PersonRecord } from './peopleRecords'
import { memberViewOf } from './sessionViews'

function memberOf(owner: Member, memberId: string): PersonRecord {
  const person = personById(memberId)
  if (!person || person.companyId !== owner.company.id) throw notFound('Kişi')
  return person
}

/** Patron kendini çıkaramaz, kendi rolünü düşüremez: firma patronsuz kalmasın. */
function updateMember({ params, body }: DemoRequest): MemberView {
  const owner = requireRole('OWNER')
  const person = memberOf(owner, params.memberId!)
  const form = body as UpdateMemberRequest
  const selfChange = person.id === owner.person.id && (form.role !== person.role || !form.active)
  if (selfChange) throw badRequest('Kendini firmadan çıkaramaz ya da kendi rolünü değiştiremezsin.')
  if (!form.fullName.trim()) throw badRequest('Adını yaz.')
  Object.assign(person, { fullName: form.fullName.trim(), phone: form.phone ?? null, role: form.role, active: form.active })
  return memberViewOf(person)
}

/** "Giremiyorum" diyen kişiye WhatsApp'tan gönderilen tek kullanımlık link. */
function issueLoginLink({ params }: DemoRequest): InviteLink {
  const person = memberOf(requireRole('OWNER'), params.memberId!)
  if (!person.active) throw badRequest('Firmadan çıkarılmış bir kişiye giriş linki gönderilemez.')
  person.loginToken = newToken()
  return { url: `${location.origin}/davet/${person.loginToken}`, expiresAt: at(7, '23:59') }
}

export const teamRoutes = [
  patch('/api/team/members/:memberId', updateMember),
  post('/api/team/members/:memberId/login-link', issueLoginLink),
]
