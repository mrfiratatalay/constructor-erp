// Ekip: her kişi firmanın katılım bağlantısıyla kendi oturumunu açar (gerçekteki gibi), patron rolünü verir.
// Puantaj cetveli ayrıca kurulur: ustalar ve taşeron ekipler uygulama kullanmadan da yoklamada durur.
import { Session } from './api.mjs'
import { MEMBERS, ROSTER } from './content.mjs'

async function join(token, member) {
  const session = new Session(member.key)
  await session.post(`/api/join/${token}`, { fullName: member.fullName, phone: member.phone })
  const me = await session.get('/api/auth/me')
  return { session, me }
}

/** Döner: { ayse: { session, id }, … } — kişinin oturumu ve üyelik kimliği. */
export async function seedMembers(owner) {
  const { url } = await owner.get('/api/company/join-link')
  const token = url.split('/katil/')[1]
  const people = {}
  for (const member of MEMBERS) {
    const { session, me } = await join(token, member)
    const id = me.memberId ?? me.membershipId ?? me.id
    await owner.patch(`/api/team/members/${id}`, {
      fullName: member.fullName, phone: member.phone, role: member.role, active: true,
    })
    people[member.key] = { session, id, me }
  }
  return people
}

/** Döner: { 'Ali Yılmaz': id, … } — cetveldeki her satırın kimliği. */
export async function seedRoster(owner) {
  const ids = {}
  for (const entry of ROSTER) {
    const created = await owner.post('/api/puantaj/entries', { ...entry, phone: null })
    ids[entry.name] = created.id
  }
  return ids
}
