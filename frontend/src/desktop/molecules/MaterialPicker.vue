<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { MaterialView } from '@/core/api/generated/model'
import MaterialGlyph from '@/shared/atoms/MaterialGlyph.vue'

/**
 * Malzeme seçimi: adla ya da kodla aranır, satırda kategori ve birim yazar. Aranan malzeme yoksa yetkili kişi listenin
 * altındaki "Yeni malzeme oluştur" ile kartı açar; yazdığı ad forma taşınır, hareket formu kaybolmaz.
 */
const model = defineModel<string | null>({ required: true })
const { materials, canCreate, disabled = false } = defineProps<{
  materials: MaterialView[]
  canCreate: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ create: [name: string] }>()
const typed = ref('')
const selected = () => materials.find((material) => material.id === model.value)
const filter = (query: string) => (typed.value = query)
const visible = () => {
  const query = typed.value.trim().toLocaleLowerCase('tr')
  return materials.filter((item) => `${item.name} ${item.code ?? ''}`.toLocaleLowerCase('tr').includes(query))
}
</script>

<template>
  <el-select v-model="model" filterable :filter-method="filter" placeholder="Malzeme seç ya da ara" size="large"
    :disabled="disabled" no-match-text="Bu adla malzeme yok" @visible-change="(open: boolean) => open && (typed = '')">
    <template #prefix><MaterialGlyph v-if="selected()" :name="selected()!.name" :size="22" /></template>
    <el-option v-for="material in visible()" :key="material.id" :value="material.id" :label="material.name">
      <el-row justify="space-between" align="middle" style="width: 100%">
        <el-space :size="8"><MaterialGlyph :name="material.name" :size="22" />{{ material.name }}</el-space>
        <el-text type="info" size="small">{{ material.category }} · {{ material.unit }}</el-text>
      </el-row>
    </el-option>
    <template v-if="canCreate" #footer>
      <el-button text type="primary" :icon="Plus" style="width: 100%" @click="emit('create', typed.trim())">
        {{ typed.trim() ? `“${typed.trim()}” adıyla yeni malzeme oluştur` : 'Yeni malzeme oluştur' }}
      </el-button>
    </template>
  </el-select>
</template>
