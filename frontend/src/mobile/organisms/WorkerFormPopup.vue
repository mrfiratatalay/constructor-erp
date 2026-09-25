<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CreateWorkerRequest } from '@/core/api/generated/model'

/**
 * Yoklamadaki "＋ Personel ekle": yalnızca ad soyad ve (isteğe bağlı) görevi. Personel uygulamanın kullanıcısı
 * değildir; telefonu, girişi, davet bağlantısı yoktur. Kişi penceresiyle (MemberFormPopup) aynı kalıp.
 * sites: Yoklama ekranından eklerken şantiye belli değildir; birden çok aktif şantiye varsa yalnızca burada sorulur
 * (ilki seçili gelir), tek şantiye varsa hiç sorulmaz.
 */
const show = defineModel<boolean>('show', { required: true })
const { saving, sites = [] } = defineProps<{ saving: boolean; sites?: { id: string; name: string }[] }>()
const emit = defineEmits<{ submit: [form: CreateWorkerRequest, siteId: string | null] }>()

const fullName = ref('')
const trade = ref('')
const siteId = ref('')

watch(show, (open) => {
  if (!open) return
  fullName.value = ''
  trade.value = ''
  siteId.value = sites[0]?.id ?? ''
})

function submit() {
  emit('submit', { fullName: fullName.value.trim(), trade: trade.value.trim() || null }, siteId.value || null)
}
</script>

<template>
  <van-popup v-model:show="show" position="bottom" round closeable teleport="body">
    <van-form class="worker-form" @submit="submit">
      <h2 class="worker-form__title">Personel ekle</h2>
      <van-cell-group inset>
        <van-field v-model="fullName" label="Ad soyad" placeholder="Ali Usta" maxlength="120"
          :rules="[{ required: true, validator: (value: string) => value.trim() !== '', message: 'Ad soyad gerekli' }]" />
        <van-field v-model="trade" label="Görevi" placeholder="İsteğe bağlı (ör. Kalıpçı)" maxlength="80" />
      </van-cell-group>
      <van-radio-group v-if="sites.length > 1" v-model="siteId">
        <van-cell-group inset title="Şantiye">
          <van-cell v-for="site in sites" :key="site.id" :title="site.name" clickable @click="siteId = site.id">
            <template #right-icon><van-radio :name="site.id" /></template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
      <van-button type="primary" native-type="submit" block round :loading="saving">Ekle</van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.worker-form {
  display: grid;
  gap: var(--space-4);
  max-height: 85dvh;
  overflow-y: auto;
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.worker-form__title {
  margin: 0;
  font-size: 18px;
}
</style>
