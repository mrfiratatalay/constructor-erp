<script setup lang="ts">
import { computed, ref } from 'vue'
import { showFailToast, showSuccessToast } from 'vant'
import { ClipboardCheck } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { CreateWorkerRequest } from '@/core/api/generated/model'
import { countsLine } from '@/core/attendance/attendanceSummary'
import { QUICK_CHOICES, type QuickChoice, type RollRow } from '@/core/attendance/dailyRoll'
import { useDailyAttendance } from '@/core/attendance/useDailyAttendance'
import { useRecentDays } from '@/core/attendance/useRecentDays'
import { dayTitle } from '@/core/format/dates'
import DailyRollGroup from '@/mobile/organisms/DailyRollGroup.vue'
import RecentDaysList from '@/mobile/organisms/RecentDaysList.vue'
import WorkerFormPopup from '@/mobile/organisms/WorkerFormPopup.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Alt sekmedeki Yoklama: her şey tek ekranda, başka sayfaya gidilmez. Üstte "2 geldi · 1 gelmedi · 0 izinli";
 * "Bugün" listesinde herkes durumuyla (dokununca alttan küçük seçim: Geldi · Hastalık · İzinli · Habersiz · Diğer;
 * şantiye seçilmez); altında "Geçmiş": son günler, güne dokununca o günün listesi aynı yerde açılır.
 */
const daily = useDailyAttendance()
const { rows, ordered, counts, sites, isLoading, isSaving, isSaved } = daily
const { days, openDay, openRows, isOpening, toggle } = useRecentDays()
const choosing = ref<RollRow | null>(null)
const adding = ref(false)
/** Listede birden çok şantiyenin personeli varsa kişinin şantiyesi satırda yazar; tek şantiyede gürültüdür. */
const showSite = computed(() => new Set(rows.value.map((row) => row.siteId)).size > 1)
const CHOICE_ACTIONS = QUICK_CHOICES.map((choice) => ({ name: choice.label, key: choice.value }))

function choose(action: { key: QuickChoice }) {
  if (choosing.value) daily.mark(choosing.value, action.key)
  choosing.value = null
}

async function attempt(action: () => Promise<unknown>) {
  try {
    await action()
    return true
  } catch (error) {
    showFailToast(errorMessage(error))
    return false
  }
}

async function addWorker(form: CreateWorkerRequest, siteId: string | null) {
  const target = siteId ?? sites.value[0]?.id
  if (target && (await attempt(() => daily.addWorker(target, form)))) adding.value = false
}

async function save() {
  if (await attempt(daily.save)) showSuccessToast('Kaydedildi')
}
</script>

<template>
  <MobilePage title="Yoklama" :subtitle="dayTitle(daily.day)">
    <p v-if="rows.length" class="daily__summary">{{ countsLine(counts) }}</p>
    <van-skeleton v-if="isLoading" :row="6" />
    <template v-else>
      <DailyRollGroup v-if="rows.length" title="Bugün" :rows="ordered" :show-site="showSite"
        @choose="choosing = $event" />
      <van-empty v-if="!rows.length" :description="sites.length ? 'Henüz personel yok. Aşağıdan ekle.' : 'Aktif şantiye yok.'">
        <template #image><ClipboardCheck :size="48" class="daily__empty-icon" /></template>
      </van-empty>
      <van-button v-if="sites.length" round block plain type="primary" @click="adding = true">＋ Personel ekle</van-button>
      <RecentDaysList :days="days" :open-day="openDay" :open-rows="openRows" :opening="isOpening" @toggle="toggle" />
    </template>
    <template v-if="rows.length" #footer>
      <van-button type="primary" round block :loading="isSaving" :disabled="isSaved" @click="save">
        {{ isSaved ? '✓ Kaydedildi' : 'Yoklamayı Kaydet' }}
      </van-button>
    </template>
    <van-action-sheet :show="choosing !== null" :actions="CHOICE_ACTIONS" :description="choosing?.worker.fullName"
      cancel-text="Vazgeç" teleport="body" @select="choose"
      @update:show="(shown: boolean) => !shown && (choosing = null)" />
    <WorkerFormPopup v-model:show="adding" :saving="isSaving" :sites="sites" @submit="addWorker" />
  </MobilePage>
</template>

<style scoped>
.daily__summary {
  margin: 0;
  color: var(--text-strong);
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  text-align: center;
}

.daily__empty-icon {
  color: var(--text-subtle);
}
</style>
