<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { EllipsisVertical, Phone } from 'lucide-vue-next'
import { useGetSite } from '@/core/api/generated/sites/sites'
import { useCurrentUser } from '@/core/auth/currentUser'
import { fullDate, todayIsoDate } from '@/core/format/dates'
import { firstName } from '@/core/format/names'
import { telHref } from '@/core/format/phone'
import { useComposer } from '@/core/posts/useComposer'
import { firstCallable, participantLine } from '@/core/sites/participants'
import { useSiteVisit } from '@/core/visits/useSiteVisit'
import DetailPane from '@/desktop/molecules/DetailPane.vue'
import AttendanceDialog from '@/desktop/organisms/AttendanceDialog.vue'
import FeedColumn from '@/desktop/organisms/FeedColumn.vue'
import SiteComposerBar from '@/desktop/organisms/SiteComposerBar.vue'
import SiteInfoPanel from '@/desktop/organisms/SiteInfoPanel.vue'
import SiteSearchPanel from '@/desktop/organisms/SiteSearchPanel.vue'
import SiteStartBlock from '@/desktop/organisms/SiteStartBlock.vue'
import UploadQueueList from '@/desktop/organisms/UploadQueueList.vue'
import SiteHeading from '@/shared/molecules/SiteHeading.vue'

/**
 * Seçili şantiye, WhatsApp Masaüstü'ndeki sohbet gibi: başlıkta fotoğraf, ad ve "Musa, Sen" (tıklayınca bilgi),
 * sağda 📞 ve ⋮ (Şantiye bilgisi, Bu şantiyede ara). Bilgi ve arama akışın sağında panel olarak açılır.
 * Açılınca şantiye okunmuş sayılır; önceki bakıştan sonra gelenler çizgiyle ayrılır.
 */
type Panel = 'info' | 'search'

const { siteId } = defineProps<{ siteId: string }>()
const router = useRouter()
const { data: site } = useGetSite(() => siteId)
const { data: user } = useCurrentUser()
const { previousSeenAt } = useSiteVisit(() => siteId)
const composer = useComposer(() => (site.value ? { id: site.value.id, name: site.value.name } : undefined))
const panel = ref<Panel | null>(null)
const callable = computed(() => (site.value ? firstCallable(site.value, user.value) : null))

const toggle = (which: Panel) => (panel.value = panel.value === which ? null : which)
/** Aramada bulunan mesaja gidilir: akış adresteki ?mesaj=… ile o mesajı bulur. */
const openFound = (postId: string) => router.replace({ query: { mesaj: postId } })
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
    <DetailPane bottom class="workspace__main">
      <template #header>
        <div class="workspace__head">
          <SiteHeading v-if="site" :site="site" :line="participantLine(site, user)" class="workspace__title"
            @open="toggle('info')" />
          <el-button v-if="callable" tag="a" :href="telHref(callable.phone!)" class="workspace__call">
            <Phone :size="15" class="workspace__icon" />{{ firstName(callable.fullName) }}
          </el-button>
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
      <UploadQueueList />
      <FeedColumn :site-id="siteId" :seen-at="previousSeenAt" @reply="composer.replyTo.value = $event">
        <template #start="{ empty }">
          <SiteStartBlock v-if="site" :site="site" :empty="empty" :can-invite="user?.role === 'OWNER'" />
        </template>
      </FeedColumn>
      <template v-if="site" #footer>
        <SiteComposerBar :composer="composer" :site-name="site.name" @attendance="attendanceOpen = true" />
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

.workspace__icon {
  margin-right: 6px;
}

.workspace__call {
  text-decoration: none;
}
</style>
