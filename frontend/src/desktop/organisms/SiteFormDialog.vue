<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { SiteView, SiteViewStatus } from '@/core/api/generated/model'
import { SITE_STATUS_OPTIONS } from '@/core/sites/siteStatus'
import type { SiteForm } from '@/core/sites/useSites'

const show = defineModel<boolean>('show', { required: true })
const { site, saving } = defineProps<{ site: SiteView | null; saving: boolean }>()
const emit = defineEmits<{ submit: [form: SiteForm] }>()

const formRef = ref<FormInstance>()
const form = reactive({ name: '', address: '', status: 'ACTIVE' as SiteViewStatus })
const rules: FormRules = { name: [{ required: true, message: 'Şantiye adı gerekli', trigger: 'blur' }] }

// Düzenlemede mevcut bilgilerle, eklemede boş açılır.
watch(show, (open) => {
  if (open) Object.assign(form, { name: site?.name ?? '', address: site?.address ?? '', status: site?.status ?? 'ACTIVE' })
})

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (valid) emit('submit', { name: form.name, address: form.address || null, status: form.status })
}
</script>

<template>
  <el-dialog v-model="show" :title="site ? 'Şantiyeyi düzenle' : 'Şantiye ekle'" width="480px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Ad" prop="name">
        <el-input v-model="form.name" maxlength="120" placeholder="Çamlıca Konutları" />
      </el-form-item>
      <el-form-item label="Adres">
        <el-input v-model="form.address" maxlength="300" placeholder="İsteğe bağlı" />
      </el-form-item>
      <el-form-item v-if="site" label="Durum">
        <el-radio-group v-model="form.status">
          <el-radio-button v-for="option in SITE_STATUS_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Kaydet</el-button>
    </template>
  </el-dialog>
</template>
