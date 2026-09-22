<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PostView } from '@/core/api/generated/model'
import { nextIssueId } from '@/core/issues/nextIssue'
import { lastResolvedText, NO_OPEN_ISSUES, resolvedLinkText } from '@/core/issues/resolvedSummary'
import { useIssues } from '@/core/issues/useIssues'
import ListHeader from '@/desktop/molecules/ListHeader.vue'
import IssueDetail from '@/desktop/organisms/IssueDetail.vue'
import IssueList from '@/desktop/organisms/IssueList.vue'
import SplitView from '@/desktop/templates/SplitView.vue'

/**
 * Sorunlar bir iş kuyruğu (e-posta kutusu gibi): solda en uzun bekleyen en üstte, sağda seçili sorun.
 * Açılışta en eskisi seçili gelir (seçmek yan etki yaratmaz); "Çözüldü" deyince sıradaki açılır.
 */
const { issues, isLoading } = useIssues(true, undefined)
const { issues: resolved } = useIssues(false, undefined)
const chosenId = ref<string | null>(null)

const selected = computed(
  () => issues.value?.find((issue) => issue.id === chosenId.value) ?? issues.value?.[0] ?? null,
)

function onResolved(post: PostView) {
  chosenId.value = nextIssueId(issues.value ?? [], post.id)
}
</script>

<template>
  <SplitView>
    <template #list-header>
      <ListHeader title="Sorunlar" :meta="issues ? `${issues.length} açık` : undefined" />
    </template>
    <template #list>
      <el-skeleton v-if="isLoading" :rows="5" animated class="issues__skeleton" />
      <IssueList v-else :issues="issues ?? []" :selected-id="selected?.id ?? null" @select="chosenId = $event" />
      <RouterLink v-if="resolved?.length" :to="{ name: 'resolvedIssues' }" class="issues__resolved">
        {{ resolvedLinkText(resolved) }} ›
      </RouterLink>
    </template>
    <template #detail>
      <IssueDetail v-if="selected" :key="selected.id" :post="selected" @resolved="onResolved" />
      <el-result v-else-if="!isLoading" icon="success" :title="NO_OPEN_ISSUES"
        :sub-title="lastResolvedText(resolved) ?? undefined" class="issues__done" />
    </template>
  </SplitView>
</template>

<style scoped>
.issues__skeleton {
  padding: var(--space-4);
}

.issues__resolved {
  display: block;
  padding: var(--space-4);
  color: var(--brand-primary);
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  text-decoration: none;
}

.issues__done {
  margin: auto;
}
</style>
