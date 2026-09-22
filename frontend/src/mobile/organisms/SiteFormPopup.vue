<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SiteView, SiteViewStatus } from '@/core/api/generated/model'
import { SITE_STATUS_OPTIONS } from '@/core/sites/siteStatus'
import type { SiteForm } from '@/core/sites/useSites'

const show = defineModel<boolean>('show', { required: true })
const { site, saving } = defineProps<{ site: SiteView | null; saving: boolean }>()
const emit = defineEmits<{ submit: [form: SiteForm] }>()

const name = ref('')
const address = ref('')
const status = ref<SiteViewStatus>('ACTIVE')

// Düzenlemede mevcut bilgilerle, eklemede boş açılır.
watch(show, (open) => {
  if (!open) return
  name.value = site?.name ?? ''
  address.value = site?.address ?? ''
  status.value = site?.status ?? 'ACTIVE'
})

function submit() {
  emit('submit', { name: name.value, address: address.value || null, status: status.value })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable>
    <van-form class="site-form" @submit="submit">
      <h2 class="site-form__title">{{ site ? 'Şantiyeyi düzenle' : 'Şantiye ekle' }}</h2>
      <van-cell-group inset>
        <van-field v-model="name" label="Ad" placeholder="Çamlıca Konutları" maxlength="120"
          :rules="[{ required: true, message: 'Şantiye adı gerekli' }]" />
        <van-field v-model="address" label="Adres" placeholder="İsteğe bağlı" maxlength="300" />
      </van-cell-group>
      <van-radio-group v-if="site" v-model="status" direction="horizontal">
        <van-radio v-for="option in SITE_STATUS_OPTIONS" :key="option.value" :name="option.value">
          {{ option.label }}
        </van-radio>
      </van-radio-group>
      <van-button type="primary" native-type="submit" block round :loading="saving">Kaydet</van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.site-form {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.site-form__title {
  margin: 0;
  font-size: 18px;
}
</style>
