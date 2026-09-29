<script setup lang="ts">
import { computed } from 'vue'
import type { FeatureInfo } from '@/core/api/generated/model'
import type { PlanForm } from '@/core/admin/usePlanAdmin'

/**
 * Paket koşulları: ad, slogan, aylık fiyat (boşsa "teklifle"), kişi ve aktif şantiye sınırı (boşsa sınırsız), öne
 * çıkarma, tanıtım sitesinde görünürlük, satış durumu ve açtığı modüller. Fiyat açık dönemleri etkilemez.
 */
const { features = [], saving = false } = defineProps<{ features?: FeatureInfo[]; saving?: boolean }>()
const form = defineModel<PlanForm | null>('form', { required: true })
const emit = defineEmits<{ save: [] }>()
const byQuote = computed({
  get: () => form.value?.monthlyPrice == null,
  set: (quote: boolean) => form.value && (form.value.monthlyPrice = quote ? null : 0),
})
const submit = () => emit('save')
</script>

<template>
  <el-dialog :model-value="!!form" :title="form ? `Paket: ${form.name}` : ''" width="620px" @close="form = null">
    <el-form v-if="form" label-position="top" @submit.prevent="submit">
      <el-row :gutter="16">
        <el-col :span="10"><el-form-item label="Ad" required><el-input v-model="form.name" maxlength="60" /></el-form-item></el-col>
        <el-col :span="14"><el-form-item label="Slogan"><el-input v-model="form.tagline" maxlength="160" /></el-form-item></el-col>
      </el-row>
      <el-form-item label="Aylık fiyat (₺)">
        <el-checkbox v-model="byQuote">Teklifle satılır</el-checkbox>
        <el-input-number v-if="!byQuote" v-model="form.monthlyPrice" :min="0" :step="100" class="plan-edit__price" />
      </el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Kişi sınırı (boş: sınırsız)"><el-input-number v-model="form.maxUsers" :min="1" /></el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Aktif şantiye sınırı (boş: sınırsız)"><el-input-number v-model="form.maxSites" :min="1" /></el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Modüller">
        <el-checkbox-group v-model="form.features" class="plan-edit__features">
          <el-checkbox v-for="feature in features" :key="feature.key" :value="feature.key">{{ feature.name }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Tanıtım sitesi" class="plan-edit__switches">
        <el-switch v-model="form.visible" active-text="Fiyatlar sayfasında görünür" />
        <el-switch v-model="form.highlighted" active-text="Önerilen paket olarak öne çıkar" />
      </el-form-item>
      <el-form-item label="Satış">
        <el-radio-group v-model="form.status">
          <el-radio-button value="ACTIVE">Satışta</el-radio-button>
          <el-radio-button value="ARCHIVED">Arşivde (yeni satış yok)</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="form = null">Vazgeç</el-button>
      <el-button type="primary" :loading="saving" @click="submit">Kaydet</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.plan-edit__price {
  margin-left: var(--space-4);
}

.plan-edit__features,
.plan-edit__switches :deep(.el-form-item__content) {
  display: grid;
  justify-items: start;
}
</style>
