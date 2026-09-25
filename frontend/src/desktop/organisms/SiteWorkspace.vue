<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { EllipsisVertical, Search } from 'lucide-vue-next'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { fullDate, todayIsoDate } from '@/core/format/dates'
import { useComposer } from '@/core/posts/useComposer'
import { callablePeople, participantLine } from '@/core/sites/participants'
import { useSiteTab } from '@/core/sites/useSiteTab'
import { useSiteVisit } from '@/core/visits/useSiteVisit'
import CallPopover from '@/desktop/molecules/CallPopover.vue'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import SiteTabs from '@/desktop/molecules/SiteTabs.vue'
import AttendanceDialog from '@/desktop/organisms/AttendanceDialog.vue'
import FeedColumn from '@/desktop/organisms/FeedColumn.vue'
import FieldColumn from '@/desktop/organisms/FieldColumn.vue'
import FieldComposerBar from '@/desktop/organisms/FieldComposerBar.vue'
import SiteComposerBar from '@/desktop/organisms/SiteComposerBar.vue'
import SiteInfoPanel from '@/desktop/organisms/SiteInfoPanel.vue'
import SiteSearchPanel from '@/desktop/organisms/SiteSearchPanel.vue'
import UploadQueueList from '@/desktop/organisms/UploadQueueList.vue'
import SiteHeading from '@/shared/molecules/SiteHeading.vue'

/**
 * Seçili şantiye, WhatsApp Masaüstü'ndeki sohbet gibi: başlıkta fotoğraf, ad ve "Musa, Sen" (tıklayınca bilgi),
 * sağda 🔍 (Bu şantiyede ara; masaüstünde yer bol, gizlenmez), 📞 (kim hangi numarada) ve ⋮ (Şantiye bilgisi,
 * Bu şantiyede ara). Bilgi ve arama akışın sağında panel olarak açılır.
 * Başlığın altında iki sekme: Sohbet ve Saha (günlük). İki sekmenin taslağı ayrıdır: sohbete yazılan yarım mesaj
 * Saha'ya geçince kaybolmaz. Açılınca şantiye okunmuş sayılır; önceki bakıştan sonra gelenler çizgiyle ayrılır.
 * Sohbetin ＋ menüsündeki Yoklama bugünün yoklama penceresini açar; yoklama sohbete mesaj olarak gitmez.
 */
type Panel = 'info' | 'search'

const { siteId } = defineProps<{ siteId: string }>()
const router = useRouter()
const { data: site } = useGetSite(() => siteId)
const { data: user } = useCurrentUser()
const { previousSeenAt } = useSiteVisit(() => siteId)
const { tab, open: openTab } = useSiteTab()
const target = () => (site.value ? { id: site.value.id, name: site.value.name } : undefined)
const composer = useComposer(target)
const fieldComposer = useComposer(target, { fieldUpdate: true })
const panel = ref<Panel | null>(null)
const callable = computed(() => (site.value ? callablePeople(site.value, user.value) : []))

const toggle = (which: Panel) => (panel.value = panel.value === which ? null : which)
/** Aramada bulunan mesaja sohbette gidilir: akış adresteki ?mesaj=… ile o mesajı bulur. */
const openFound = (postId: string) => openTab('chat', postId)
const attendanceOpen = ref(false)

/** Yoklama sohbete gitmez; kaydedilince kayıtlara gitmek isteğe bağlıdır (Yoklama modülü). */
async function onAttendanceSaved(day: string) {
  const wantsHistory = await ElMessageBox.confirm(`${fullDate(day)} tarihli yoklama kaydedildi.`, 'Yoklama kaydedildi', {
    confirmButtonText: 'Yoklama kayıtlarını görüntüle', cancelButtonText: 'Kapat', type: 'success',
  }).then(() => true, () => false)
  if (wantsHistory) void router.push({ name: 'siteAttendance', params: { siteId } })
}
</script>

<template>
  <div class="workspace">
    <DetailPane :bottom="tab === 'chat'" class="workspace__main">
      <template #header>
        <div class="workspace__head">
          <SiteHeading v-if="site" :site="site" :line="participantLine(site, user)" class="workspace__title"
            @open="toggle('info')" />
          <el-tooltip content="Bu şantiyede ara" placement="bottom">
            <el-button circle aria-label="Bu şantiyede ara" @click="toggle('search')"><Search :size="17" /></el-button>
          </el-tooltip>
          <CallPopover :people="callable" />
          <el-dropdown trigger="click" @command="toggle">
            <el-button circle aria-label="Diğer"><EllipsisVertical :size="18" /></el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="info">Şantiye bilgisi</el-dropdown-item>
                <el-dropdown-item command="search">Bu şantiyede ara</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
      <template #tabs><SiteTabs :active="tab" @change="openTab" /></template>
      <UploadQueueList />
      <FeedColumn v-if="tab === 'chat'" :site-id="siteId" :seen-at="previousSeenAt"
        @reply="composer.replyTo.value = $event" />
      <FieldColumn v-else-if="site" :site="site" />
      <template v-if="site" #footer>
        <SiteComposerBar v-if="tab === 'chat'" :composer="composer" :site-name="site.name"
          @attendance="attendanceOpen = true" />
        <FieldComposerBar v-else :composer="fieldComposer" />
      </template>
    </DetailPane>
    <SiteInfoPanel v-if="site && panel === 'info'" :site="site" @close="panel = null" />
    <SiteSearchPanel v-else-if="panel === 'search'" :site-id="siteId" @open="openFound" @close="panel = null" />
    <AttendanceDialog v-if="site" v-model:show="attendanceOpen" :site-id="siteId" :site-name="site.name"
      :day="todayIsoDate()" @saved="onAttendanceSaved" />
  </div>
</template>

<style scoped>
.workspace {
  display: flex;
  height: 100%;
  min-height: 0;
}

.workspace__main {
  flex: 1;
  min-width: 0;
}

.workspace__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.workspace__title {
  flex: 1;
}

/* Element Plus yan yana düğmelere sol boşluk verir; aralığı gap tek başına belirlesin. */
.workspace__head :deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
