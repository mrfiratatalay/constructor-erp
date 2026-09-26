<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { errorMessage } from '@/core/api/errors'
import type { MemberDayView } from '@/core/api/generated/model'
import { dayTitle } from '@/core/format/dates'
import type { MarkChoice } from '@/core/rollcall/rollCallLabels'
import { rowDetail } from '@/core/rollcall/todayRoll'
import { useTodayRoll } from '@/core/rollcall/useTodayRoll'
import ExcelExport from '@/desktop/molecules/ExcelExport.vue'
import ListHeader from '@/desktop/molecules/ListHeader.vue'
import MarkDropdown from '@/desktop/molecules/MarkDropdown.vue'
import RollMemberRow from '@/desktop/molecules/RollMemberRow.vue'
import MemberCalendarPanel from '@/desktop/organisms/MemberCalendarPanel.vue'
import SplitView from '@/desktop/templates/SplitView.vue'

/**
 * Yoklama (yalnızca patron), Şantiyeler ekranıyla aynı kalıp: solda bugünün listesi, sağda seçili kişinin
 * takvimi. Menüden girince doğrudan bugün açılır. Bölümler iş bekleyenden başlar: Katılmayanlar (işaretle),
 * Gelmeyenler, Gelenler (saat · şantiye). Başlıktaki Excel ayın dosyasını indirir. Çalışanlar sohbetteki
 * yoklama mesajından kendileri katılır.
 */
const route = useRoute()
const roll = useTodayRoll()
const { sections, summary, isEmpty, isPending } = roll
const selectedId = computed(() => (route.params.userId ? String(route.params.userId) : null))
const groups = computed(() =>
  [
    { key: 'missing', title: 'Katılmayanlar', members: sections.value.missing },
    { key: 'absent', title: 'Gelmeyenler', members: sections.value.absent },
    { key: 'present', title: 'Gelenler', members: sections.value.present },
  ].filter((group) => group.members.length),
)

async function mark(member: MemberDayView, choice: MarkChoice) {
  try {
    await roll.mark(member.member.id, choice)
  } catch (error) {
    ElMessage.error(errorMessage(error))
  }
}
</script>

<template>
  <SplitView>
    <template #list-header>
      <ListHeader title="Yoklama" :meta="dayTitle(roll.day)">
        <template #action><ExcelExport /></template>
        <p v-if="summary" class="attendance-page__summary">{{ summary }}</p>
      </ListHeader>
    </template>
    <template #list>
      <el-skeleton v-if="isPending" :rows="6" animated class="attendance-page__skeleton" />
      <el-empty v-else-if="isEmpty" :image-size="72"
        description="Firmada henüz çalışan yok. Kişi ekle bağlantısıyla katılanlar burada görünür." />
      <section v-for="group in groups" :key="group.key" :data-testid="`roll-${group.key}`">
        <h2 class="attendance-page__group">{{ group.title }} {{ group.members.length }}</h2>
        <RollMemberRow v-for="row in group.members" :key="row.member.id"
          :to="{ name: 'memberAttendance', params: { userId: row.member.id } }" :selected="row.member.id === selectedId">
          <template #title>{{ row.member.fullName }}</template>
          <template v-if="rowDetail(row.record)">{{ rowDetail(row.record) }}</template>
          <template #action>
            <MarkDropdown :record="row.record" @choose="(choice) => mark(row, choice)" />
          </template>
        </RollMemberRow>
      </section>
    </template>
    <template #detail>
      <MemberCalendarPanel v-if="selectedId" :key="selectedId" :user-id="selectedId" />
      <el-empty v-else class="attendance-page__hint" :image-size="80"
        description="Bir kişiye tıklayınca takvimi burada açılır: geldiği günler yeşil, gelmediği kırmızı, izinli sarı." />
    </template>
  </SplitView>
</template>

<style scoped>
.attendance-page__summary {
  margin: var(--space-1) 0 0;
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.attendance-page__skeleton {
  padding: var(--space-4);
}

.attendance-page__group {
  margin: 0;
  padding: var(--space-4) var(--space-4) var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.attendance-page__hint {
  height: 100%;
}
</style>
