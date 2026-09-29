<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { LocationView, StockRow } from '@/core/api/generated/model'
import { adjustmentError, emptyAdjustmentForm, type AdjustmentForm } from '@/core/materials/adjustmentForm'
import { ADJUSTMENT_REASONS } from '@/core/materials/materialLabels'
import { formatQuantity, withUnit } from '@/core/materials/quantity'
import { useStockAdjust } from '@/core/materials/useStockAdjust'
import { availableAt } from '@/core/materials/useStockRows'
import LocationSelect from '@/desktop/molecules/LocationSelect.vue'

/**
 * Sayım düzeltmesi: fiziksel sayım sistemden farklıysa. Sistem miktarı yazar, sayılan girilince fark kendiliğinden
 * hesaplanır; neden zorunlu. Eski hareketler değişmez, fark ayrı bir hareket olarak geçmişe yazılır.
 */
const target = defineModel<{ row: StockRow; locationId: string | null } | null>({ required: true })
const { locations } = defineProps<{ locations: LocationView[] }>()
const { adjust, isSaving } = useStockAdjust()
const form = ref<AdjustmentForm | null>(null)
const system = computed(() =>
  target.value && form.value?.locationId ? availableAt([target.value.row], target.value.row.materialId, form.value.locationId) : null,
)
const difference = computed(() => (system.value !== null && form.value?.counted != null ? form.value.counted - system.value : null))

watch(target, (next) => (form.value = next ? emptyAdjustmentForm(next.row.materialId, next.locationId) : null))

async function submit() {
  if (!form.value) return
  const problem = adjustmentError(form.value, system.value)
  if (problem) return ElMessage.warning(problem)
  await adjust(form.value).then(
    () => { ElMessage.success('Sayım düzeltmesi kaydedildi'); target.value = null },
    (error) => ElMessage.error(errorMessage(error)),
  )
}
</script>

<template>
  <el-dialog :model-value="!!target" :title="`Sayım düzeltmesi · ${target?.row.name ?? ''}`" width="500px" append-to-body
    @close="target = null">
    <el-form v-if="form && target" label-position="top" require-asterisk-position="right" @submit.prevent="submit">
      <el-form-item label="Lokasyon" required><LocationSelect v-model="form.locationId" :locations="locations" /></el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Sistemdeki miktar">
            <el-input :model-value="system === null ? '—' : withUnit(system, target.row.unit)" disabled size="large" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Sayılan miktar" required>
            <el-input-number v-model="form.counted" :min="0" :controls="false" align="left" :value-on-clear="null"
              size="large" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-alert v-if="difference" :type="difference > 0 ? 'success' : 'warning'" :closable="false" show-icon
        style="margin-bottom: 18px"
        :title="`Fark: ${difference > 0 ? '+' : '−'}${formatQuantity(Math.abs(difference))} ${target.row.unit}`" />
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Neden" required>
            <el-select v-model="form.reason" filterable allow-create default-first-option placeholder="Seç ya da yaz"
              size="large">
              <el-option v-for="reason in ADJUSTMENT_REASONS" :key="reason" :value="reason" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Tarih" required>
            <el-date-picker v-model="form.day" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" size="large"
              :clearable="false" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Not"><el-input v-model="form.note" type="textarea" :rows="2" maxlength="500" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="target = null">Vazgeç</el-button>
      <el-button type="primary" :loading="isSaving" @click="submit">Düzeltmeyi kaydet</el-button>
    </template>
  </el-dialog>
</template>
