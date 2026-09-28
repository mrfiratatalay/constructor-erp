<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { ProductionItemView } from '@/core/api/generated/model'
import { tradeChoices, UNIT_PRESETS } from '@/core/production/itemForm'
import type { useProductionItemEditor } from '@/core/production/useProductionItemEditor'

/**
 * "Yeni İmalat" (ve düzenleme), sağdan çekmece: tür (listeden ya da yeni), isteğe bağlı ad, taşeron (listede yoksa
 * adı yazılır, kaydederken eklenir), toplam miktar ve birim, başlangıç, planlanan bitiş (gecikme buna göre), açıklama.
 * Kaydedilemiyorsa nedeni ilk denemeden sonra düğmenin yanında yazar.
 */
const show = defineModel<boolean>('show', { required: true })
const { editor, items } = defineProps<{
  editor: ReturnType<typeof useProductionItemEditor>
  items: ProductionItemView[]
}>()
const { form, editing, crews, problem, isSaving } = editor
const trades = computed(() => tradeChoices(items))
const tried = ref(false)
const isNew = computed(() => !editing.value)
const beforeStart = (date: Date) => !!form.startDate && date < new Date(`${form.startDate}T00:00:00`)

watch(show, (open) => {
  if (open) tried.value = false
})

async function submit() {
  tried.value = true
  if (problem.value) return
  try {
    await editor.save()
    ElMessage.success(isNew.value ? 'İmalat oluşturuldu' : 'İmalat güncellendi')
    show.value = false
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <el-drawer v-model="show" size="460px" append-to-body :title="isNew ? 'Yeni İmalat' : 'İmalatı düzenle'">
    <el-text type="info">Şantiyede takip edilecek imalatın türünü, taşeronunu ve toplam miktarını yazın.</el-text>
    <el-form label-position="top" class="item-form" @submit.prevent="submit">
      <el-form-item label="İmalat türü" required>
        <el-select v-model="form.trade" filterable allow-create default-first-option placeholder="Seç ya da yaz">
          <el-option v-for="name in trades" :key="name" :label="name" :value="name" />
        </el-select>
      </el-form-item>
      <el-form-item label="İmalat adı (isteğe bağlı)">
        <el-input v-model="form.title" maxlength="120" placeholder="A Blok Demir İşleri" />
      </el-form-item>
      <el-form-item label="Taşeron / ekip">
        <el-select v-model="form.crewId" filterable allow-create default-first-option clearable
          placeholder="Seç ya da yeni taşeron yaz">
          <el-option v-for="crew in crews" :key="crew.id" :label="crew.name" :value="crew.id" />
        </el-select>
      </el-form-item>
      <el-row :gutter="12">
        <el-col :span="14">
          <el-form-item label="Toplam miktar" required>
            <el-input v-model="form.total" inputmode="decimal" placeholder="120" aria-label="Toplam miktar" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="Birim" required>
            <el-select v-model="form.unit" filterable allow-create default-first-option>
              <el-option v-for="unit in UNIT_PRESETS" :key="unit" :label="unit" :value="unit" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="Başlangıç">
            <el-date-picker v-model="form.startDate" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY"
              placeholder="Gün seç" class="item-form__wide" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Planlanan bitiş">
            <el-date-picker v-model="form.plannedEnd" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY"
              placeholder="Gün seç" :disabled-date="beforeStart" class="item-form__wide" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Açıklama">
        <el-input v-model="form.note" type="textarea" :rows="3" maxlength="500" show-word-limit
          placeholder="A ve B blok demir imalatları." />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-text v-if="tried && problem" type="danger" size="small" class="item-form__problem">{{ problem }}</el-text>
      <el-button @click="show = false">İptal</el-button>
      <el-button type="primary" :loading="isSaving" @click="submit">
        {{ isNew ? 'İmalatı oluştur' : 'Kaydet' }}
      </el-button>
    </template>
  </el-drawer>
</template>

<style scoped>
.item-form {
  margin-top: var(--space-4);
}

/* Sayı ve tarih kutuları sütunun tamamını kaplar (Element Plus'ta kendi genişlikleri vardır). */
.item-form__wide {
  width: 100%;
}

.item-form__problem {
  margin-right: var(--space-3);
}
</style>
