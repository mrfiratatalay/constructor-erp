<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { COMMON_UNITS, useMaterialCreate } from '@/core/shipments/useMaterialCreate'

/**
 * Listede olmayan malzemeyi oracıkta açar: sevkiyat formundan çıkılmadan. Ayrı bir malzeme ekranına gitmek
 * gerekseydi kayıt hiç girilmezdi. Tek eksik birimdir, o da hazır seçeneklerden bir dokunuşla gelir.
 */
const show = defineModel<boolean>('show', { required: true })
const { suggestedName = '' } = defineProps<{ suggestedName?: string }>()
const emit = defineEmits<{ created: [materialId: string] }>()

const { addMaterial, isAdding } = useMaterialCreate()
const name = ref('')
const unit = ref('')

watch(show, (open) => {
  if (open) {
    name.value = suggestedName
    unit.value = ''
  }
})

async function submit() {
  if (!name.value.trim()) return ElMessage.warning('Malzemenin adını yaz.')
  if (!unit.value.trim()) return ElMessage.warning('Birimini seç: torba, adet, ton…')
  try {
    emit('created', (await addMaterial(name.value, unit.value)).id)
    show.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="show" title="Yeni malzeme" width="420px" append-to-body>
    <el-form label-position="top">
      <el-form-item label="Adı">
        <el-input v-model="name" placeholder="Örn. Kireç" />
      </el-form-item>
      <el-form-item label="Birimi">
        <el-radio-group v-model="unit">
          <el-radio-button v-for="option in COMMON_UNITS" :key="option" :value="option">{{ option }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Başka birim">
        <el-input v-model="unit" placeholder="Kendi birimini yaz" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="isAdding" @click="submit">Ekle ve seç</el-button>
    </template>
  </el-dialog>
</template>
