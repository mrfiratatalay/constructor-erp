<script setup lang="ts">
import { computed } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { errorMessage } from '@/core/api/errors'
import type { ProductionItemView } from '@/core/api/generated/model'
import { crewIdForText, crewSuggestions, crewTextOf, tradeChoices, UNIT_PRESETS } from '@/core/production/itemForm'
import type { useProductionItemEditor } from '@/core/production/useProductionItemEditor'
import ChoiceChips from '@/mobile/molecules/ChoiceChips.vue'
import DateField from '@/mobile/molecules/DateField.vue'

/**
 * "Yeni İmalat" (ve düzenleme), alttan: tür, isteğe bağlı ad, taşeron, toplam miktar ve birim, başlangıç, planlanan
 * bitiş (gecikme buna göre), açıklama. Telefonda açılır liste yerine: alan yazılır, altındaki hazır seçeneklerden biri
 * tek dokunuşla da seçilir. Listede olmayan taşeron yazılırsa kaydederken eklenir (yoklamaya da girer).
 */
const show = defineModel<boolean>('show', { required: true })
const { editor, items } = defineProps<{
  editor: ReturnType<typeof useProductionItemEditor>
  items: ProductionItemView[]
}>()
const { form, editing, crews, problem, isSaving } = editor
const isNew = computed(() => !editing.value)
const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }))
const trades = computed(() => toOptions(tradeChoices(items)))
const units = toOptions(UNIT_PRESETS)
const crewText = computed({
  get: () => crewTextOf(form.crewId, crews.value),
  set: (text: string) => (form.crewId = crewIdForText(text, crews.value)),
})
const crewOptions = computed(() =>
  crewSuggestions(crews.value, crewText.value).map((crew) => ({ value: crew.id, label: crew.name })))
const startDay = computed(() => (form.startDate ? new Date(`${form.startDate}T00:00:00`) : undefined))
const trade = computed({ get: () => form.trade, set: (value?: string) => (form.trade = value ?? '') })
const unit = computed({ get: () => form.unit, set: (value?: string) => (form.unit = value ?? '') })

async function submit() {
  if (problem.value) return showFailToast(problem.value)
  try {
    await editor.save()
    showSuccessToast(isNew.value ? 'İmalat oluşturuldu' : 'İmalat güncellendi')
    show.value = false
  } catch (error) {
    showFailToast(errorMessage(error))
  }
}
</script>

<template>
  <van-action-sheet v-model:show="show" :title="isNew ? 'Yeni İmalat' : 'İmalatı düzenle'" teleport="body">
    <van-form label-width="7.5em" @submit="submit">
      <van-cell-group inset>
        <van-field v-model="form.trade" label="İmalat türü" placeholder="Demir İşleri" maxlength="60" required />
        <van-cell><template #title><ChoiceChips v-model="trade" :options="trades" /></template></van-cell>
        <van-field v-model="form.title" label="İmalat adı" placeholder="İsteğe bağlı: A Blok Demir" maxlength="120" />
        <van-field v-model="crewText" label="Taşeron" placeholder="Seç ya da yeni taşeron yaz" maxlength="120" />
        <van-cell v-if="crewOptions.length">
          <template #title><ChoiceChips v-model="form.crewId" :options="crewOptions" /></template>
        </van-cell>
      </van-cell-group>
      <van-cell-group inset class="item-sheet__group">
        <van-field v-model="form.total" label="Toplam miktar" inputmode="decimal" placeholder="120" required>
          <template #extra>{{ form.unit }}</template>
        </van-field>
        <van-field v-model="form.unit" label="Birim" maxlength="12" required />
        <van-cell><template #title><ChoiceChips v-model="unit" :options="units" /></template></van-cell>
        <DateField v-model="form.startDate" label="Başlangıç" any-day clearable />
        <DateField v-model="form.plannedEnd" label="Planlanan bitiş" any-day :min="startDay" clearable />
        <van-field v-model="form.note" label="Açıklama" type="textarea" rows="2" autosize maxlength="500"
          show-word-limit placeholder="A ve B blok demir imalatları." />
      </van-cell-group>
      <div class="item-sheet__submit">
        <van-button type="primary" native-type="submit" block round :loading="isSaving">
          {{ isNew ? 'İmalatı oluştur' : 'Kaydet' }}
        </van-button>
      </div>
    </van-form>
  </van-action-sheet>
</template>

<style scoped>
.item-sheet__group {
  margin-top: var(--space-3);
}

.item-sheet__submit {
  padding: var(--space-4) var(--space-4) calc(var(--space-4) + env(safe-area-inset-bottom));
}
</style>
