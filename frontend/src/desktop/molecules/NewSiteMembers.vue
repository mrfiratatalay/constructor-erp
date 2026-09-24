<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
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
const person = reactive({ fullName: '', phone: '' })
const canAdd = computed(() => person.fullName.trim() !== '' && person.phone.trim() !== '')

function addPerson() {
  if (!canAdd.value) return
  newPeople.value = [...newPeople.value, { fullName: person.fullName.trim(), phone: person.phone.trim() }]
  Object.assign(person, { fullName: '', phone: '' })
  adding.value = false
}
</script>

<template>
  <div class="members">
    <el-button v-if="!adding" plain @click="adding = true">＋ Yeni kişi</el-button>
    <div v-else class="members__new">
      <el-input v-model="person.fullName" maxlength="120" placeholder="Ad soyad" />
      <el-input v-model="person.phone" maxlength="20" placeholder="Telefon: 0532 123 45 67" />
      <el-button type="primary" :disabled="!canAdd" @click="addPerson">Ekle</el-button>
    </div>
    <ul class="members__list">
      <li v-for="(added, index) in newPeople" :key="`new-${index}`" class="members__row">
        <UserAvatar :name="added.fullName" :size="36" />
        <span class="members__who"><strong>{{ added.fullName }}</strong><small>Yeni kişi</small></span>
        <el-button text @click="newPeople = newPeople.filter((_, i) => i !== index)">Çıkar</el-button>
      </li>
    </ul>
    <el-checkbox-group v-model="memberIds" class="members__list">
      <el-checkbox v-for="member in people" :key="member.id" :value="member.id" class="members__row">
        <UserAvatar :name="member.fullName" :size="36" />
        <span class="members__who"><strong>{{ member.fullName }}</strong><small>{{ ROLE_LABELS[member.role] }}</small></span>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<style scoped>
.members {
  display: grid;
  gap: var(--space-3);
  max-height: 52vh;
  overflow-y: auto;
}

.members__new {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--space-2);
}

.members__list {
  display: grid;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.members__row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  height: auto;
  margin: 0;
}

.members__row :deep(.el-checkbox__label) {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.members__who {
  display: grid;
  flex: 1;
}

.members__who small {
  color: var(--text-muted);
}
</style>
