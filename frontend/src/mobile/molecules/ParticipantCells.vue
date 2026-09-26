<script setup lang="ts">
import { computed, ref } from 'vue'
import { Phone } from 'lucide-vue-next'
import { formatPhone, telHref } from '@/core/format/phone'
import type { Participant } from '@/core/sites/participants'
import { personMenu, type PersonAction } from '@/core/team/personMenu'
import { sheetItems } from '@/mobile/postActions'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Şantiyenin katılımcıları (WhatsApp'taki grup bilgisi gibi): firmanın herkesi, en üstte "Sen", yanında rol
 * etiketi ve numarası. En üstte "＋ Kişi ekle" herkeste, firmanın bağlantısını açar. Patron bir kişiye dokununca
 * alttan menü: Ara, Giriş linki gönder, Düzenle, Patron yap, Firmadan çıkar. Şef yanındaki 📞 ile arar.
 */
const { participants, canManage = false } = defineProps<{ participants: Participant[]; canManage?: boolean }>()
const emit = defineEmits<{ add: []; act: [action: PersonAction, participant: Participant] }>()
const chosen = ref<Participant | null>(null)
const actions = computed(() => {
  const person = chosen.value
  if (!person) return []
  const call = person.phone && !person.isViewer ? [{ name: `Ara · ${formatPhone(person.phone)}`, key: 'call' }] : []
  return [...call, ...sheetItems(personMenu(person, canManage))]
})

const choose = (participant: Participant) => personMenu(participant, canManage).length && (chosen.value = participant)

function onAction(action: { key: string }) {
  const participant = chosen.value
  chosen.value = null
  if (!participant) return
  if (action.key === 'call' && participant.phone) window.location.href = telHref(participant.phone)
  else emit('act', action.key as PersonAction, participant)
}
</script>

<template>
  <van-cell-group inset class="participants">
    <van-cell title="＋ Kişi ekle" clickable @click="emit('add')" />
    <van-cell v-for="participant in participants" :key="participant.id" :title="participant.name" center
      :label="participant.phone ? formatPhone(participant.phone) : undefined"
      :clickable="personMenu(participant, canManage).length > 0" @click="choose(participant)">
      <template #icon><UserAvatar :name="participant.name" :size="40" class="participants__avatar" /></template>
      <template #value>
        <span class="participants__role">{{ participant.roleLabel }}</span>
        <van-button v-if="participant.phone && !canManage && !participant.isViewer" round size="mini" type="primary"
          plain tag="a" :href="telHref(participant.phone)" class="participants__call" @click.stop>
          <Phone :size="13" />
        </van-button>
      </template>
    </van-cell>
  </van-cell-group>
  <van-action-sheet :show="chosen !== null" :actions="actions" :description="chosen?.name" cancel-text="Vazgeç"
    teleport="body" @select="onAction" @update:show="(open: boolean) => !open && (chosen = null)" />
</template>

<style scoped>
.participants {
  --van-cell-background: var(--surface-muted);
}

.participants__avatar {
  margin-right: var(--space-3);
}

.participants__role {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--brand-tint);
  color: var(--brand-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}

.participants__call {
  margin-left: var(--space-2);
}
</style>
