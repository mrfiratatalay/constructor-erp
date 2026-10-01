<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import { emptyTenantForm, suggestedAmount, type TenantPrefill } from '@/core/admin/tenantForm'
import { useTenantCreation, type CreatedTenant } from '@/core/admin/useTenantCreation'
import PaymentFields from '@/desktop/molecules/PaymentFields.vue'
import PlanChoice from '@/desktop/molecules/PlanChoice.vue'

/**
 * Manuel satış tek pencerede: firma → paket ve dönem → ödeme. Kaydedilince firma açılır, abonelik başlar, ödeme
 * kaydedilir ve kurulum bağlantısı üretilir (created ile üst bileşene gider).
 */
const { prefill = {} } = defineProps<{ prefill?: TenantPrefill }>()
const show = defineModel<boolean>('show', { required: true })
const emit = defineEmits<{ created: [tenant: CreatedTenant] }>()
const { plans, create, created, isCreating } = useTenantCreation()
const form = ref(emptyTenantForm())
const formRef = ref<FormInstance>()
// Eksik ad, adın altında yazar ve pencere oraya kayar; yalnızca üstte beliren bir uyarı uzun formda gözden kaçıyordu.
const rules: FormRules = { name: [{ required: true, whitespace: true, message: 'Firma adı gerekli', trigger: 'blur' }] }

watch(show, (open) => open && (form.value = emptyTenantForm(plans.value, prefill)))
watch(() => [form.value.planId, form.value.months], () => {
  form.value.payment.amount = suggestedAmount(plans.value, form.value.planId, form.value.months)
})

async function submit() {
  if (!(await formRef.value?.validate().catch(() => false))) return
  if (!form.value.planId) return ElMessage.warning('Paket seç.')
  try {
    await create(form.value)
    show.value = false
    ElMessage.success('Firma açıldı.')
    if (created.value) emit('created', created.value)
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-dialog v-model="show" title="Yeni firma (manuel satış)" width="680px" top="6vh">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" scroll-to-error @submit.prevent="submit">
      <el-divider content-position="left">Firma</el-divider>
      <el-form-item label="Firma adı" prop="name"><el-input v-model="form.name" maxlength="120" /></el-form-item>
      <el-row :gutter="16">
        <el-col :span="8"><el-form-item label="Telefon"><el-input v-model="form.phone" maxlength="20" /></el-form-item></el-col>
        <el-col :span="10"><el-form-item label="E-posta"><el-input v-model="form.email" maxlength="254" /></el-form-item></el-col>
        <el-col :span="6"><el-form-item label="Şehir"><el-input v-model="form.city" maxlength="60" /></el-form-item></el-col>
      </el-row>
      <el-divider content-position="left">Paket ve dönem</el-divider>
      <PlanChoice v-model:plan-id="form.planId" v-model:months="form.months" :plans="plans" />
      <el-form-item label="Başlangıç">
        <el-date-picker v-model="form.startsOn" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" :clearable="false" />
      </el-form-item>
      <el-divider content-position="left">Ödeme</el-divider>
      <PaymentFields v-model="form.payment" />
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="isCreating" @click="submit">Firmayı aç ve bağlantı üret</el-button>
    </template>
  </el-dialog>
</template>
