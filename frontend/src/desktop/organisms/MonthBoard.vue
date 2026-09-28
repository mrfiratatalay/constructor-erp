<script setup lang="ts">
import { computed } from 'vue'
import { Download } from 'lucide-vue-next'
import { searchBook } from '@/core/puantaj/puantajBook'
import { STATUS_LOOKS, type DayStatus, type MarkLike } from '@/core/puantaj/puantajLabels'
import { useMonthPuantaj } from '@/core/puantaj/useMonthPuantaj'
import MarkDot from '@/desktop/atoms/MarkDot.vue'
import MonthNav from '@/desktop/molecules/MonthNav.vue'
import RosterEmpty from '@/desktop/molecules/RosterEmpty.vue'
import RosterSection from '@/desktop/molecules/RosterSection.vue'
import MonthTable from '@/desktop/organisms/MonthTable.vue'

/**
 * Puantaj sekmesi, ay sonunun ekranı: ay seçici (‹ › Eylül 2026 ▾), işaretlerin açıklaması (cetveldeki dairelerin
 * aynısı, mesai noktası dahil), patrona Excel; altında kartlar içinde Personel ve Taşeron ekipler cetveli. Sayfa
 * başlığındaki arama burada da süzer. Bu ayda cetvel bugüne kayar. Bir hücreye tıklayınca o kişinin ayı sağdan, o gün
 * seçili açılır.
 */
const { query } = defineProps<{ query: string }>()
const emit = defineEmits<{ open: [entryId: string, day?: string] }>()
const { month, setMonth, isCurrentMonth, today, days, book, isEmpty, isPending, canExport, exportUrl } =
  useMonthPuantaj()
const shown = computed(() => searchBook(book.value, query))
const focusDay = computed(() => (isCurrentMonth.value ? today : null))
const LEGEND: { label: string; mark: MarkLike }[] = [
  ...(Object.keys(STATUS_LOOKS) as DayStatus[]).map((status) => ({
    label: STATUS_LOOKS[status].label,
    mark: { status },
  })),
  { label: 'Köşedeki nokta: mesai', mark: { status: 'PRESENT', overtimeHours: 2 } },
]
</script>

<template>
  <!-- el-space satır içi bir kutudur, genişliği verilir. "fill" yok: kutuyu çok satırlı yapıp her satırı içeriği
       kadar genişletiyor, ayın cetveli sayfadan taşıyordu. -->
  <el-space direction="vertical" alignment="stretch" :size="20" style="width: 100%">
    <el-row justify="space-between" align="middle">
      <el-space :size="32" wrap>
        <MonthNav :month="month" @change="setMonth" />
        <el-space :size="16" wrap>
          <el-space v-for="item in LEGEND" :key="item.label" :size="6">
            <MarkDot :mark="item.mark" />
            <el-text size="small">{{ item.label }}</el-text>
          </el-space>
        </el-space>
      </el-space>
      <el-button v-if="canExport" tag="a" :href="exportUrl" type="primary" :icon="Download">Excel indir</el-button>
    </el-row>
    <el-skeleton v-if="isPending" :rows="8" animated />
    <RosterEmpty v-else-if="isEmpty" />
    <template v-else>
      <RosterSection v-if="book.people.length" title="Personel" :count="shown.people.length">
        <MonthTable :rows="shown.people" :days="days" kind="PERSON" :focus-day="focusDay"
          @open="(id, day) => emit('open', id, day)" />
      </RosterSection>
      <RosterSection v-if="book.crews.length" title="Taşeron ekipler" :count="shown.crews.length">
        <MonthTable :rows="shown.crews" :days="days" kind="CREW" :focus-day="focusDay"
          @open="(id, day) => emit('open', id, day)" />
      </RosterSection>
    </template>
  </el-space>
</template>
