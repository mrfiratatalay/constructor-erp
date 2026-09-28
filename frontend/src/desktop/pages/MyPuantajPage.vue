<script setup lang="ts">
import { monthTitle } from '@/core/format/dates'
import { useCalendarDay } from '@/core/puantaj/useCalendarDay'
import { useMyPuantaj } from '@/core/puantaj/useMyPuantaj'
import EntryCalendar from '@/desktop/molecules/EntryCalendar.vue'
import EntryTotals from '@/desktop/molecules/EntryTotals.vue'
import MyDayCard from '@/desktop/molecules/MyDayCard.vue'

/**
 * Puantajım (çalışanın menüsü): ayın toplamları, takvim ve seçili günün kaydı. Kaydını her gün görür; yanlış bir
 * gün varsa işaretleyeni arar. Yalnızca kendi kaydı; başkasınınki, şefin notu ve tutar görünmez.
 */
const { month, setMonth, today, days, totals, counted, isPending } = useMyPuantaj()
const { selectedDay, calendarDate } = useCalendarDay(month, setMonth, today)
</script>

<template>
  <el-scrollbar>
    <el-main>
      <h1>Puantajım <el-text type="info" size="large">· {{ monthTitle(`${month}-01`) }}</el-text></h1>
      <el-skeleton v-if="isPending" :rows="8" animated />
      <el-empty v-else-if="!counted" :image-size="72" description="Patron ve şef yoklamada sayılmaz." />
      <template v-else>
        <EntryTotals :totals="totals" kind="PERSON" />
        <el-divider />
        <el-row :gutter="24">
          <el-col :span="15">
            <EntryCalendar v-model="calendarDate" :marks="days" />
          </el-col>
          <el-col :span="9">
            <MyDayCard v-if="selectedDay <= today" :day="selectedDay" :mark="days[selectedDay]" />
            <el-empty v-else :image-size="60" description="İleri bir gün; henüz kaydı yok." />
          </el-col>
        </el-row>
      </template>
    </el-main>
  </el-scrollbar>
</template>
