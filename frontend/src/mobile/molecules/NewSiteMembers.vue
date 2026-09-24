<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MemberView } from '@/core/api/generated/model'
import type { NewPerson } from '@/core/sites/useSiteCreation'
import { ROLE_LABELS } from '@/core/team/roles'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Şantiye kurmanın 1. adımı, WhatsApp'ta grup kurarken kişi seçmek gibi: ekipten işaretle; ekipte olmayanı
 * burada ekle (ad + telefon; davet linki şantiyenin içinden, WhatsApp'ta bu numaraya gider). Kimseyi seçmeden
 * geçmek de serbest.
 */
const memberIds = defineModel<string[]>('memberIds', { required: true })
const newPeople = defineModel<NewPerson[]>('newPeople', { required: true })
const { people } = defineProps<{ people: MemberView[] }>()

const adding = ref(false)
const fullName = ref('')
const phone = ref('')
const canAdd = computed(() => fullName.value.trim() !== '' && phone.value.trim() !== '')

function addPerson() {
  if (!canAdd.value) return
  newPeople.value = [...newPeople.value, { fullName: fullName.value.trim(), phone: phone.value.trim() }]
  fullName.value = ''
  phone.value = ''
  adding.value = false
}
</script>

<template>
  <van-cell-group inset class="members">
    <van-cell title="＋ Yeni kişi" clickable @click="adding = !adding" />
    <template v-if="adding">
      <van-field v-model="fullName" label="Ad soyad" placeholder="Ahmet Yılmaz" maxlength="120" />
      <van-field v-model="phone" label="Telefon" type="tel" placeholder="0532 123 45 67" maxlength="20" />
      <van-cell><van-button size="small" type="primary" round block :disabled="!canAdd" @click="addPerson">Ekle</van-button></van-cell>
    </template>
    <van-cell v-for="(person, index) in newPeople" :key="`new-${index}`" :title="person.fullName" label="Yeni kişi"
      center>
      <template #icon><UserAvatar :name="person.fullName" :size="36" class="members__avatar" /></template>
      <template #right-icon>
        <van-button size="mini" plain @click="newPeople = newPeople.filter((_, i) => i !== index)">Çıkar</van-button>
      </template>
    </van-cell>
    <van-checkbox-group v-model="memberIds">
      <van-cell v-for="member in people" :key="member.id" :title="member.fullName" :label="ROLE_LABELS[member.role]"
        clickable center @click="memberIds = memberIds.includes(member.id)
          ? memberIds.filter((id) => id !== member.id) : [...memberIds, member.id]">
        <template #icon><UserAvatar :name="member.fullName" :size="36" class="members__avatar" /></template>
        <template #right-icon><van-checkbox :name="member.id" @click.stop /></template>
      </van-cell>
    </van-checkbox-group>
  </van-cell-group>
</template>

<style scoped>
.members {
  --van-cell-background: var(--surface-muted);
}

.members__avatar {
  margin-right: var(--space-3);
}
</style>
