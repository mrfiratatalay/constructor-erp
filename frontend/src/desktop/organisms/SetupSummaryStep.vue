<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { SetupInviteView } from '@/core/api/generated/model'
import { dayWithYear } from '@/core/format/dates'
import type { SetupForms } from '@/core/onboarding/setupSteps'
import { featureLabel } from '@/core/tenant/features'

/** Son adım: girilenlerin özeti ve firmanın paketi. "Kurulumu bitir" bu özetin altındadır. */
const { forms, invite } = defineProps<{ forms: SetupForms; invite: SetupInviteView }>()
</script>

<template>
  <div class="setup-summary">
    <el-descriptions :column="1" border>
      <el-descriptions-item label="Firma">{{ forms.company.name }}</el-descriptions-item>
      <el-descriptions-item label="Patron">
        {{ forms.owner.fullName }} · {{ forms.owner.email }}
      </el-descriptions-item>
      <el-descriptions-item label="İlk şantiye">
        {{ forms.withSite ? forms.site.name : 'Sonra açılacak' }}
      </el-descriptions-item>
      <el-descriptions-item v-if="invite.planName" label="Paket">
        {{ invite.planName }}<template v-if="invite.endsOn"> · {{ dayWithYear(invite.endsOn) }} tarihine kadar</template>
      </el-descriptions-item>
    </el-descriptions>
    <ul v-if="invite.features.length" class="setup-summary__features">
      <li v-for="key in invite.features" :key="key"><Check :size="16" /> {{ featureLabel(key) }}</li>
    </ul>
  </div>
</template>

<style scoped>
.setup-summary {
  display: grid;
  gap: var(--space-4);
}

.setup-summary__features {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.setup-summary__features li {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.setup-summary__features svg {
  color: var(--status-success);
}
</style>
