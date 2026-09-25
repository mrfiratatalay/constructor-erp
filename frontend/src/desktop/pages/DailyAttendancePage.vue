<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from 'lucide-vue-next'
import { errorMessage } from '@/core/api/errors'
import type { CreateWorkerRequest } from '@/core/api/generated/model'
import { countsLine } from '@/core/attendance/attendanceSummary'
import { useDailyAttendance } from '@/core/attendance/useDailyAttendance'
import { useRecentDays } from '@/core/attendance/useRecentDays'
import { dayTitle } from '@/core/format/dates'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import DailyRollGroup from '@/desktop/organisms/DailyRollGroup.vue'
import RecentDaysList from '@/desktop/organisms/RecentDaysList.vue'
import WorkerFormDialog from '@/desktop/organisms/WorkerFormDialog.vue'

/**
 * Yoklama (sol menü): her şey tek ekranda, başka sayfaya gidilmez. Üstte "2 geldi · 1 gelmedi · 0 izinli";
 * "Bugün" listesinde herkes durumuyla (kişiye tıklayınca küçük seçim, şantiye seçilmez); altında "Geçmiş": son
 * günler, güne tıklayınca o günün listesi aynı yerde açılır. "Yoklamayı Kaydet" bütün şantiyeleri tek seferde yazar.
 */
const daily = useDailyAttendance()
const { rows, ordered, counts, sites, isLoading, isSaving, isSaved } = daily
const { days, openDay, openRows, isOpening, toggle } = useRecentDays()
const adding = ref(false)
/** Listede birden çok şantiyenin personeli varsa kişinin şantiyesi satırda yazar; tek şantiyede gürültüdür. */
const showSite = computed(() => new Set(rows.value.map((row) => row.siteId)).size > 1)

async function attempt(action: () => Promise<unknown>) {
  try {
    await action()
    return true
  } catch (error) {
    ElMessage.error(errorMessage(error))
    return false
  }
}

async function addWorker(form: CreateWorkerRequest, siteId: string | null) {
  const target = siteId ?? sites.value[0]?.id
  if (target && (await attempt(() => daily.addWorker(target, form)))) adding.value = false
}

async function save() {
  if (await attempt(daily.save)) ElMessage.success('Yoklama kaydedildi.')
}
</script>

<template>
  <DetailPane>
    <template #header>
      <div class="daily__head">
        <span class="daily__title">
          <strong>Yoklama — {{ dayTitle(daily.day) }}</strong>
          <span v-if="rows.length">{{ countsLine(counts) }}</span>
        </span>
      </div>
    </template>
    <el-skeleton v-if="isLoading" :rows="6" animated />
    <template v-else>
      <DailyRollGroup v-if="rows.length" title="Bugün" :rows="ordered" :show-site="showSite" @mark="daily.mark" />
      <el-empty v-if="!rows.length" :image-size="72"
        :description="sites.length ? 'Henüz personel yok. Aşağıdan ekle.' : 'Aktif şantiye yok.'" />
      <el-button v-if="sites.length" plain class="daily__add" @click="adding = true">
        <Plus :size="16" /> Personel ekle
      </el-button>
      <RecentDaysList :days="days" :open-day="openDay" :open-rows="openRows" :opening="isOpening" @toggle="toggle" />
    </template>
    <template #footer>
      <el-button type="primary" size="large" class="daily__save" :loading="isSaving" :disabled="isSaved || !rows.length"
        @click="save">
        {{ isSaved ? '✓ Kaydedildi' : 'Yoklamayı Kaydet' }}
      </el-button>
    </template>
  </DetailPane>
  <WorkerFormDialog v-model:show="adding" :saving="isSaving" :sites="sites" @submit="addWorker" />
</template>

<style scoped>
.daily__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.daily__title {
  display: grid;
  flex: 1;
  min-width: 0;
}

.daily__title strong {
  font-size: var(--text-md);
  font-weight: var(--weight-black);
}

.daily__title span {
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.daily__add {
  gap: var(--space-1);
  justify-self: start;
}

.daily__save {
  width: 100%;
}
</style>
