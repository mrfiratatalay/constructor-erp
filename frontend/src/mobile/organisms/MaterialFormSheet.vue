<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MaterialView } from '@/core/api/generated/model'
import { UNIT_SUGGESTIONS } from '@/core/materials/materialLabels'
import {
  emptyMaterialForm,
  materialFormError,
  materialFormOf,
  materialRequestOf,
  type MaterialForm,
} from '@/core/materials/materialForm'
import { useMaterialCatalog } from '@/core/materials/useMaterialCatalog'

/**
 * Malzeme kartı, alttan: ad, kategori ve ana birim zorunlu; kategori kayıtlılardan seçilir ya da yazılır, birim için
 * hazır çipler var. Hareket formunun içinden de açılır; kaydedilen kart formda seçili gelir. Kart silinmez, pasifleşir.
 */
const open = defineModel<boolean>('open', { required: true })
const { material = null, name = '', categories } = defineProps<{
  material?: MaterialView | null
  name?: string
  categories: string[]
}>()
const emit = defineEmits<{ saved: [material: MaterialView] }>()
const catalog = useMaterialCatalog()
const form = ref<MaterialForm>(emptyMaterialForm())
const categoryOpen = ref(false)
const categoryActions = computed(() => categories.map((category) => ({ name: category })))
const minStock = computed({
  get: () => (form.value.minStock === null ? '' : String(form.value.minStock)),
  set: (text: string) => (form.value.minStock = text.trim() === '' ? null : Number(text.replace(',', '.'))),
})

watch(open, (isOpen) => isOpen && (form.value = material ? materialFormOf(material) : emptyMaterialForm(name)))

async function submit() {
  const problem = materialFormError(form.value)
  if (problem) return showFailToast(problem)
  const request = materialRequestOf(form.value)
  try {
    const saved = await (material ? catalog.update(material.id, request) : catalog.create(request))
    showSuccessToast(material ? 'Kart güncellendi' : `${saved.name} eklendi`)
    emit('saved', saved)
    open.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-popup v-model:show="open" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <van-form class="material-sheet" @submit="submit">
      <h3>{{ material ? 'Malzeme kartını düzenle' : 'Yeni malzeme kartı' }}</h3>
      <van-cell-group inset>
        <van-field v-model="form.name" label="Ad" placeholder="Ör. Çimento" maxlength="120" required />
        <van-field v-model="form.code" label="Kod" placeholder="İsteğe bağlı, CMT-001" maxlength="40" />
        <van-field v-model="form.category" label="Kategori" placeholder="Yaz ya da seç" maxlength="60" required>
          <template v-if="categories.length" #button>
            <van-button size="small" plain type="primary" @click="categoryOpen = true">Listeden</van-button>
          </template>
        </van-field>
        <van-field v-model="form.unit" label="Ana birim" placeholder="Torba, Ton, Adet…" maxlength="20" required />
        <div class="material-sheet__units">
          <van-tag v-for="unit in UNIT_SUGGESTIONS" :key="unit" round size="medium"
            :type="form.unit === unit ? 'primary' : 'default'" @click="form.unit = unit">{{ unit }}</van-tag>
        </div>
        <van-field v-model="minStock" type="number" label="Kritik stok" placeholder="Altına inince “Kritik”" />
        <van-field v-model="form.description" type="textarea" label="Açıklama" rows="2" autosize maxlength="500" />
        <van-cell v-if="material" center title="Aktif" label="Pasif kart yeni harekette seçilmez">
          <template #right-icon><van-switch v-model="form.active" /></template>
        </van-cell>
      </van-cell-group>
      <van-button type="primary" round block native-type="submit" :loading="catalog.isSaving.value">
        {{ material ? 'Kaydet' : 'Kartı oluştur' }}
      </van-button>
    </van-form>
    <van-action-sheet v-model:show="categoryOpen" title="Kategori" :actions="categoryActions" cancel-text="Vazgeç"
      close-on-click-action teleport="body" @select="(action: { name: string }) => (form.category = action.name)" />
  </van-popup>
</template>

<style scoped>
.material-sheet {
  display: grid;
  grid-auto-rows: max-content;
  gap: var(--space-4);
  max-height: 88dvh;
  overflow-y: auto;
  padding: var(--space-5) 0 calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.material-sheet h3 {
  margin: 0;
  padding: 0 var(--space-4);
}

.material-sheet > .van-button {
  width: auto;
  margin: 0 var(--space-4);
}

.material-sheet__units {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4) var(--space-3);
}
</style>
