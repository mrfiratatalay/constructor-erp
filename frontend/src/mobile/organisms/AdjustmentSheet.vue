<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { LocationView, StockRow } from '@/core/api/generated/model'
import { adjustmentError, emptyAdjustmentForm, type AdjustmentForm } from '@/core/materials/adjustmentForm'
import { ADJUSTMENT_REASONS } from '@/core/materials/materialLabels'
import { formatQuantity, withUnit } from '@/core/materials/quantity'
import { useStockAdjust } from '@/core/materials/useStockAdjust'
import { availableAt } from '@/core/materials/useStockRows'
import DateField from '@/mobile/molecules/DateField.vue'
import LocationPicker from '@/mobile/molecules/LocationPicker.vue'

/**
 * Sayım düzeltmesi, alttan: sistem miktarı yazar, sayılan girilince fark hesaplanır; neden zorunlu (hazır nedenler
 * çip olarak). Eski hareketler değişmez, fark ayrı bir hareket olarak geçmişe yazılır.
 */
const target = defineModel<{ row: StockRow; locationId: string | null } | null>({ required: true })
const { locations } = defineProps<{ locations: LocationView[] }>()
const { adjust, isSaving } = useStockAdjust()
const form = ref<AdjustmentForm | null>(null)
const system = computed(() =>
  target.value && form.value?.locationId
    ? availableAt([target.value.row], target.value.row.materialId, form.value.locationId)
    : null,
)
const counted = computed({
  get: () => (form.value?.counted == null ? '' : String(form.value.counted)),
  set: (text: string) => form.value && (form.value.counted = text.trim() === '' ? null : Number(text.replace(',', '.'))),
})
const difference = computed(() =>
  system.value !== null && form.value?.counted != null ? form.value.counted - system.value : null,
)

watch(target, (next) => (form.value = next ? emptyAdjustmentForm(next.row.materialId, next.locationId) : null))

async function submit() {
  if (!form.value) return
  const problem = adjustmentError(form.value, system.value)
  if (problem) return showFailToast(problem)
  await adjust(form.value).then(
    () => { showSuccessToast('Sayım kaydedildi'); target.value = null },
    (error) => showFailToast(errorMessage(error)),
  )
}
</script>

<template>
  <van-popup :show="!!target" position="bottom" round closeable teleport="body" safe-area-inset-bottom
    @update:show="(value: boolean) => !value && (target = null)">
    <van-form v-if="form && target" class="adjust-sheet" @submit="submit">
      <h3>Sayım düzeltmesi · {{ target.row.name }}</h3>
      <van-cell-group inset>
        <LocationPicker v-model="form.locationId" label="Lokasyon" :locations="locations" />
        <van-cell title="Sistemdeki" :value="system === null ? '—' : withUnit(system, target.row.unit)" />
        <van-field v-model="counted" type="number" label="Sayılan" placeholder="0" required>
          <template #extra><van-tag plain type="primary">{{ target.row.unit }}</van-tag></template>
        </van-field>
        <van-cell v-if="difference" title="Fark"
          :value="`${difference > 0 ? '+' : '−'}${formatQuantity(Math.abs(difference))} ${target.row.unit}`" />
        <van-field v-model="form.reason" label="Neden" placeholder="Seç ya da yaz" maxlength="120" required />
        <div class="adjust-sheet__reasons">
          <van-tag v-for="reason in ADJUSTMENT_REASONS" :key="reason" round size="medium"
            :type="form.reason === reason ? 'primary' : 'default'" @click="form!.reason = reason">{{ reason }}</van-tag>
        </div>
        <DateField v-model="form.day" label="Tarih" required />
        <van-field v-model="form.note" type="textarea" label="Not" rows="1" autosize maxlength="500" />
      </van-cell-group>
      <van-button type="primary" round block native-type="submit" :loading="isSaving">Düzeltmeyi kaydet</van-button>
    </van-form>
  </van-popup>
</template>

<style scoped>
.adjust-sheet {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-5) 0 calc(var(--space-6) + env(safe-area-inset-bottom, 0px));
}

.adjust-sheet h3 {
  margin: 0;
  padding: 0 var(--space-10) 0 var(--space-4);
}

.adjust-sheet > .van-button {
  width: auto;
  margin: 0 var(--space-4);
}

.adjust-sheet__reasons {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4) var(--space-3);
}
</style>
