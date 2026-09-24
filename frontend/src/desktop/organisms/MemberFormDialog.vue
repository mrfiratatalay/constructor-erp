<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { MemberView } from '@/core/api/generated/model'
import type { MemberForm } from '@/core/team/useTeam'

/**
 * Yalnızca ad soyad ve telefon: eklenen herkes şeftir, şantiyeye ekleme şantiyenin içinde yapılır.
 * Telefon zorunlu: giriş linki WhatsApp'ta doğrudan bu numaranın sohbetine gider.
 */
const show = defineModel<boolean>('show', { required: true })
const { member, saving } = defineProps<{ member: MemberView | null; saving: boolean }>()
const emit = defineEmits<{ submit: [form: MemberForm] }>()

const formRef = ref<FormInstance>()
const form = reactive<MemberForm>({ fullName: '', phone: '' })
const rules: FormRules = {
  fullName: [{ required: true, message: 'Ad soyad gerekli', trigger: 'blur' }],
  phone: [{ required: true, message: 'Telefon gerekli', trigger: 'blur' }],
}

// Düzenlemede kişinin bilgileriyle, eklemede boş açılır.
watch(show, (open) => {
  if (!open) return
  Object.assign(form, { fullName: member?.fullName ?? '', phone: member?.phone ?? '' })
  formRef.value?.clearValidate()
})

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (valid) emit('submit', { fullName: form.fullName.trim(), phone: form.phone.trim() })
}
</script>

<template>
  <el-dialog v-model="show" :title="member ? 'Kişiyi düzenle' : 'Yeni kişi'" width="440px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Ad soyad" prop="fullName">
        <el-input v-model="form.fullName" maxlength="120" placeholder="Ahmet Yılmaz" />
      </el-form-item>
      <el-form-item label="Telefon" prop="phone">
        <el-input v-model="form.phone" type="tel" maxlength="20" placeholder="0532 123 45 67" />
        <span class="member-form__hint">Giriş linki WhatsApp'ta bu numaraya gider.</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">{{ member ? 'Kaydet' : 'Ekle' }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.member-form__hint {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
