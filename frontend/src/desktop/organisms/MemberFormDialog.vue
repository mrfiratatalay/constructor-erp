<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { MemberForm } from '@/core/team/memberForm'

/**
 * Kişiyi düzenle: yalnızca ad soyad ve telefon; rolü ⌄ menüsündeki "Patron yap / Şef yap" değiştirir.
 * Telefon zorunlu: giriş linki WhatsApp'ta doğrudan bu numaranın sohbetine gider, 📞 bu numarayı arar.
 */
const show = defineModel<boolean>('show', { required: true })
const { person, saving } = defineProps<{ person: { fullName: string; phone: string | null } | null; saving: boolean }>()
const emit = defineEmits<{ submit: [form: MemberForm] }>()

const formRef = ref<FormInstance>()
const form = reactive<MemberForm>({ fullName: '', phone: '' })
const rules: FormRules = {
  fullName: [{ required: true, message: 'Ad soyad gerekli', trigger: 'blur' }],
  phone: [{ required: true, message: 'Telefon gerekli', trigger: 'blur' }],
}

watch(show, (open) => {
  if (!open) return
  Object.assign(form, { fullName: person?.fullName ?? '', phone: person?.phone ?? '' })
  formRef.value?.clearValidate()
})

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (valid) emit('submit', { fullName: form.fullName.trim(), phone: form.phone.trim() })
}
</script>

<template>
  <el-dialog v-model="show" title="Kişiyi düzenle" width="440px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Ad soyad" prop="fullName">
        <el-input v-model="form.fullName" maxlength="120" placeholder="Ahmet Yılmaz" />
      </el-form-item>
      <el-form-item label="Telefon" prop="phone">
        <el-input v-model="form.phone" type="tel" maxlength="20" placeholder="0532 123 45 67" />
        <span class="member-form__hint">Giriş linki WhatsApp'ta bu numaraya gider; 📞 bu numarayı arar.</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Kaydet</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.member-form__hint {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
