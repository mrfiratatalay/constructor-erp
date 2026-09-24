<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { MemberView } from '@/core/api/generated/model'
import type { LeadChoice } from '@/core/sites/useSiteLeads'

const show = defineModel<boolean>('show', { required: true })
const { members, saving } = defineProps<{ members: MemberView[]; saving: boolean }>()
const emit = defineEmits<{ submit: [choice: LeadChoice] }>()

const NEW_MEMBER = 'new'
const formRef = ref<FormInstance>()
const form = reactive({ choice: NEW_MEMBER, fullName: '', phone: '' })
const hasMembers = computed(() => members.length > 0)
const rules: FormRules = {
  fullName: [{ required: true, message: 'Ad soyad gerekli', trigger: 'blur' }],
  phone: [{ required: true, message: 'Telefon gerekli', trigger: 'blur' }],
}

watch([show, () => members], ([open]) => {
  if (!open) return
  Object.assign(form, { choice: members[0]?.id ?? NEW_MEMBER, fullName: '', phone: '' })
})

async function submit() {
  const valid = form.choice !== NEW_MEMBER || (await formRef.value?.validate().catch(() => false))
  if (!valid) return
  emit('submit', {
    leadId: form.choice === NEW_MEMBER ? null : form.choice,
    newLead: form.choice === NEW_MEMBER ? { fullName: form.fullName, phone: form.phone } : null,
  })
}
</script>

<template>
  <el-dialog v-model="show" title="Katılımcı ekle" width="480px">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submit">
      <el-form-item label="Kişi">
        <el-select v-model="form.choice" class="member-add__select">
          <el-option v-for="member in members" :key="member.id" :label="member.fullName" :value="member.id" />
          <el-option label="Yeni kişi" :value="NEW_MEMBER" />
        </el-select>
        <span v-if="!hasMembers" class="member-add__hint">Bu şantiyede olmayan ekip üyesi yok.</span>
      </el-form-item>
      <template v-if="form.choice === NEW_MEMBER">
        <el-form-item label="Ad soyad" prop="fullName">
          <el-input v-model="form.fullName" maxlength="120" placeholder="Ahmet Yılmaz" />
        </el-form-item>
        <el-form-item label="Telefon" prop="phone">
          <el-input v-model="form.phone" maxlength="20" placeholder="0532 123 45 67" />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="show = false">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Ekle ve link hazırla</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.member-add__select {
  width: 100%;
}

.member-add__hint {
  display: block;
  margin-top: var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
