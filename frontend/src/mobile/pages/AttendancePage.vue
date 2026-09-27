<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dayTitle, todayIsoDate } from '@/core/format/dates'
import { usePuantajTab, type PuantajTab } from '@/core/puantaj/usePuantajTab'
import MonthPanel from '@/mobile/organisms/MonthPanel.vue'
import RosterEntrySheet from '@/mobile/organisms/RosterEntrySheet.vue'
import TodayPanel from '@/mobile/organisms/TodayPanel.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Yoklama sekmesi (patron ve şef): firmanın puantajı, şantiyeye bağlı değil. Bugün sekmesi şefin sabahı
 * ("Seç" ile toplu işaretleme), Puantaj sekmesi ay sonunun özeti. ＋ uygulaması olmayan kişiyi ya da taşeron
 * ekibi listeye ekler. Bir ada dokununca o kişinin ya da ekibin ayı açılır.
 */
const route = useRoute()
const router = useRouter()
const { tab, setTab } = usePuantajTab()
const selecting = ref(false)
const formOpen = ref(false)

watch(tab, () => (selecting.value = false))

const openEntry = (entryId: string) =>
  router.push({ name: 'memberAttendance', params: { entryId }, query: route.query })
</script>

<template>
  <MobilePage title="Yoklama" :subtitle="dayTitle(todayIsoDate())">
    <template #action>
      <van-space :size="8">
        <van-button v-if="tab === 'today'" size="small" round plain type="primary" @click="selecting = !selecting">
          {{ selecting ? 'Bitti' : 'Seç' }}
        </van-button>
        <van-button size="small" round type="primary" icon="plus" aria-label="Kişi ya da ekip ekle"
          @click="formOpen = true" />
      </van-space>
    </template>
    <van-tabs :active="tab" @update:active="(name: PuantajTab) => setTab(name)">
      <van-tab title="Bugün" name="today">
        <TodayPanel :selecting="selecting" @open="openEntry" @done="selecting = false" />
      </van-tab>
      <van-tab title="Puantaj" name="month">
        <MonthPanel @open="openEntry" />
      </van-tab>
    </van-tabs>
    <RosterEntrySheet v-model:show="formOpen" />
  </MobilePage>
</template>
