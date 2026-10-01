<script setup lang="ts">
import { Mail, MapPin, Phone } from 'lucide-vue-next'
import type { CompanyProfileView } from '@/core/api/generated/model'

const { profile } = defineProps<{ profile: CompanyProfileView }>()
</script>

<template>
  <dl class="company-contact">
    <div>
      <dt><Phone :size="15" aria-hidden="true" />Telefon</dt>
      <dd :class="{ 'is-empty': !profile.phone }">{{ profile.phone || 'Bilgi eklenmedi' }}</dd>
    </div>
    <div>
      <dt><MapPin :size="15" aria-hidden="true" />Şehir</dt>
      <dd :class="{ 'is-empty': !profile.city }">{{ profile.city || 'Bilgi eklenmedi' }}</dd>
    </div>
    <div class="company-contact__email">
      <dt><Mail :size="15" aria-hidden="true" />E-posta</dt>
      <dd :class="{ 'is-empty': !profile.email }">{{ profile.email || 'Bilgi eklenmedi' }}</dd>
    </div>
  </dl>
</template>

<style scoped>
.company-contact { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-5); margin: 0; padding-top: var(--space-5); border-top: 1px solid var(--border-soft); }
.company-contact__email { grid-column: 1 / -1; }
.company-contact dt { display: flex; align-items: center; gap: var(--space-2); color: var(--text-muted); font-size: var(--text-xs); }
.company-contact dd { margin: var(--space-2) 0 0; color: var(--text-strong); font-size: var(--text-sm); font-weight: var(--weight-medium); overflow-wrap: anywhere; }
.company-contact dd.is-empty { color: var(--text-subtle); font-weight: 400; }
@media (max-width: 560px) { .company-contact { grid-template-columns: 1fr; gap: var(--space-4); } }
</style>
