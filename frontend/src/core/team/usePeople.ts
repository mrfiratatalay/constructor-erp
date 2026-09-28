import { useQueryClient } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { useIssueLoginLink, useUpdateMember } from '@/core/api/generated/team/team'
import type { MemberViewRole, UpdateMemberRequest } from '@/core/api/generated/model'
import type { Participant } from '@/core/sites/participants'
import type { IssuedLink } from '@/core/team/loginLink'
import type { MemberForm } from '@/core/team/memberForm'

/**
 * Patronun kişilerle işleri (şantiye bilgisindeki Katılımcılar): düzelt, rolünü değiştir, firmadan çıkar, giriş linki
 * gönder. Yeni kişi buradan eklenmez, firmanın bağlantısıyla kendisi gelir. Kişi değişince her ekran yenilenir:
 * adı mesajlarda, listede ve başlıkta görünür; herkes her şantiyede olduğu için her şantiyede aynıdır.
 */
export function usePeople() {
  const queryClient = useQueryClient()
  const update = useUpdateMember({ mutation: { onSuccess: () => queryClient.invalidateQueries() } })
  const issue = useIssueLoginLink()
  const issued = ref<IssuedLink | null>(null)

  /** Sunucu kişinin bütün alanlarını baştan yazar; değişmeyenler olduğu gibi gönderilir. */
  function save(person: Participant, change: Partial<UpdateMemberRequest>) {
    const data: UpdateMemberRequest = { fullName: person.fullName, phone: person.phone, role: person.role, active: true }
    return update.mutateAsync({ memberId: person.id, data: { ...data, ...change } })
  }

  /** Kişi "giremiyorum" derse ya da telefonunu değiştirirse: WhatsApp'ta doğrudan onun sohbetine gider. */
  async function sendLoginLink(person: Participant) {
    issued.value = { member: person, link: await issue.mutateAsync({ memberId: person.id }) }
  }

  return {
    issued,
    edit: (person: Participant, form: MemberForm) => save(person, form),
    setRole: (person: Participant, role: MemberViewRole) => save(person, { role }),
    remove: (person: Participant) => save(person, { active: false }),
    sendLoginLink,
    isSaving: computed(() => update.isPending.value || issue.isPending.value),
  }
}
