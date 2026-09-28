<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MaterialView } from '@/core/api/generated/model'
import MaterialGlyph from '@/shared/atoms/MaterialGlyph.vue'

/**
 * Malzeme alanı: dokununca alttan aramalı liste açılır (ad ya da kod), satırda kategori ve birim yazar. Aranan
 * malzeme yoksa yetkili kişi "Yeni malzeme oluştur" der; yazdığı ad kart formuna taşınır, hareket formu kaybolmaz.
 */
const model = defineModel<string | null>({ required: true })
const { materials, canCreate, disabled = false } = defineProps<{
  materials: MaterialView[]
  canCreate: boolean
  disabled?: boolean
}>()
const emit = defineEmits<{ create: [name: string] }>()
const open = ref(false)
const query = ref('')
const selected = computed(() => materials.find((material) => material.id === model.value))
const visible = computed(() => {
  const text = query.value.trim().toLocaleLowerCase('tr')
  return materials.filter((item) => `${item.name} ${item.code ?? ''}`.toLocaleLowerCase('tr').includes(text))
})

function pick(material: MaterialView) {
  model.value = material.id
  open.value = false
}

function create() {
  open.value = false
  emit('create', query.value.trim())
}
</script>

<template>
  <van-field :model-value="selected?.name ?? ''" label="Malzeme" placeholder="Seç ya da ara" readonly is-link required
    :disabled="disabled" @click="!disabled && ((query = ''), (open = true))" />
  <van-popup v-model:show="open" position="bottom" round closeable teleport="body" :style="{ height: '75dvh' }">
    <div class="material-picker">
      <h3 class="material-picker__title">Malzeme seç</h3>
      <van-search v-model="query" placeholder="Ad ya da kod ara" shape="round" autofocus />
      <div class="material-picker__list">
        <van-cell v-for="material in visible" :key="material.id" :title="material.name"
          :label="`${material.category} · ${material.unit}`" clickable @click="pick(material)">
          <template #icon><MaterialGlyph :name="material.name" :size="32" style="margin-right: 12px" /></template>
          <template v-if="material.id === model" #right-icon><van-icon name="success" color="var(--brand-primary)" /></template>
        </van-cell>
        <van-empty v-if="!visible.length" image="search" description="Bu adla malzeme yok" />
      </div>
      <van-button v-if="canCreate" block round plain type="primary" icon="plus" @click="create">
        {{ query.trim() ? `“${query.trim()}” adıyla yeni malzeme` : 'Yeni malzeme oluştur' }}
      </van-button>
    </div>
  </van-popup>
</template>

<style scoped>
.material-picker {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: var(--space-2);
  height: 100%;
  padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom, 0px));
}

.material-picker__title {
  margin: 0;
  font-size: var(--text-md);
}

.material-picker__list {
  overflow-y: auto;
}
</style>
