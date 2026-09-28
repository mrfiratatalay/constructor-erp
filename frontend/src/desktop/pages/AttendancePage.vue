<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, UserPlus } from 'lucide-vue-next'
import type { RosterEntryView } from '@/core/api/generated/model'
import { dayTitle, todayIsoDate } from '@/core/format/dates'
import { useDayParam } from '@/core/puantaj/useDayParam'
import { usePuantajTab, type PuantajTab } from '@/core/puantaj/usePuantajTab'
import EntryDrawer from '@/desktop/organisms/EntryDrawer.vue'
import MonthBoard from '@/desktop/organisms/MonthBoard.vue'
import RosterEntryDialog from '@/desktop/organisms/RosterEntryDialog.vue'
import TodayBoard from '@/desktop/organisms/TodayBoard.vue'

/**
 * Yoklama (patron ve şef): firmanın puantajı, şantiyeye bağlı değil. Bugün sekmesi şefin sabahı, Puantaj sekmesi
 * ay sonunun cetveli. Başlıkta arama (iki sekme de süzer) ve kişi ya da ekip ekleme. Bir ada tıklayınca o kişinin ya
 * da ekibin ayı sağdan açılır (adres: /yoklama/kisi/…).
 */
const route = useRoute()
const router = useRouter()
const { tab, setTab } = usePuantajTab()
const entryId = computed(() => (route.params.entryId ? String(route.params.entryId) : null))
const query = ref('')
const SEARCH_WIDTH = { width: '280px' }
const formOpen = ref(false)
const editing = ref<RosterEntryView | null>(null)

const { day, queryWith } = useDayParam()
const openEntry = (id: string, pick?: string) =>
  router.replace({ name: 'memberAttendance', params: { entryId: id }, query: queryWith(pick ?? null) })
const closeEntry = () => router.replace({ name: 'attendance', query: queryWith(null) })

function openForm(entry: RosterEntryView | null) {
  editing.value = entry
  formOpen.value = true
}
</script>

<template>
  <el-scrollbar>
    <el-main>
      <el-row justify="space-between" align="middle">
        <h1>Yoklama <el-text type="info" size="large">· {{ dayTitle(todayIsoDate()) }}</el-text></h1>
        <el-space :size="12">
          <el-input v-model="query" :style="SEARCH_WIDTH" placeholder="Ad, görev ya da ekip ara" clearable
            :prefix-icon="Search" />
          <el-button type="primary" :icon="UserPlus" @click="openForm(null)">Kişi ya da ekip ekle</el-button>
        </el-space>
      </el-row>
      <el-tabs :model-value="tab" @tab-change="(name) => setTab(name as PuantajTab)">
        <el-tab-pane label="Bugün" name="today">
          <TodayBoard :query="query" @open="openEntry" />
        </el-tab-pane>
        <el-tab-pane label="Puantaj" name="month" lazy>
          <MonthBoard :query="query" @open="openEntry" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-scrollbar>
  <EntryDrawer :entry-id="entryId" :day="day" @close="closeEntry" @edit="openForm" />
  <RosterEntryDialog v-model:show="formOpen" :entry="editing" />
</template>
