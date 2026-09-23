<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { MemberView } from '@/core/api/generated/model'
import type { LeadChoice } from '@/core/sites/useSiteLeads'

const show = defineModel<boolean>('show', { required: true })
const { members, saving } = defineProps<{ members: MemberView[]; saving: boolean }>()
const emit = defineEmits<{ submit: [choice: LeadChoice] }>()

const NEW_MEMBER = 'new'
const choice = ref(NEW_MEMBER)
const fullName = ref('')
const phone = ref('')
const hasMembers = computed(() => members.length > 0)

watch([show, () => members], ([open]) => {
  if (!open) return
  choice.value = members[0]?.id ?? NEW_MEMBER
  fullName.value = ''
  phone.value = ''
})

function submit() {
  emit('submit', {
    leadId: choice.value === NEW_MEMBER ? null : choice.value,
    newLead: choice.value === NEW_MEMBER ? { fullName: fullName.value, phone: phone.value || null } : null,
  })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <van-form class="member-add" @submit="submit">
      <h2 class="member-add__title">Katılımcı ekle</h2>
      <van-radio-group v-model="choice" class="member-add__choices">
        <template v-if="hasMembers">
          <van-radio v-for="member in members" :key="member.id" :name="member.id">{{ member.fullName }}</van-radio>
        </template>
        <van-radio :name="NEW_MEMBER">Yeni kişi</van-radio>
      </van-radio-group>
      <van-cell-group v-if="choice === NEW_MEMBER" inset>
        <van-field v-model="fullName" label="Ad soyad" placeholder="Ahmet Yılmaz" maxlength="120"
          :rules="[{ required: true, message: 'Ad soyad gerekli' }]" />
        <van-field v-model="phone" label="Telefon" type="tel" placeholder="WhatsApp daveti için" maxlength="20" />
      </van-cell-group>
      <van-button type="primary" native-type="submit" block round :loading="saving">Ekle ve link hazırla</van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.member-add {
  display: grid;
  gap: var(--space-4);
  max-height: 85dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.member-add__title {
  margin: 0;
  padding-right: var(--space-8);
  font-size: var(--text-lg);
}

.member-add__choices {
  display: grid;
  gap: var(--space-3);
  padding: 0 var(--space-1);
}
</style>
