<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { MovementDetail, MovementUpdateRequest } from '@/core/api/generated/model'
import { useMovementCommands } from '@/core/materials/useMovementCommands'

/**
 * Hareketin düzeltilebilen bilgileri: açıklama, kullanım alanı, ödünçte beklenen iade tarihi ve notu. Miktar,
 * malzeme ve lokasyon burada yoktur: yanlışsa hareket iptal edilip yenisi girilir. Değişiklik geçmişe yazılır.
 */
const open = defineModel<boolean>('open', { required: true })
const { detail } = defineProps<{ detail: MovementDetail }>()
const commands = useMovementCommands()
const form = ref<Required<MovementUpdateRequest>>({ description: '', usageArea: '', expectedReturnDate: null, returnNote: '' })
const loan = computed(() => detail.movement.purpose === 'LOANED')
const used = computed(() => detail.movement.type === 'USED')

watch(open, (isOpen) => {
  if (!isOpen) return
  const row = detail.movement
  form.value = { description: row.description ?? '', usageArea: row.usageArea ?? '',
    expectedReturnDate: row.expectedReturnDate ?? null, returnNote: detail.returnNote ?? '' }
})

async function submit() {
  const clean = (text: string | null | undefined) => text?.trim() || null
  const data = { description: clean(form.value.description), usageArea: clean(form.value.usageArea),
    expectedReturnDate: form.value.expectedReturnDate, returnNote: clean(form.value.returnNote) }
  await commands.update(detail.movement.id, data).then(
    () => { ElMessage.success('Düzeltildi; geçmişe yazıldı'); open.value = false },
    (error) => ElMessage.error(errorMessage(error)),
  )
}
</script>

<template>
  <el-dialog v-model="open" title="Hareketi düzelt" width="480px" append-to-body>
    <el-alert type="info" :closable="false" show-icon style="margin-bottom: 16px"
      title="Miktar, malzeme ve lokasyon değişmez: yanlışsa hareketi iptal edip yenisini gir." />
    <el-form label-position="top" @submit.prevent="submit">
      <el-form-item v-if="used" label="Kullanım alanı"><el-input v-model="form.usageArea" maxlength="120" /></el-form-item>
      <template v-if="loan">
        <el-form-item label="Beklenen iade tarihi">
          <el-date-picker v-model="form.expectedReturnDate" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="Geri dönüş notu"><el-input v-model="form.returnNote" maxlength="300" /></el-form-item>
      </template>
      <el-form-item label="Açıklama">
        <el-input v-model="form.description" type="textarea" :rows="3" maxlength="500" show-word-limit />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="open = false">Vazgeç</el-button>
      <el-button type="primary" :loading="commands.isBusy.value" @click="submit">Kaydet</el-button>
    </template>
  </el-dialog>
</template>
