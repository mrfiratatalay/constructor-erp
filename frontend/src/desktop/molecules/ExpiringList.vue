<script setup lang="ts">
import type { TenantRow } from '@/core/api/generated/model'
import { fullDate } from '@/core/format/dates'

/** Aboneliği yakında bitecek firmalar: kalan gün en az olan üstte; tıklayınca firmanın sayfası açılır. */
const { tenants } = defineProps<{ tenants: TenantRow[] }>()
const emit = defineEmits<{ open: [companyId: string] }>()
</script>

<template>
  <el-empty v-if="!tenants.length" :image-size="64" description="Önümüzdeki 14 günde biten abonelik yok" />
  <ul v-else class="expiring">
    <li v-for="tenant in tenants" :key="tenant.id">
      <button type="button" @click="emit('open', tenant.id)">
        <span><strong>{{ tenant.name }}</strong><small>{{ tenant.planName }} · {{ fullDate(tenant.endsOn!) }}</small></span>
        <el-tag :type="(tenant.daysLeft ?? 0) <= 3 ? 'danger' : 'warning'" round>{{ tenant.daysLeft }} gün</el-tag>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.expiring {
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;
}

.expiring button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-3) 0;
  border: 0;
  border-bottom: 1px solid var(--border-soft);
  background: none;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.expiring span {
  display: grid;
}

.expiring small {
  color: var(--text-muted);
}
</style>
