<script setup lang="ts">
import { computed, ref } from 'vue'
import { Phone } from 'lucide-vue-next'
import { formatPhone, telHref } from '@/core/format/phone'
import type { Participant } from '@/core/sites/participants'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Şantiyenin katılımcıları (WhatsApp'taki grup bilgisi gibi): en üstte "Sen", yanında rol etiketi; kişinin
 * numarası okunur biçimde ve tek dokunuşla arama. Patron bir kişiye dokununca: Kişi bilgisi, Ara, Şantiyeden çıkar.
 */
const { participants, canManage = false } = defineProps<{ participants: Participant[]; canManage?: boolean }>()
const emit = defineEmits<{ add: []; view: [participant: Participant]; remove: [participant: Participant] }>()
const chosen = ref<Participant | null>(null)
const actions = computed(() => [
  { name: 'Kişi bilgisi', key: 'view' },
  ...(chosen.value?.phone ? [{ name: `Ara · ${formatPhone(chosen.value.phone)}`, key: 'call' }] : []),
  { name: 'Şantiyeden çıkar', key: 'remove', color: 'var(--status-danger)' },
])

function choose(participant: Participant) {
  if (canManage && !participant.isViewer) chosen.value = participant
}

function onAction(action: { key: string }) {
  const participant = chosen.value
  chosen.value = null
  if (!participant) return
  if (action.key === 'view') emit('view', participant)
  if (action.key === 'call' && participant.phone) window.location.href = telHref(participant.phone)
  if (action.key === 'remove') emit('remove', participant)
}
</script>

<template>
  <van-cell-group inset class="participants">
    <van-cell v-if="canManage" title="＋ Katılımcı ekle" clickable @click="emit('add')" />
    <van-cell v-for="participant in participants" :key="participant.id" :title="participant.name" center
      :label="participant.phone ? formatPhone(participant.phone) : undefined" :clickable="canManage && !participant.isViewer"
      @click="choose(participant)">
      <template #icon><UserAvatar :name="participant.isViewer ? 'Sen' : participant.name" :size="40" class="participants__avatar" /></template>
      <template #value>
        <span class="participants__role">{{ participant.role }}</span>
        <van-button v-if="participant.phone && !canManage" round size="mini" type="primary" plain tag="a"
          :href="telHref(participant.phone)" class="participants__call" @click.stop>
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
