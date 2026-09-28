<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
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
 * Malzeme kartı: ad, kategori ve ana birim zorunlu; kod, kritik stok eşiği ve açıklama isteğe bağlı. Kategori ve birim
 * listeden seçilir ya da yazılır. Hareket formunun içinden de açılır (üstte, form kaybolmaz); kaydedilen kart
 * formda seçili gelir. Kart silinmez, pasifleşir.
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

watch(open, (isOpen) => isOpen && (form.value = material ? materialFormOf(material) : emptyMaterialForm(name)))

async function submit() {
  const problem = materialFormError(form.value)
  if (problem) return ElMessage.warning(problem)
  const request = materialRequestOf(form.value)
  try {
    const saved = await (material ? catalog.update(material.id, request) : catalog.create(request))
    ElMessage.success(material ? 'Malzeme kartı güncellendi' : `${saved.name} eklendi`)
    emit('saved', saved)
    open.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="open" :title="material ? 'Malzeme kartını düzenle' : 'Yeni malzeme kartı'" width="520px"
    append-to-body destroy-on-close>
    <el-form label-position="top" require-asterisk-position="right" @submit.prevent="submit">
      <el-row :gutter="16">
        <el-col :span="16">
          <el-form-item label="Malzeme adı" required>
            <el-input v-model="form.name" maxlength="120" placeholder="Ör. Çimento" size="large" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Kod"><el-input v-model="form.code" maxlength="40" placeholder="CMT-001" size="large" /></el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Kategori" required>
            <el-select v-model="form.category" filterable allow-create default-first-option placeholder="Seç ya da yaz"
              size="large">
              <el-option v-for="category in categories" :key="category" :value="category" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Ana birim" required>
            <el-select v-model="form.unit" filterable allow-create default-first-option placeholder="Torba, Ton, Adet…"
              size="large">
              <el-option v-for="unit in UNIT_SUGGESTIONS" :key="unit" :value="unit" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Kritik stok eşiği">
        <el-input-number v-model="form.minStock" :min="0" :controls="false" align="left" :value-on-clear="null"
          placeholder="Bu miktarın altına inince “Kritik”" size="large" style="width: 100%" />
      </el-form-item>
      <el-form-item label="Açıklama">
        <el-input v-model="form.description" type="textarea" :rows="2" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item v-if="material">
        <el-switch v-model="form.active" active-text="Aktif" inactive-text="Pasif (yeni harekette seçilmez)" />
      </el-form-item>
    </el-form>
    <el-alert v-if="material" type="info" :closable="false" show-icon
      title="Hareketi olan malzemenin birimi değişmez: geçmiş kayıtlar yanlış okunur." />
    <template #footer>
      <el-button @click="open = false">Vazgeç</el-button>
      <el-button type="primary" :loading="catalog.isSaving.value" @click="submit">
        {{ material ? 'Kaydet' : 'Kartı oluştur' }}
      </el-button>
    </template>
  </el-dialog>
</template>
