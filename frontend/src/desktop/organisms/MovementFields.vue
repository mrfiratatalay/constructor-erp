<script setup lang="ts">
import { computed } from 'vue'
import type { LocationView, PartyView } from '@/core/api/generated/model'
import { PURPOSE_LABELS, type MovementPurpose } from '@/core/materials/materialLabels'
import { movementFields } from '@/core/materials/movementFields'
import type { MovementForm } from '@/core/materials/movementForm'
import LocationSelect from '@/desktop/molecules/LocationSelect.vue'
import PartyPicker from '@/desktop/molecules/PartyPicker.vue'

/**
 * Hareketin uçları ve türe özgü alanları: nereden, nereye (ya da hangi şantiye), tarih, firma, veriliş amacı; ödünçte
 * beklenen iade tarihi ve geri dönüş notu; kullanımda kullanım alanı; sevkiyatta "Teslim edildi / Yolda", girişte
 * "Kontrol edildi / Kontrol bekliyor". Türün istemediği alan hiç görünmez.
 */
const form = defineModel<MovementForm>({ required: true })
const { locations, parties } = defineProps<{ locations: LocationView[]; parties: PartyView[] }>()
const fields = computed(() => movementFields(form.value.type, form.value.purpose))
const PURPOSES = (Object.keys(PURPOSE_LABELS) as MovementPurpose[]).map((value) => ({
  value,
  label: PURPOSE_LABELS[value],
}))
const TRANSIT = [
  { value: false, label: 'Teslim edildi' },
  { value: true, label: 'Yolda' },
]
const CHECK = [
  { value: false, label: 'Kontrol edildi' },
  { value: true, label: 'Kontrol bekliyor' },
]
const beforeDay = (date: Date) => date < new Date(`${form.value.day}T00:00:00`)
const future = (date: Date) => date > new Date()
const toggle = computed(() => (fields.value.transit ? TRANSIT : fields.value.check ? CHECK : null))
const toggled = computed({
  get: () => (fields.value.transit ? form.value.inTransit : form.value.pendingCheck),
  set: (value: boolean) => (fields.value.transit ? (form.value.inTransit = value) : (form.value.pendingCheck = value)),
})
</script>

<template>
  <el-row :gutter="16">
    <el-col v-if="fields.source" :span="fields.destination ? 12 : 24">
      <el-form-item :label="fields.source.label" required>
        <LocationSelect v-model="form.sourceId" :locations="locations" :exclude="form.destinationId" />
      </el-form-item>
    </el-col>
    <el-col v-if="fields.destination" :span="fields.source ? 12 : 24">
      <el-form-item :label="fields.destination.label" required>
        <LocationSelect v-model="form.destinationId" :locations="locations" :sites-only="fields.destination.sitesOnly"
          :exclude="form.sourceId" />
      </el-form-item>
    </el-col>
  </el-row>
  <el-row :gutter="16">
    <el-col :span="toggle ? 12 : 24">
      <el-form-item label="Tarih" required>
        <el-date-picker v-model="form.day" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY" size="large"
          :clearable="false" :disabled-date="future" style="width: 100%" />
      </el-form-item>
    </el-col>
    <el-col v-if="toggle" :span="12">
      <el-form-item :label="fields.transit ? 'Teslim durumu' : 'Kontrol'">
        <el-segmented v-model="toggled" :options="toggle" block size="large" style="width: 100%" />
      </el-form-item>
    </el-col>
  </el-row>
  <el-form-item v-if="fields.usageArea" label="Kullanım alanı">
    <el-input v-model="form.usageArea" maxlength="120" placeholder="Ör. C Blok kolon betonu" size="large" />
  </el-form-item>
  <el-form-item v-if="fields.purpose" label="Veriliş amacı" required>
    <el-segmented :model-value="form.purpose ?? undefined" :options="PURPOSES" block size="large" style="width: 100%"
      @update:model-value="(value) => (form.purpose = value as MovementPurpose)" />
  </el-form-item>
  <el-form-item v-if="fields.party" :required="fields.party.required">
    <template #label>
      {{ fields.party.label }} <el-text v-if="!fields.party.required" type="info" size="small">(Opsiyonel)</el-text>
    </template>
    <PartyPicker v-model="form.party" :parties="parties" />
  </el-form-item>
  <el-row v-if="fields.loanDetails" :gutter="16">
    <el-col :span="10">
      <el-form-item label="Beklenen iade tarihi">
        <el-date-picker v-model="form.expectedReturnDate" type="date" value-format="YYYY-MM-DD" format="DD.MM.YYYY"
          placeholder="Tarih seç" :disabled-date="beforeDay" size="large" style="width: 100%" />
      </el-form-item>
    </el-col>
    <el-col :span="14">
      <el-form-item label="Geri dönüş notu">
        <el-input v-model="form.returnNote" maxlength="300" placeholder="Ör. temiz ve eksiksiz dönecek" size="large" />
      </el-form-item>
    </el-col>
  </el-row>
</template>
