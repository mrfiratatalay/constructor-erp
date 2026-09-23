<script setup lang="ts">
import { ref, watch } from 'vue'
import type { MemberView } from '@/core/api/generated/model'
import type { NewSiteForm } from '@/core/sites/useSiteCreation'

/**
 * Yeni şantiye, WhatsApp'ta grup kurmak gibi: ad ver, sorumluyu seç, bitir. Sorumlu ya ekipten seçilir
 * ya da burada oluşturulur; "Sonra atarım" da geçerli bir cevaptır, patron akışını kesmez.
 */
const show = defineModel<boolean>('show', { required: true })
const { leads, saving } = defineProps<{ leads: MemberView[]; saving: boolean }>()
const emit = defineEmits<{ submit: [form: NewSiteForm] }>()

/** Sorumlu seçimi: kişinin kimliği, yeni kişi için 'new', boş bırakmak için ''. */
const LATER = ''
const NEW_LEAD = 'new'

const name = ref('')
const address = ref('')
const lead = ref<string>(LATER)
const leadName = ref('')
const leadPhone = ref('')

watch(show, (open) => {
  if (!open) return
  name.value = ''
  address.value = ''
  lead.value = LATER
  leadName.value = ''
  leadPhone.value = ''
})

function submit() {
  emit('submit', {
    name: name.value,
    address: address.value || null,
    leadId: lead.value === NEW_LEAD || lead.value === LATER ? null : lead.value,
    newLead: lead.value === NEW_LEAD ? { fullName: leadName.value, phone: leadPhone.value || null } : null,
  })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable>
    <van-form class="new-site" @submit="submit">
      <h2 class="new-site__title">Yeni şantiye</h2>
      <van-cell-group inset>
        <van-field v-model="name" label="Ad" placeholder="Çamlıca Konutları" maxlength="120"
          :rules="[{ required: true, message: 'Şantiye adı gerekli' }]" />
        <van-field v-model="address" label="Adres" placeholder="İsteğe bağlı" maxlength="300" />
      </van-cell-group>
      <section class="new-site__block">
        <strong>Sorumlu</strong>
        <van-radio-group v-model="lead" class="new-site__block">
          <van-radio v-for="member in leads" :key="member.id" :name="member.id">{{ member.fullName }}</van-radio>
          <van-radio :name="NEW_LEAD">Yeni kişi ekle</van-radio>
          <van-radio :name="LATER">Sonra atarım</van-radio>
        </van-radio-group>
      </section>
      <van-cell-group v-if="lead === NEW_LEAD" inset>
        <van-field v-model="leadName" label="Ad soyad" placeholder="Ahmet Yılmaz" maxlength="120"
          :rules="[{ required: true, message: 'Ad soyad gerekli' }]" />
        <van-field v-model="leadPhone" label="Telefon" type="tel" placeholder="Davet için" maxlength="20" />
      </van-cell-group>
      <van-button type="primary" native-type="submit" block round :loading="saving">Oluştur</van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.new-site {
  display: grid;
  gap: var(--space-4);
  max-height: 85dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.new-site__title {
  margin: 0;
  font-size: 18px;
}

.new-site__block {
  display: grid;
  gap: var(--space-3);
}
</style>
