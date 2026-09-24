<script setup lang="ts">
import { Phone } from 'lucide-vue-next'
import { formatPhone, telHref } from '@/core/format/phone'
import type { Participant } from '@/core/sites/participants'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Şantiyenin katılımcıları (WhatsApp Masaüstü'ndeki grup bilgisi gibi): en üstte "Sen", yanında rol etiketi,
 * numarası okunur biçimde (tıklayınca arar). Patron satırın ⌄ menüsünden giriş linki gönderir ("giremiyorum"
 * derse), kişiyi düzeltir ya da şantiyeden çıkarır. Kimsenin durumu yazmaz.
 */
type Command = 'link' | 'edit' | 'remove'
const { participants, canManage = false } = defineProps<{ participants: Participant[]; canManage?: boolean }>()
const emit = defineEmits<{
  add: []
  link: [participant: Participant]
  edit: [participant: Participant]
  remove: [participant: Participant]
}>()

function onCommand(command: Command, participant: Participant) {
  if (command === 'link') emit('link', participant)
  if (command === 'edit') emit('edit', participant)
  if (command === 'remove') emit('remove', participant)
}
</script>

<template>
  <el-button v-if="canManage" plain class="participants__add" @click="emit('add')">＋ Katılımcı ekle</el-button>
  <ul class="participants">
    <li v-for="participant in participants" :key="participant.id" class="participants__row">
      <UserAvatar :name="participant.isViewer ? 'Sen' : participant.name" :size="36" />
      <span class="participants__who">
        <strong>{{ participant.name }}</strong>
        <a v-if="participant.phone" :href="telHref(participant.phone)"><Phone :size="12" />{{ formatPhone(participant.phone) }}</a>
      </span>
      <span class="participants__role">{{ participant.role }}</span>
      <el-dropdown v-if="canManage && !participant.isViewer" trigger="click"
        @command="(command: Command) => onCommand(command, participant)">
        <el-button text size="small" aria-label="Katılımcı menüsü">⌄</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="link">Giriş linki gönder</el-dropdown-item>
            <el-dropdown-item command="edit">Düzenle</el-dropdown-item>
            <el-dropdown-item command="remove" divided class="participants__danger">Şantiyeden çıkar</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </li>
  </ul>
</template>

<style scoped>
.participants {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.participants__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.participants__who {
  display: grid;
  flex: 1;
  min-width: 0;
}

.participants__who a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-decoration: none;
}

.participants__role {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--brand-tint);
  color: var(--brand-primary);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
}

.participants__add {
  justify-self: start;
}

.participants__danger {
  color: var(--status-danger);
}
</style>
