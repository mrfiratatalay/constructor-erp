<script setup lang="ts">
import { Plus, Trash2 } from 'lucide-vue-next'
import type { MaterialView } from '@/core/api/generated/model'
import type { LineDraft } from '@/core/shipments/shipmentForm'

const lines = defineModel<LineDraft[]>({ required: true })
const { materials } = defineProps<{ materials: MaterialView[] }>()
const emit = defineEmits<{ add: []; createMaterial: [index: number] }>()
const unitOf = (id: string) => materials.find((material) => material.id === id)?.unit ?? '—'
</script>

<template>
  <div class="lines">
    <div class="lines__labels"><span>Malzeme</span><span>Miktar</span><span /></div>
    <div v-for="(line, index) in lines" :key="line.key" class="lines__row">
      <el-select v-model="line.materialId" filterable placeholder="Malzeme seçin" :aria-label="`${index + 1}. malzeme`">
        <el-option v-for="material in materials" :key="material.id" :label="material.name" :value="material.id" />
        <template #footer>
          <el-button link type="primary" @click="emit('createMaterial', index)">+ Yeni malzeme ekle</el-button>
        </template>
      </el-select>
      <div class="lines__quantity">
        <el-input-number v-model="line.quantity" :min="0" :controls="false" placeholder="0"
          :aria-label="`${index + 1}. malzeme miktarı`" />
        <span class="lines__unit">{{ unitOf(line.materialId) }}</span>
      </div>
      <el-button text :disabled="lines.length === 1" :aria-label="`${index + 1}. malzemeyi kaldır`"
        @click="lines.splice(index, 1)"><Trash2 :size="16" /></el-button>
    </div>
  </div>
  <el-button link type="primary" class="lines__add" @click="emit('add')"><Plus :size="15" /> Malzeme ekle</el-button>
</template>

<style scoped>
.lines { border: 1px solid var(--border-soft); border-radius: var(--radius-sm); padding: var(--space-3); background: var(--surface-muted); }
.lines__labels, .lines__row { display: grid; grid-template-columns: minmax(0, 1fr) 144px 28px; gap: var(--space-2); align-items: center; }
.lines__labels { color: var(--text-muted); font-size: var(--text-xs); padding-bottom: var(--space-2); }
.lines__row + .lines__row { margin-top: var(--space-2); }
.lines__quantity { display: flex; align-items: center; gap: var(--space-2); min-width: 0; }
.lines__quantity :deep(.el-input-number) { width: 88px; flex: 0 0 88px; }
.lines__unit { color: var(--text-muted); font-size: var(--text-xs); overflow-wrap: anywhere; }
.lines__row > .el-button { width: 28px; padding: 0; color: var(--text-subtle); }
.lines__add { margin-top: var(--space-3); gap: var(--space-1); }
@media (max-width: 480px) {
  .lines__labels, .lines__row { grid-template-columns: minmax(0, 1fr) 110px 24px; }
  .lines__quantity :deep(.el-input-number) { width: 68px; flex-basis: 68px; }
}
</style>
