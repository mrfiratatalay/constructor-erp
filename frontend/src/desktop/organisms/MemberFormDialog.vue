<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateMemberRequestRole, MemberView, SiteView } from '@/core/api/generated/model'
import { ROLE_OPTIONS } from '@/core/team/roles'
import type { MemberForm } from '@/core/team/useTeam'

const show = defineModel<boolean>('show', { required: true })
const { member, sites, saving } = defineProps<{ member: MemberView | null; sites: SiteView[]; saving: boolean }>()
const emit = defineEmits<{ submit: [form: MemberForm] }>()

const formRef = ref<FormInstance>()
const form = reactive({ fullName: '', phone: '', role: 'SITE_LEAD' as CreateMemberRequestRole, siteIds: [] as string[] })
const rules: FormRules = { fullName: [{ required: true, message: 'Ad soyad gerekli', trigger: 'blur' }] }

// Düzenlemede kişinin bilgileriyle, eklemede boş açılır.
watch(show, (open) => {
  if (!open) return
  Object.assign(form, {
    fullName: member?.fullName ?? '',
    phone: member?.phone ?? '',
    role: member?.role ?? 'SITE_LEAD',
    siteIds: [...(member?.siteIds ?? [])],
  })
})

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (valid) emit('submit', { ...form, phone: form.phone || null })
}
</script>

<template>
  <el-dialog v-model="show" :title="member ? 'Kişiyi düzenle' : 'Ekibe kişi ekle'" width="480px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Ad soyad" prop="fullName">
        <el-input v-model="form.fullName" maxlength="120" placeholder="Ahmet Yılmaz" />
      </el-form-item>
      <el-form-item label="Telefon">
        <el-input v-model="form.phone" maxlength="20" placeholder="İsteğe bağlı" />
      </el-form-item>
      <el-form-item label="Rol">
        <el-radio-group v-model="form.role">
          <el-radio-button v-for="option in ROLE_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.role === 'SITE_LEAD'" label="Sorumlu olduğu şantiyeler">
        <el-checkbox-group v-model="form.siteIds">
          <el-checkbox v-for="site in sites" :key="site.id" :value="site.id">{{ site.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">
        {{ member ? 'Kaydet' : 'Ekle ve giriş linki oluştur' }}
      </el-button>
    </template>
  </el-dialog>
</template>
