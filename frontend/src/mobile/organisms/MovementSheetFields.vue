<script setup lang="ts">
import { computed } from 'vue'
import type { LocationView, PartyView } from '@/core/api/generated/model'
import type { MovementPurpose } from '@/core/materials/materialLabels'
import { movementFields } from '@/core/materials/movementFields'
import type { MovementForm } from '@/core/materials/movementForm'
import DateField from '@/mobile/molecules/DateField.vue'
import LocationPicker from '@/mobile/molecules/LocationPicker.vue'
import PartyField from '@/mobile/molecules/PartyField.vue'

/**
 * Hareketin uçları ve türe özgü alanları, telefonda tek kart: nereden, nereye, tarih, yolda / kontrol bekliyor,
 * kullanım alanı, veriliş amacı, firma; ödünçte beklenen iade tarihi ve notu. Türün istemediği alan hiç görünmez.
 */
const form = defineModel<MovementForm>({ required: true })
const { locations, parties } = defineProps<{ locations: LocationView[]; parties: PartyView[] }>()
const fields = computed(() => movementFields(form.value.type, form.value.purpose))
/** Telefonda kısa adlar: üç seçenek tek satıra sığsın. */
const PURPOSES: { value: MovementPurpose; label: string }[] = [
  { value: 'SOLD', label: 'Satıldı' },
  { value: 'LOANED', label: 'Ödünç' },
  { value: 'SUPPORT', label: 'Destek' },
]
</script>

<template>
  <van-cell-group inset>
    <LocationPicker v-if="fields.source" v-model="form.sourceId" :label="fields.source.label" :locations="locations"
      :exclude="form.destinationId" />
    <LocationPicker v-if="fields.destination" v-model="form.destinationId" :label="fields.destination.label"
      :locations="locations" :sites-only="fields.destination.sitesOnly" :exclude="form.sourceId" />
    <DateField v-model="form.day" label="Tarih" required />
    <van-cell v-if="fields.transit" center title="Yolda" label="Teslim alınınca hedefin stoğuna girer">
      <template #right-icon><van-switch v-model="form.inTransit" /></template>
    </van-cell>
    <van-cell v-if="fields.check" center title="Kontrol bekliyor" label="Kontrol edilince stoğa girer">
      <template #right-icon><van-switch v-model="form.pendingCheck" /></template>
    </van-cell>
    <van-field v-if="fields.usageArea" v-model="form.usageArea" label="Kullanım alanı" maxlength="120"
      placeholder="Ör. C Blok kolon betonu" />
    <van-field v-if="fields.purpose" label="Veriliş amacı" required>
      <template #input>
        <van-radio-group v-model="form.purpose" direction="horizontal">
          <van-radio v-for="item in PURPOSES" :key="item.value" :name="item.value">{{ item.label }}</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <PartyField v-if="fields.party" v-model="form.party" :label="fields.party.label" :parties="parties"
      :required="fields.party.required" />
    <template v-if="fields.loanDetails">
      <DateField v-model="form.expectedReturnDate" label="Beklenen iade" future />
      <van-field v-model="form.returnNote" label="Dönüş notu" maxlength="300" placeholder="Ör. temiz dönecek" />
    </template>
  </van-cell-group>
</template>
