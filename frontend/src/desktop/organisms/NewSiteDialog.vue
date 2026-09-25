<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { NewSiteForm } from '@/core/sites/useSiteCreation'
import NewSiteDetails from '@/desktop/molecules/NewSiteDetails.vue'

/**
 * Yeni şantiye, tek adım: fotoğraf, ad, adres. Kişi seçilmez; firmadaki herkes her şantiyededir. Oluşturunca
 * şantiyenin içine düşülür; akışın başında "Patron şantiyeyi kurdu" yazar.
 */
const show = defineModel<boolean>('show', { required: true })
const { saving } = defineProps<{ saving: boolean }>()
const emit = defineEmits<{ submit: [form: NewSiteForm] }>()

const formRef = ref<FormInstance>()
const form = reactive({ name: '', address: '', photo: null as File | null })
const rules: FormRules = { name: [{ required: true, message: 'Şantiye adı gerekli', trigger: 'blur' }] }

watch(show, (open) => open && Object.assign(form, { name: '', address: '', photo: null }))

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', { ...form, name: form.name.trim(), address: form.address.trim() || null })
}
</script>

<template>
  <el-dialog v-model="show" title="Yeni şantiye" width="520px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <NewSiteDetails v-model:name="form.name" v-model:address="form.address" v-model:photo="form.photo" />
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Oluştur</el-button>
    </template>
  </el-dialog>
</template>
