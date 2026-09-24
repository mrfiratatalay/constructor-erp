<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { UploadFile } from 'element-plus'
import { Camera } from 'lucide-vue-next'

/** Şantiye kurmanın 2. adımı, WhatsApp'ta grubun adını ve fotoğrafını vermek gibi. */
const name = defineModel<string>('name', { required: true })
const address = defineModel<string>('address', { required: true })
const photo = defineModel<File | null>('photo', { required: true })
const { memberCount } = defineProps<{ memberCount: number }>()

/** Seçilen fotoğrafın tarayıcı içi geçici adresi; yenisi gelince eskisi bellekten bırakılır. */
const preview = ref<string | null>(null)
const release = () => preview.value && URL.revokeObjectURL(preview.value)
watch(photo, (file) => {
  release()
  preview.value = file ? URL.createObjectURL(file) : null
}, { immediate: true })
onBeforeUnmount(release)
</script>

<template>
  <div class="details">
    <el-upload :auto-upload="false" :show-file-list="false" accept="image/*" class="details__photo"
      :on-change="(file: UploadFile) => (photo = file.raw ?? null)">
      <span class="details__circle">
        <img v-if="preview" :src="preview" alt="" />
        <Camera v-else :size="28" />
      </span>
    </el-upload>
    <el-form-item label="Ad" prop="name">
      <el-input v-model="name" maxlength="120" placeholder="Çamlıca Konutları" />
    </el-form-item>
    <el-form-item label="Adres">
      <el-input v-model="address" maxlength="300" placeholder="İsteğe bağlı" />
    </el-form-item>
    <p class="details__members">Katılımcılar: {{ memberCount ? `${memberCount} kişi ve sen` : 'yalnızca sen' }}</p>
  </div>
</template>

<style scoped>
.details {
  display: grid;
}

.details__photo {
  justify-self: center;
  margin-bottom: var(--space-4);
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
  cursor: pointer;
}

.details__circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.details__members {
  margin: 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
</style>
