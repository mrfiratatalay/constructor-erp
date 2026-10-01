<script setup lang="ts">
import { ref, watch } from 'vue'

const show = defineModel<boolean>('show', { required: true })
const { busy } = defineProps<{ busy: boolean }>()
const emit = defineEmits<{ submit: [reason: string] }>()
const reason = ref('')
watch(show, (open) => { if (open) reason.value = '' })

function submit() {
  if (!busy && reason.value.trim()) emit('submit', reason.value.trim())
}

function close(open = false) {
  if (!open && !busy) show.value = false
}
</script>

<template>
  <van-popup :show="show" position="bottom" round teleport="body" class="movement-cancel"
    :close-on-click-overlay="!busy" @update:show="close">
    <van-nav-bar title="Hareketi iptal et" :left-text="busy ? '' : 'Vazgeç'" @click-left="close()" />
    <van-form class="movement-cancel__form" @submit="submit">
      <p>Kayıt ve iptal nedeni hareket geçmişinde korunur.</p>
      <van-field v-model="reason" label="İptal nedeni" label-align="top" type="textarea" rows="3" autosize
        maxlength="300" show-word-limit required :disabled="busy" placeholder="Neden iptal ediliyor?"
        :rules="[{ validator: (value: string) => !!value?.trim(), message: 'İptal nedeni gerekli.' }]" />
      <van-button type="danger" native-type="submit" block :loading="busy" :disabled="busy">Hareketi iptal et</van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.movement-cancel { max-height: 85dvh; overflow-y: auto; }
.movement-cancel__form { display: grid; gap: var(--space-4); padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom, 0px)); }
.movement-cancel__form p { margin: 0; color: var(--text-muted); font-size: var(--text-sm); line-height: 1.6; }
.movement-cancel__form .van-field { border-radius: var(--radius-md); background: var(--surface-muted); }
</style>
