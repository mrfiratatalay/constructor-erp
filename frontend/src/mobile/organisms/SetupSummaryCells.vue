<script setup lang="ts">
import type { SetupInviteView } from '@/core/api/generated/model'
import { dayWithYear } from '@/core/format/dates'
import type { SetupForms } from '@/core/onboarding/setupSteps'
import { featureLabel } from '@/core/tenant/features'

/** Son adım telefonda: girilenlerin özeti ve paketin açtığı modüller. */
const { forms, invite } = defineProps<{ forms: SetupForms; invite: SetupInviteView }>()
</script>

<template>
  <van-cell-group inset title="Kontrol edin">
    <van-cell title="Firma" :value="forms.company.name" />
    <van-cell title="Patron" :value="forms.owner.fullName" :label="forms.owner.email" />
    <van-cell title="İlk şantiye" :value="forms.withSite ? forms.site.name : 'Sonra açılacak'" />
    <van-cell v-if="invite.planName" title="Paket" :value="invite.planName"
      :label="invite.endsOn ? `${dayWithYear(invite.endsOn)} tarihine kadar` : undefined" />
  </van-cell-group>
  <div v-if="invite.features.length" class="setup-features">
    <van-tag v-for="key in invite.features" :key="key" plain round type="success" size="medium">
      {{ featureLabel(key) }}
    </van-tag>
  </div>
</template>

<style scoped>
.setup-features {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: var(--space-3) var(--space-4) 0;
}
</style>
