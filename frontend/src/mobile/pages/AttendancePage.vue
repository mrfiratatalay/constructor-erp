<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserPlus } from 'lucide-vue-next'
import { dayTitle, todayIsoDate } from '@/core/format/dates'
import { usePuantajTab } from '@/core/puantaj/usePuantajTab'
import PuantajTabs from '@/mobile/molecules/PuantajTabs.vue'
import MonthPanel from '@/mobile/organisms/MonthPanel.vue'
import RosterEntrySheet from '@/mobile/organisms/RosterEntrySheet.vue'
import TodayPanel from '@/mobile/organisms/TodayPanel.vue'
import MobilePage from '@/mobile/templates/MobilePage.vue'

/**
 * Yoklama sekmesi (patron ve şef): firmanın puantajı, şantiyeye bağlı değil. Başlığın altında sabit Bugün ve Puantaj
 * sekmeleri: Bugün şefin sabahı ("Seç" ile toplu işaretleme), Puantaj ay sonunun özeti. ＋ uygulaması olmayan kişiyi
 * ya da taşeron ekibi listeye ekler. Bir ada dokununca o kişinin ya da ekibin ayı açılır.
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
      <van-space :size="8" align="center">
        <van-button v-if="tab === 'today'" size="small" round plain type="primary" @click="selecting = !selecting">
          {{ selecting ? 'Bitti' : 'Seç' }}
        </van-button>
        <!-- İkon lucide'den: Vant'ın başlık çubuğu kendi ikonlarını ana renge boyar, dolu düğmede ikon kayboluyordu. -->
        <van-button type="primary" size="small" round aria-label="Kişi ya da ekip ekle" @click="formOpen = true">
          <UserPlus :size="18" />
        </van-button>
      </van-space>
    </template>
    <template #subbar><PuantajTabs :active="tab" @change="setTab" /></template>
    <TodayPanel v-if="tab === 'today'" :selecting="selecting" @open="openEntry" @done="selecting = false" />
    <MonthPanel v-else @open="openEntry" />
    <RosterEntrySheet v-model:show="formOpen" />
  </MobilePage>
</template>
