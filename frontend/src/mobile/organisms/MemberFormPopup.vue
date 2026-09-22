<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CreateMemberRequestRole, MemberView, SiteView } from '@/core/api/generated/model'
import { ROLE_OPTIONS } from '@/core/team/roles'
import type { MemberForm } from '@/core/team/useTeam'

const show = defineModel<boolean>('show', { required: true })
const { member, sites, saving } = defineProps<{ member: MemberView | null; sites: SiteView[]; saving: boolean }>()
const emit = defineEmits<{ submit: [form: MemberForm] }>()

const fullName = ref('')
const phone = ref('')
const role = ref<CreateMemberRequestRole>('SITE_LEAD')
const siteIds = ref<string[]>([])

// Düzenlemede kişinin bilgileriyle, eklemede boş açılır.
watch(show, (open) => {
  if (!open) return
  fullName.value = member?.fullName ?? ''
  phone.value = member?.phone ?? ''
  role.value = member?.role ?? 'SITE_LEAD'
  siteIds.value = [...(member?.siteIds ?? [])]
})

function submit() {
  emit('submit', { fullName: fullName.value, phone: phone.value || null, role: role.value, siteIds: siteIds.value })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable>
    <van-form class="member-form" @submit="submit">
      <h2 class="member-form__title">{{ member ? 'Kişiyi düzenle' : 'Ekibe kişi ekle' }}</h2>
      <van-cell-group inset>
        <van-field v-model="fullName" label="Ad soyad" placeholder="Ahmet Yılmaz" maxlength="120"
          :rules="[{ required: true, message: 'Ad soyad gerekli' }]" />
        <van-field v-model="phone" label="Telefon" type="tel" placeholder="İsteğe bağlı" maxlength="20" />
      </van-cell-group>
      <van-radio-group v-model="role" class="member-form__options">
        <van-radio v-for="option in ROLE_OPTIONS" :key="option.value" :name="option.value">{{ option.label }}</van-radio>
      </van-radio-group>
      <section v-if="role === 'SITE_LEAD'" class="member-form__options">
        <strong>Sorumlu olduğu şantiyeler</strong>
        <van-checkbox-group v-model="siteIds" class="member-form__options">
          <van-checkbox v-for="site in sites" :key="site.id" :name="site.id" shape="square">{{ site.name }}</van-checkbox>
        </van-checkbox-group>
      </section>
      <van-button type="primary" native-type="submit" block round :loading="saving">
        {{ member ? 'Kaydet' : 'Ekle ve giriş linki oluştur' }}
      </van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.member-form {
  display: grid;
  gap: var(--space-4);
  max-height: 85dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.member-form__title {
  margin: 0;
  font-size: 18px;
}

.member-form__options {
  display: grid;
  gap: var(--space-3);
}
</style>
