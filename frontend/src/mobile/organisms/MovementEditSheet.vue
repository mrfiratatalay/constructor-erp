<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { MovementDetail } from '@/core/api/generated/model'
import { useMovementCommands } from '@/core/materials/useMovementCommands'
import DateField from '@/mobile/molecules/DateField.vue'

/**
 * Hareketin düzeltilebilen bilgileri: açıklama, kullanım alanı, ödünçte beklenen iade tarihi ve notu. Miktar, malzeme
 * ve lokasyon değişmez: yanlışsa hareket iptal edilip yenisi girilir. Değişiklik geçmişe yazılır.
 */
const open = defineModel<boolean>('open', { required: true })
const { detail } = defineProps<{ detail: MovementDetail }>()
const commands = useMovementCommands()
const form = ref({ description: '', usageArea: '', expectedReturnDate: null as string | null, returnNote: '' })
const loan = computed(() => detail.movement.purpose === 'LOANED')

watch(open, (isOpen) => {
  if (!isOpen) return
  const row = detail.movement
  form.value = { description: row.description ?? '', usageArea: row.usageArea ?? '',
    expectedReturnDate: row.expectedReturnDate ?? null, returnNote: detail.returnNote ?? '' }
})

async function submit() {
  const clean = (text: string) => text.trim() || null
  const { description, usageArea, expectedReturnDate, returnNote } = form.value
  const data = { description: clean(description), usageArea: clean(usageArea), expectedReturnDate,
    returnNote: clean(returnNote) }
  await commands.update(detail.movement.id, data).then(
    () => { showSuccessToast('Düzeltildi'); open.value = false },
    (error) => showFailToast(errorMessage(error)),
  )
}
</script>

<template>
  <van-popup v-model:show="open" position="bottom" round closeable teleport="body" safe-area-inset-bottom>
    <van-form class="edit-sheet" @submit="submit">
      <h3 class="edit-sheet__title">Hareketi düzelt</h3>
      <van-notice-bar wrapable :scrollable="false" left-icon="info-o"
        text="Miktar, malzeme ve lokasyon değişmez: yanlışsa hareketi iptal edip yenisini gir." />
      <van-cell-group inset>
        <van-field v-if="detail.movement.type === 'USED'" v-model="form.usageArea" label="Kullanım alanı" maxlength="120" />
        <template v-if="loan">
          <DateField v-model="form.expectedReturnDate" label="Beklenen iade" future />
          <van-field v-model="form.returnNote" label="Dönüş notu" maxlength="300" />
        </template>
        <van-field v-model="form.description" type="textarea" label="Açıklama" rows="2" autosize maxlength="500"
          show-word-limit />
      </van-cell-group>
      <van-button type="primary" round block native-type="submit" :loading="commands.isBusy.value">Kaydet</van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.edit-sheet {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-6) var(--space-4) calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.edit-sheet__title {
  margin: 0;
  font-size: var(--text-md);
}
</style>
