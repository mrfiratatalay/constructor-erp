<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { UploaderBeforeRead } from 'vant'
import { Camera } from 'lucide-vue-next'

/**
 * Şantiye kurmak, WhatsApp'ta grubun adını ve fotoğrafını vermek gibi: yuvarlak fotoğraf (isteğe bağlı), ad
 * (zorunlu), adres (isteğe bağlı). Kişi seçilmez: firmadaki herkes her şantiyededir.
 */
const name = defineModel<string>('name', { required: true })
const address = defineModel<string>('address', { required: true })
const photo = defineModel<File | null>('photo', { required: true })

/** Seçilen fotoğrafın tarayıcı içi geçici adresi; yenisi gelince eskisi bellekten bırakılır. */
const preview = ref<string | null>(null)
const release = () => preview.value && URL.revokeObjectURL(preview.value)
watch(photo, (file) => {
  release()
  preview.value = file ? URL.createObjectURL(file) : null
}, { immediate: true })
onBeforeUnmount(release)

/** Vant seçileni kendi listesine eklemesin: tek doğru, photo modeli. */
const pick: UploaderBeforeRead = (file) => {
  photo.value = Array.isArray(file) ? (file[0] ?? null) : file
  return false
}
</script>

<template>
  <div class="details">
    <van-uploader :before-read="pick" accept="image/*" :preview-image="false" class="details__photo">
      <span class="details__circle">
        <img v-if="preview" :src="preview" alt="" />
        <Camera v-else :size="28" />
      </span>
    </van-uploader>
    <van-cell-group inset class="details__fields">
      <van-field v-model="name" label="Ad" placeholder="Çamlıca Konutları" maxlength="120"
        :rules="[{ required: true, message: 'Şantiye adı gerekli' }]" />
      <van-field v-model="address" label="Adres" placeholder="İsteğe bağlı" maxlength="300" />
    </van-cell-group>
    <p class="details__note">Firmadaki herkes bu şantiyeyi görür ve yazabilir.</p>
  </div>
</template>

<style scoped>
.details {
  display: grid;
  gap: var(--space-4);
}

.details__photo {
  justify-self: center;
}

.details__circle {
  display: grid;
  place-items: center;
  overflow: hidden;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--surface-muted);
  color: var(--text-subtle);
}

.details__circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details__fields {
  --van-cell-background: var(--surface-muted);
}

.details__note {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
  text-align: center;
}
</style>
