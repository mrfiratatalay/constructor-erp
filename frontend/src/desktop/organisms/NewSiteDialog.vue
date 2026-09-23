<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { MemberView } from '@/core/api/generated/model'
import type { NewSiteForm } from '@/core/sites/useSiteCreation'

/**
 * Yeni şantiye, WhatsApp'ta grup kurmak gibi: ad ver, sorumluyu seç, bitir. Sorumlu ya ekipten seçilir
 * ya da burada oluşturulur; "Sonra atarım" da geçerli bir cevaptır.
 */
const show = defineModel<boolean>('show', { required: true })
const { leads, saving } = defineProps<{ leads: MemberView[]; saving: boolean }>()
const emit = defineEmits<{ submit: [form: NewSiteForm] }>()

/** Sorumlu seçimi: kişinin kimliği, yeni kişi için 'new', boş bırakmak için ''. */
const LATER = ''
const NEW_LEAD = 'new'

const formRef = ref<FormInstance>()
const form = reactive({ name: '', address: '', lead: LATER, leadName: '', leadPhone: '' })
const rules: FormRules = {
  name: [{ required: true, message: 'Şantiye adı gerekli', trigger: 'blur' }],
  leadName: [{ required: true, message: 'Ad soyad gerekli', trigger: 'blur' }],
}

watch(show, (open) => {
  if (open) Object.assign(form, { name: '', address: '', lead: LATER, leadName: '', leadPhone: '' })
})

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', {
    name: form.name,
    address: form.address || null,
    leadId: form.lead === NEW_LEAD || form.lead === LATER ? null : form.lead,
    newLead: form.lead === NEW_LEAD ? { fullName: form.leadName, phone: form.leadPhone || null } : null,
  })
}
</script>

<template>
  <el-dialog v-model="show" title="Yeni şantiye" width="480px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Ad" prop="name">
        <el-input v-model="form.name" maxlength="120" placeholder="Çamlıca Konutları" />
      </el-form-item>
      <el-form-item label="Adres">
        <el-input v-model="form.address" maxlength="300" placeholder="İsteğe bağlı" />
      </el-form-item>
      <el-form-item label="Sorumlu">
        <el-select v-model="form.lead" class="new-site__select">
          <el-option v-for="member in leads" :key="member.id" :label="member.fullName" :value="member.id" />
          <el-option label="Yeni kişi ekle" :value="NEW_LEAD" />
          <el-option label="Sonra atarım" :value="LATER" />
        </el-select>
      </el-form-item>
      <template v-if="form.lead === NEW_LEAD">
        <el-form-item label="Ad soyad" prop="leadName">
          <el-input v-model="form.leadName" maxlength="120" placeholder="Ahmet Yılmaz" />
        </el-form-item>
        <el-form-item label="Telefon">
          <el-input v-model="form.leadPhone" maxlength="20" placeholder="Davet için" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Oluştur</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.new-site__select {
  width: 100%;
}
</style>
