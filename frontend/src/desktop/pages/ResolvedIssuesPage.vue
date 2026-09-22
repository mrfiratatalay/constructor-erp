<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import { useIssues } from '@/core/issues/useIssues'
import ListHeader from '@/desktop/molecules/ListHeader.vue'
import IssueDetail from '@/desktop/organisms/IssueDetail.vue'
import IssueList from '@/desktop/organisms/IssueList.vue'
import SplitView from '@/desktop/templates/SplitView.vue'

/**
 * Geçmiş kayıt, günlük iş değil: Sorunlar'ın altından açılır, aynı düzende. Sağda kim, ne zaman,
 * nasıl çözdü yazar.
 */
const { issues, isLoading } = useIssues(false, undefined)
const chosenId = ref<string | null>(null)
const selected = computed(
  () => issues.value?.find((issue) => issue.id === chosenId.value) ?? issues.value?.[0] ?? null,
)
</script>

<template>
  <SplitView>
    <template #list-header>
      <ListHeader title="Çözülenler" :meta="issues ? `son ${issues.length}` : undefined">
        <RouterLink :to="{ name: 'issues' }" class="resolved__back">
          <ArrowLeft :size="15" /> Açık sorunlar
        </RouterLink>
      </ListHeader>
    </template>
    <template #list>
      <el-skeleton v-if="isLoading" :rows="5" animated class="resolved__skeleton" />
      <IssueList v-else :issues="issues ?? []" :selected-id="selected?.id ?? null" resolved
        @select="chosenId = $event" />
    </template>
    <template #detail>
      <IssueDetail v-if="selected" :key="selected.id" :post="selected" />
      <el-empty v-else-if="!isLoading" description="Henüz çözülen sorun yok." class="resolved__empty" />
    </template>
  </SplitView>
</template>

<style scoped>
.resolved__back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}

.resolved__skeleton {
  padding: var(--space-4);
}

.resolved__empty {
  margin: auto;
}
</style>
