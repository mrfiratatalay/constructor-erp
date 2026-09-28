<script setup lang="ts">
import { ElMessage, ElNotification } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { MovementForm } from '@/core/materials/movementForm'
import { withUnit } from '@/core/materials/quantity'
import { useMaterialPermissions } from '@/core/materials/useMaterialPermissions'
import { useMovementEditor } from '@/core/materials/useMovementEditor'
import { savedSummary } from '@/core/materials/useMovementSave'
import DocumentPicker from '@/desktop/molecules/DocumentPicker.vue'
import LoanPicker from '@/desktop/molecules/LoanPicker.vue'
import MaterialPicker from '@/desktop/molecules/MaterialPicker.vue'
import MovementFields from '@/desktop/organisms/MovementFields.vue'
import MovementTypeCards from '@/shared/molecules/MovementTypeCards.vue'

/**
 * "+ Malzeme Hareketi": sağdan geniş çekmece. Önce işlem türü, sonra yalnızca o türün alanları. Birim malzemeden gelir;
 * kaynakta kullanılabilir miktar miktarın altında yazar, fazlası kaydedilmez. Kapanınca form sıfırlanır; yarım form
 * boşluğa tıklanınca kaybolmasın diye çekmece yalnızca İptal ya da × ile kapanır.
 */
const open = defineModel<boolean>('open', { required: true })
const { initial = null } = defineProps<{ initial?: MovementForm | null }>()
const emit = defineEmits<{ createMaterial: [name: string] }>()
const editor = useMovementEditor(open, () => initial)
const { form, fields, material, available, touchesSite, options, loans } = editor
const { can } = useMaterialPermissions()

/** Yeni oluşturulan malzeme kartı forma seçili gelir (sayfa kartı kaydedince çağırır). */
defineExpose({ pickMaterial: editor.pickMaterial })

async function submit() {
  const problem = editor.problem()
  if (problem) return ElMessage.warning(problem)
  try {
    const detail = await editor.submit()
    ElNotification.success({ title: 'Malzeme hareketi kaydedildi', message: savedSummary(detail) })
    open.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-drawer v-model="open" size="34%" class="movement-drawer" destroy-on-close :close-on-click-modal="false">
    <template #header>
      <el-space direction="vertical" alignment="flex-start" :size="4">
        <el-text tag="b" size="large" class="movement-drawer__title">Yeni Malzeme Hareketi</el-text>
        <el-text type="info">Şantiye, depo veya firma dışı malzeme hareketi oluşturun.</el-text>
      </el-space>
    </template>
    <el-form label-position="top" require-asterisk-position="right" @submit.prevent="submit">
      <el-form-item label="İşlem Türü"><MovementTypeCards v-model="form.type" :locked="!!initial?.returnOfId" /></el-form-item>
      <el-form-item v-if="fields.returnOf" label="İlgili ödünç çıkışı" required>
        <LoanPicker v-model="form.returnOfId" :loans="loans.rows.value" />
      </el-form-item>
      <el-form-item label="Malzeme" required>
        <MaterialPicker v-model="form.materialId" :materials="options.activeMaterials.value" :disabled="fields.returnOf"
          :can-create="can('MANAGE_MATERIAL_CATALOG')" @create="(name) => emit('createMaterial', name)" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="14">
          <el-form-item label="Miktar" required>
            <el-input-number v-model="form.quantity" :min="0" :controls="false" align="left" placeholder="0"
              size="large" :value-on-clear="null" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Birim"><el-input :model-value="material?.unit ?? '—'" disabled size="large" /></el-form-item>
        </el-col>
      </el-row>
      <el-alert v-if="available !== null && material" :closable="false" show-icon style="margin: -8px 0 18px"
        :type="(form.quantity ?? 0) > available ? 'error' : 'info'"
        :title="`Kullanılabilir: ${withUnit(Math.max(available, 0), material.unit)}`" />
      <MovementFields v-model="form" :locations="options.locations.value" :parties="options.parties.value" />
      <el-form-item :label="fields.descriptionLabel">
        <el-input v-model="form.description" type="textarea" :rows="3" maxlength="500" show-word-limit
          :placeholder="fields.descriptionHint" />
      </el-form-item>
      <el-form-item label="Belge / İrsaliye Ekle"><DocumentPicker v-model="form.files" /></el-form-item>
      <el-form-item v-if="touchesSite">
        <el-space :size="12" alignment="flex-start">
          <el-switch v-model="form.reflectToField" size="large" />
          <el-space direction="vertical" alignment="flex-start" :size="2">
            <el-text tag="b">Saha akışına yansıt</el-text>
            <el-text type="info" size="small">Bu hareket, ilgili şantiyenin Saha akışında görünsün.</el-text>
          </el-space>
        </el-space>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-row :gutter="12">
        <el-col :span="12"><el-button size="large" style="width: 100%" @click="open = false">İptal</el-button></el-col>
        <el-col :span="12">
          <el-button type="primary" size="large" style="width: 100%" :loading="editor.isSaving.value" @click="submit">
            Hareketi Kaydet
          </el-button>
        </el-col>
      </el-row>
    </template>
  </el-drawer>
</template>

<style scoped>
.movement-drawer__title {
  font-size: var(--text-lg);
}
</style>

<style>
/* Çekmece ekranın üçte biri kadar; dar pencerede formun iki sütunu sıkışmasın diye alt sınırı var. */
.movement-drawer {
  min-width: 520px;
}
</style>
