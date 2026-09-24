<script setup lang="ts">
import { formatPhone } from '@/core/format/phone'
import type { Participant } from '@/core/sites/participants'
import { personMenu, type PersonAction } from '@/core/team/personMenu'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Şantiyenin katılımcıları (WhatsApp Masaüstü'ndeki grup bilgisi gibi): firmanın herkesi, en üstte "Sen", yanında
 * rol etiketi ve numarası (bilgisayar arayamaz; numara telefondan aranır). Patron satırın ⌄ menüsünden giriş linki
 * gönderir, düzeltir, patron yapar ya da firmadan çıkarır; "＋ Kişi ekle" firmanın bağlantısını açar.
 * Kimsenin durumu yazmaz.
 */
const { participants, canManage = false } = defineProps<{ participants: Participant[]; canManage?: boolean }>()
const emit = defineEmits<{ add: []; act: [action: PersonAction, participant: Participant] }>()
</script>

<template>
  <el-button v-if="canManage" plain class="participants__add" @click="emit('add')">＋ Kişi ekle</el-button>
  <ul class="participants">
    <li v-for="participant in participants" :key="participant.id" class="participants__row">
      <UserAvatar :name="participant.name" :size="36" />
      <span class="participants__who">
        <strong>{{ participant.name }}</strong>
        <small v-if="participant.phone">{{ formatPhone(participant.phone) }}</small>
      </span>
      <span class="participants__role">{{ participant.roleLabel }}</span>
      <el-dropdown v-if="personMenu(participant, canManage).length" trigger="click"
        @command="(action: PersonAction) => emit('act', action, participant)">
        <el-button text size="small" aria-label="Kişi menüsü">⌄</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in personMenu(participant, canManage)" :key="item.action"
              :command="item.action" :divided="item.danger" :class="{ participants__danger: item.danger }">
              {{ item.label }}
            </el-dropdown-item>
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

.participants__who small {
  color: var(--text-muted);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
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
