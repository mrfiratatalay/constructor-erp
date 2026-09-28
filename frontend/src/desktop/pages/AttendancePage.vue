<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { UserPlus } from 'lucide-vue-next'
import type { RosterEntryView } from '@/core/api/generated/model'
import { dayTitle, todayIsoDate } from '@/core/format/dates'
import { usePuantajTab, type PuantajTab } from '@/core/puantaj/usePuantajTab'
import EntryDrawer from '@/desktop/organisms/EntryDrawer.vue'
import MonthBoard from '@/desktop/organisms/MonthBoard.vue'
import RosterEntryDialog from '@/desktop/organisms/RosterEntryDialog.vue'
import TodayBoard from '@/desktop/organisms/TodayBoard.vue'

/**
 * Yoklama (patron ve şef): firmanın puantajı, şantiyeye bağlı değil. Bugün sekmesi şefin sabahı, Puantaj sekmesi
 * ay sonunun cetveli. Bir ada tıklayınca o kişinin ya da ekibin ayı sağdan açılır (adres: /yoklama/kisi/…).
 * Uygulaması olmayan kişi ya da taşeron ekip üstteki düğmeyle eklenir.
 */
const route = useRoute()
const router = useRouter()
const { tab, setTab } = usePuantajTab()
const entryId = computed(() => (route.params.entryId ? String(route.params.entryId) : null))
const formOpen = ref(false)
const editing = ref<RosterEntryView | null>(null)

const openEntry = (id: string) => router.replace({ name: 'memberAttendance', params: { entryId: id }, query: route.query })
const closeEntry = () => router.replace({ name: 'attendance', query: route.query })

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
        <el-button type="primary" :icon="UserPlus" @click="openForm(null)">Kişi ya da ekip ekle</el-button>
      </el-row>
      <el-tabs :model-value="tab" @tab-change="(name) => setTab(name as PuantajTab)">
        <el-tab-pane label="Bugün" name="today">
          <TodayBoard @open="openEntry" />
        </el-tab-pane>
        <el-tab-pane label="Puantaj" name="month" lazy>
          <MonthBoard @open="openEntry" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-scrollbar>
  <EntryDrawer :entry-id="entryId" @close="closeEntry" @edit="openForm" />
  <RosterEntryDialog v-model:show="formOpen" :entry="editing" />
</template>
