<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { CreateWorkerRequest } from '@/core/api/generated/model'

/**
 * Yoklamadaki "＋ Personel ekle": yalnızca ad soyad ve (isteğe bağlı) görevi. Personel uygulamanın kullanıcısı
 * değildir; telefonu, girişi, davet bağlantısı yoktur. Kişi penceresiyle (MemberFormDialog) aynı kalıp.
 * sites: Yoklama ekranından eklerken şantiye belli değildir; birden çok aktif şantiye varsa yalnızca burada sorulur
 * (ilki seçili gelir), tek şantiye varsa hiç sorulmaz.
 */
const show = defineModel<boolean>('show', { required: true })
const { saving, sites = [] } = defineProps<{ saving: boolean; sites?: { id: string; name: string }[] }>()
const emit = defineEmits<{ submit: [form: CreateWorkerRequest, siteId: string | null] }>()

const formRef = ref<FormInstance>()
const form = reactive({ fullName: '', trade: '', siteId: '' })
const rules: FormRules = { fullName: [{ required: true, whitespace: true, message: 'Ad soyad gerekli', trigger: 'blur' }] }

watch(show, (open) => {
  if (open) Object.assign(form, { fullName: '', trade: '', siteId: sites[0]?.id ?? '' })
})

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (valid) emit('submit', { fullName: form.fullName.trim(), trade: form.trade.trim() || null }, form.siteId || null)
}
</script>

<template>
  <el-dialog v-model="show" title="Personel ekle" width="440px" append-to-body>
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Ad soyad" prop="fullName">
        <el-input v-model="form.fullName" maxlength="120" placeholder="Ali Usta" />
      </el-form-item>
      <el-form-item label="Görevi">
        <el-input v-model="form.trade" maxlength="80" placeholder="İsteğe bağlı (ör. Kalıpçı)" />
      </el-form-item>
      <el-form-item v-if="sites.length > 1" label="Şantiye">
        <el-select v-model="form.siteId">
          <el-option v-for="site in sites" :key="site.id" :label="site.name" :value="site.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Ekle</el-button>
    </template>
  </el-dialog>
</template>
