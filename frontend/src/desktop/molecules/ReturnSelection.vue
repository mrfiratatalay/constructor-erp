<script setup lang="ts">
import { ArrowDown, Warehouse, Building2 } from 'lucide-vue-next'
import type { ShipmentRow } from '@/core/api/generated/model'
import { shipmentNumber, withUnit } from '@/core/shipments/quantity'

const returnId = defineModel<string | null>({ required: true })
defineProps<{ awaiting: ShipmentRow[]; original: ShipmentRow | null; loading: boolean; failed: boolean }>()
const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <section>
    <h3 class="return__heading">Kaynak</h3>
    <el-form-item label="Geri beklenen hareket">
      <el-select v-model="returnId" filterable :loading="loading" placeholder="Harici çıkışı seçin" class="return__select">
        <el-option v-for="row in awaiting" :key="row.id" :value="row.id"
          :label="`${shipmentNumber(row.number)} · ${row.toName ?? 'Harici firma'}`" />
      </el-select>
    </el-form-item>
    <div v-if="failed" class="return__empty">Hareketler yüklenemedi. <el-button link type="primary" @click="emit('retry')">Tekrar dene</el-button></div>
    <p v-else-if="!loading && !awaiting.length" class="return__empty">Geri beklenen malzeme hareketi bulunmuyor.</p>
    <div v-if="original" class="return__route">
      <span><Building2 :size="18" /> {{ original.toName }}</span>
      <ArrowDown :size="16" class="return__arrow" aria-hidden="true" />
      <span><Warehouse :size="18" /> {{ original.fromName }}</span>
    </div>
  </section>
  <section v-if="original" class="return__materials">
    <h3 class="return__heading">Malzemeler</h3>
    <div v-for="line in original.lines" :key="line.materialId" class="return__line">
      <span>{{ line.materialName }}</span><strong>{{ withUnit(line.quantity, line.unit) }}</strong>
    </div>
    <p class="return__note">Bu işlem listedeki tüm malzemelerin tam miktarıyla geri geldiğini kaydeder.</p>
  </section>
</template>

<style scoped>
.return__heading { font-size: var(--text-xs); text-transform: uppercase; letter-spacing: .08em; margin: 0 0 var(--space-4); }
.return__select { width: 100%; }
.return__empty, .return__note { font-size: var(--text-sm); color: var(--text-muted); line-height: 1.6; }
.return__route { display: grid; gap: var(--space-3); border: 1px solid var(--border-soft); padding: var(--space-4); border-radius: var(--radius-md); background: var(--surface-muted); }
.return__route span { display: flex; align-items: center; gap: var(--space-3); font-size: var(--text-sm); font-weight: var(--weight-semibold); }
.return__route svg { color: var(--text-muted); }
.return__arrow { margin-left: 1px; }
.return__materials { padding-top: var(--space-6); }
.return__line { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) 0; border-bottom: 1px solid var(--border-soft); font-size: var(--text-sm); }
.return__line strong { white-space: nowrap; font-weight: var(--weight-semibold); }
.return__note { margin-top: var(--space-4); padding: var(--space-3); border-radius: var(--radius-sm); background: var(--status-warning-bg); color: var(--status-warning); }
</style>
