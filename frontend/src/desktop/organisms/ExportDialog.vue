<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Download } from 'lucide-vue-next'
import { rangeOf, type DatePreset, type DateRange } from '@/core/materials/dateRanges'
import { materialExportUrl, REPORT_SHEETS, type ReportSheet } from '@/core/materials/materialExport'
import { STATUS_LOOKS, TYPE_LOOKS, type MovementStatus, type MovementType } from '@/core/materials/materialLabels'
import type { MovementFilters } from '@/core/materials/movementQuery'
import { useMaterialOptions } from '@/core/materials/useMaterialOptions'
import DateFilter from '@/desktop/molecules/DateFilter.vue'
import LocationSelect from '@/desktop/molecules/LocationSelect.vue'

/**
 * Excel İndir: ekrandaki süzgeçler pencereye olduğu gibi taşınır, burada değiştirilebilir; hangi sayfaların
 * yazılacağı seçilir (tek çalışma kitabı). Dosya sunucuda oluşur, tarayıcı indirir.
 */
const open = defineModel<boolean>('open', { required: true })
const { filters } = defineProps<{ filters: MovementFilters }>()
const options = useMaterialOptions()
const draft = ref<MovementFilters>({ ...filters })
const sheets = ref<ReportSheet[]>(REPORT_SHEETS.map((sheet) => sheet.key))
const TYPES = Object.keys(TYPE_LOOKS) as MovementType[]
const STATUSES = Object.keys(STATUS_LOOKS) as MovementStatus[]
const url = computed(() => materialExportUrl(draft.value, sheets.value))

watch(open, (isOpen) => isOpen && (draft.value = { ...filters }))
const setDates = (preset: DatePreset, custom?: DateRange) => Object.assign(draft.value, { preset, ...rangeOf(preset, custom) })
</script>

<template>
  <el-dialog v-model="open" title="Excel raporu" width="620px" append-to-body>
    <el-form label-position="top">
      <el-form-item label="Sayfalar">
        <el-checkbox-group v-model="sheets">
          <el-space direction="vertical" alignment="flex-start" :size="6">
            <el-checkbox v-for="sheet in REPORT_SHEETS" :key="sheet.key" :value="sheet.key">
              <b>{{ sheet.label }}</b> <el-text type="info" size="small">· {{ sheet.hint }}</el-text>
            </el-checkbox>
          </el-space>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Tarih"><DateFilter :preset="draft.preset" :range="draft" @change="setDates" /></el-form-item>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-form-item label="Lokasyon">
            <LocationSelect v-model="draft.locationId" :locations="options.locations.value" placeholder="Tümü" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Malzeme">
            <el-select v-model="draft.materialId" placeholder="Tümü" filterable clearable size="large" :value-on-clear="null">
              <el-option v-for="item in options.materials.value" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Kategori">
            <el-select v-model="draft.category" placeholder="Tümü" clearable size="large" :value-on-clear="null">
              <el-option v-for="category in options.categories.value" :key="category" :value="category" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Hareket türü">
            <el-select v-model="draft.type" placeholder="Tümü" clearable size="large" :value-on-clear="null">
              <el-option v-for="type in TYPES" :key="type" :value="type" :label="TYPE_LOOKS[type].label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Firma">
            <el-select v-model="draft.partyId" placeholder="Tümü" filterable clearable size="large" :value-on-clear="null">
              <el-option v-for="party in options.parties.value" :key="party.id" :value="party.id" :label="party.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Durum">
            <el-select v-model="draft.status" placeholder="Tümü" clearable size="large" :value-on-clear="null">
              <el-option v-for="status in STATUSES" :key="status" :value="status" :label="STATUS_LOOKS[status].label" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="open = false">Vazgeç</el-button>
      <el-button type="primary" tag="a" :href="url" :icon="Download" :disabled="!sheets.length" @click="open = false">
        Excel indir
      </el-button>
    </template>
  </el-dialog>
</template>
