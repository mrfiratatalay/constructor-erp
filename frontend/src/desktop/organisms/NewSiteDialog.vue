<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { MemberView } from '@/core/api/generated/model'
import type { NewPerson, NewSiteForm } from '@/core/sites/useSiteCreation'
import NewSiteDetails from '@/desktop/molecules/NewSiteDetails.vue'
import NewSiteMembers from '@/desktop/molecules/NewSiteMembers.vue'

/**
 * Yeni şantiye, WhatsApp'ta grup kurmanın iki adımı: 1) katılımcılar, 2) fotoğraf ve ad. Oluşturunca
 * şantiyenin içine düşülür; orada "Patron şantiyeyi kurdu" satırı ve davet düğmeleri hazır durur.
 */
const show = defineModel<boolean>('show', { required: true })
const { people, saving } = defineProps<{ people: MemberView[]; saving: boolean }>()
const emit = defineEmits<{ submit: [form: NewSiteForm] }>()

const step = ref<1 | 2>(1)
const formRef = ref<FormInstance>()
const form = reactive({ memberIds: [] as string[], newPeople: [] as NewPerson[], name: '', address: '', photo: null as File | null })
const rules: FormRules = { name: [{ required: true, message: 'Şantiye adı gerekli', trigger: 'blur' }] }
const memberCount = computed(() => form.memberIds.length + form.newPeople.length)

watch(show, (open) => {
  if (!open) return
  step.value = 1
  Object.assign(form, { memberIds: [], newPeople: [], name: '', address: '', photo: null })
})

async function submit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  emit('submit', { ...form, name: form.name.trim(), address: form.address.trim() || null })
}
</script>

<template>
  <el-dialog v-model="show" :title="step === 1 ? 'Katılımcı ekle · 1/2' : 'Yeni şantiye · 2/2'" width="520px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <NewSiteMembers v-if="step === 1" v-model:member-ids="form.memberIds" v-model:new-people="form.newPeople"
        :people="people" />
      <NewSiteDetails v-else v-model:name="form.name" v-model:address="form.address" v-model:photo="form.photo"
        :member-count="memberCount" />
    </el-form>
    <template #footer>
      <template v-if="step === 1">
        <el-button @click="show = false">Vazgeç</el-button>
        <el-button type="primary" @click="step = 2">İleri{{ memberCount ? ` · ${memberCount} kişi` : '' }}</el-button>
      </template>
      <template v-else>
        <el-button @click="step = 1">Geri</el-button>
        <el-button type="primary" :loading="saving" @click="submit">Oluştur</el-button>
      </template>
    </template>
  </el-dialog>
</template>
