<script setup lang="ts">
const name = defineModel<string>('name', { required: true })
const phone = defineModel<string>('phone', { required: true })
const email = defineModel<string>('email', { required: true })
const city = defineModel<string>('city', { required: true })
const { show, busy, saving, dirty, error } = defineProps<{
  show: boolean; busy: boolean; saving: boolean; dirty: boolean; error: string
}>()
const emit = defineEmits<{ cancel: []; save: [] }>()
const validEmail = (value: string) => !value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

function cancel(open = false) {
  if (!open && !busy) emit('cancel')
}

function save() {
  if (!busy && dirty) emit('save')
}
</script>

<template>
  <van-popup :show="show" position="bottom" teleport="body" class="company-edit" safe-area-inset-top
    :close-on-click-overlay="!busy" @update:show="cancel">
    <van-nav-bar title="Firma bilgilerini düzenle" :left-text="busy ? '' : 'Vazgeç'" :border="false" @click-left="cancel()" />
    <van-form class="company-edit__form" @submit="save">
      <div class="company-edit__body">
        <p>Firma adını ve iletişim bilgilerini güncelleyin.</p>
        <van-notice-bar v-if="error" :text="error" left-icon="warning-o" wrapable :scrollable="false"
          color="var(--status-danger)" background="var(--status-danger-bg)" class="company-edit__error" />
        <van-cell-group inset>
          <van-field v-model="name" label="Firma adı" label-align="top" placeholder="Firma adını yazın" maxlength="120"
            required :disabled="busy" :rules="[{ validator: (value: string) => !!value.trim(), message: 'Firma adı gerekli.' }]" />
          <van-field v-model="city" label="Şehir" label-align="top" placeholder="Şehir ekleyin" maxlength="60" :disabled="busy" />
          <van-field v-model="phone" label="Telefon" label-align="top" type="tel" placeholder="Telefon ekleyin"
            maxlength="20" :disabled="busy" />
          <van-field v-model="email" label="E-posta" label-align="top" type="email" placeholder="E-posta ekleyin"
            maxlength="254" :disabled="busy" :rules="[{ validator: validEmail, message: 'Geçerli bir e-posta adresi yazın.' }]" />
        </van-cell-group>
      </div>
      <footer class="company-edit__footer">
        <van-button native-type="button" :disabled="busy" @click="cancel()">Vazgeç</van-button>
        <van-button type="primary" native-type="submit" :loading="saving" :disabled="busy || !dirty">Değişiklikleri kaydet</van-button>
      </footer>
    </van-form>
  </van-popup>
</template>

<style scoped>
.company-edit { height: 100dvh; display: flex; flex-direction: column; overflow: hidden; background: var(--surface); }
.company-edit > .van-nav-bar { flex-shrink: 0; border-bottom: 1px solid var(--border-soft); }
.company-edit__form { display: flex; flex-direction: column; flex: 1; min-height: 0; }
.company-edit__body { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior-y: contain; padding: var(--space-4); }
.company-edit__body > p { margin: 0 0 var(--space-5); color: var(--text-muted); font-size: var(--text-sm); line-height: 1.6; }
.company-edit__error { border-radius: var(--radius-sm); margin-bottom: var(--space-4); }
.company-edit__body .van-cell-group { border: 1px solid var(--border-soft); }
.company-edit__body :deep(.van-field__label) { margin-bottom: var(--space-2); font-size: var(--text-xs); font-weight: var(--weight-semibold); }
.company-edit__footer { display: flex; flex-shrink: 0; gap: var(--space-2); border-top: 1px solid var(--border-soft); padding: var(--space-3) var(--space-4) calc(var(--space-3) + env(safe-area-inset-bottom, 0px)); }
.company-edit__footer .van-button--primary { flex: 1; font-size: var(--text-xs); }
</style>
