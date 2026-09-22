<script setup lang="ts">
import { Phone } from 'lucide-vue-next'
import type { SiteLead } from '@/core/api/generated/model'
import { telHref } from '@/core/format/phone'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Şantiye künyesi: sorumlular ve tek dokunuşla arama; kişi kendini aramaz. Sorumlu yoksa olumsuz bilgi
 * kart kaplamaz: patron (canAssign) "Sorumlu ata" bağlantısını görür, şef hiçbir şey görmez.
 */
const { leads, viewerId, canAssign = false } = defineProps<{
  leads: SiteLead[]
  viewerId?: string
  canAssign?: boolean
}>()
</script>

<template>
  <van-cell-group v-if="leads.length" inset>
    <van-cell v-for="lead in leads" :key="lead.id" :title="lead.fullName" label="Şantiye sorumlusu" center>
      <template #icon><UserAvatar :name="lead.fullName" :size="40" class="lead-cell__avatar" /></template>
      <template v-if="lead.phone && lead.id !== viewerId" #right-icon>
        <van-button round size="small" type="primary" plain tag="a" :href="telHref(lead.phone)">
          <Phone :size="15" class="lead-cell__icon" />Ara
        </van-button>
      </template>
    </van-cell>
  </van-cell-group>
  <van-cell-group v-else-if="canAssign" inset>
    <van-cell title="Sorumlu atanmadı" value="Ata" is-link :to="{ name: 'team' }" />
  </van-cell-group>
</template>

<style scoped>
.lead-cell__avatar {
  margin-right: var(--space-3);
}

.lead-cell__icon {
  margin-right: 4px;
  vertical-align: -3px;
}
</style>
