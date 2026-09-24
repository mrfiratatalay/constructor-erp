<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MemberView } from '@/core/api/generated/model'
import type { MemberForm } from '@/core/team/memberForm'

/**
 * Yalnızca ad soyad ve telefon: eklenen herkes şeftir, şantiyeye ekleme şantiyenin içinde yapılır.
 * Telefon zorunlu: giriş linki WhatsApp'ta doğrudan bu numaranın sohbetine gider.
 */
const show = defineModel<boolean>('show', { required: true })
const { member, saving } = defineProps<{ member: MemberView | null; saving: boolean }>()
const emit = defineEmits<{ submit: [form: MemberForm] }>()

const fullName = ref('')
const phone = ref('')

// Düzenlemede kişinin bilgileriyle, eklemede boş açılır.
watch(show, (open) => {
  if (!open) return
  fullName.value = member?.fullName ?? ''
  phone.value = member?.phone ?? ''
})

function submit() {
  emit('submit', { fullName: fullName.value.trim(), phone: phone.value.trim() })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body">
    <van-form class="member-form" @submit="submit">
      <h2 class="member-form__title">{{ member ? 'Kişiyi düzenle' : 'Yeni kişi' }}</h2>
      <van-cell-group inset>
        <van-field v-model="fullName" label="Ad soyad" placeholder="Ahmet Yılmaz" maxlength="120"
          :rules="[{ required: true, message: 'Ad soyad gerekli' }]" />
        <van-field v-model="phone" label="Telefon" type="tel" placeholder="0532 123 45 67" maxlength="20"
          :rules="[{ required: true, message: 'Telefon gerekli' }]" />
      </van-cell-group>
      <p class="member-form__hint">Giriş linki WhatsApp'ta bu numaraya gider.</p>
      <van-button type="primary" native-type="submit" block round :loading="saving">
        {{ member ? 'Kaydet' : 'Ekle' }}
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

.member-form__hint {
  margin: calc(var(--space-2) * -1) var(--space-4) 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
