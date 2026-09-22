<script setup lang="ts">
import { Phone } from 'lucide-vue-next'
import type { SiteLead } from '@/core/api/generated/model'
import { telHref } from '@/core/format/phone'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Şantiye künyesi: sorumlular ve telefonları. Bilgisayar her zaman arayamaz; numara düğmede yazılı durur,
 * tıklanınca bağlı telefon uygulaması açılır. Kişi kendini aramaz. Sorumlu yoksa olumsuz bilgi yer kaplamaz:
 * patron (canAssign) "Sorumlu ata" bağlantısını görür.
 */
const { leads, viewerId, canAssign = false } = defineProps<{
  leads: SiteLead[]
  viewerId?: string
  canAssign?: boolean
}>()
</script>

<template>
  <ul v-if="leads.length" class="lead-contacts">
    <li v-for="lead in leads" :key="lead.id" class="lead-contacts__lead">
      <UserAvatar :name="lead.fullName" :size="36" />
      <span class="lead-contacts__who">
        <strong>{{ lead.fullName }}</strong>
        <span>Şantiye sorumlusu</span>
      </span>
      <el-button v-if="lead.phone && lead.id !== viewerId" tag="a" :href="telHref(lead.phone)" size="small"
        class="lead-contacts__call">
        <Phone :size="14" class="lead-contacts__icon" />{{ lead.phone }}
      </el-button>
    </li>
  </ul>
  <el-link v-else-if="canAssign" type="primary" @click="$router.push({ name: 'team' })">Sorumlu ata ›</el-link>
</template>

<style scoped>
.lead-contacts {
  display: grid;
  gap: var(--space-3);
  margin: 0;
  padding: 0;
  list-style: none;
}

.lead-contacts__lead {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--space-1) var(--space-3);
}

.lead-contacts__who {
  display: grid;
  min-width: 0;
}

.lead-contacts__who span {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.lead-contacts__call {
  grid-column: 2;
  justify-self: start;
  text-decoration: none;
}

.lead-contacts__icon {
  margin-right: 6px;
}
</style>
