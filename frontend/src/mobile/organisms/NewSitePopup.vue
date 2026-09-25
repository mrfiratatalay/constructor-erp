<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NewSiteForm } from '@/core/sites/useSiteCreation'
import NewSiteDetails from '@/mobile/molecules/NewSiteDetails.vue'

/**
 * Yeni şantiye, tek adım: fotoğraf, ad, adres. Kişi seçilmez; firmadaki herkes her şantiyededir. Oluşturunca
 * şantiyenin içine düşülür; akışın başında "Patron şantiyeyi kurdu" yazar.
 */
const show = defineModel<boolean>('show', { required: true })
const { saving } = defineProps<{ saving: boolean }>()
const emit = defineEmits<{ submit: [form: NewSiteForm] }>()

const name = ref('')
const address = ref('')
const photo = ref<File | null>(null)

watch(show, (open) => {
  if (!open) return
  name.value = ''
  address.value = ''
  photo.value = null
})

function submit() {
  emit('submit', { name: name.value.trim(), address: address.value.trim() || null, photo: photo.value })
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <van-form class="new-site" @submit="submit">
      <h2 class="new-site__title">Yeni şantiye</h2>
      <NewSiteDetails v-model:name="name" v-model:address="address" v-model:photo="photo" />
      <van-button type="primary" round block native-type="submit" :loading="saving">Oluştur</van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.new-site {
  display: grid;
  gap: var(--space-4);
  max-height: 88dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.new-site__title {
  margin: 0;
  padding-right: var(--space-8);
  font-size: 18px;
}
</style>
