<script setup lang="ts">
import { computed } from 'vue'
import { ChevronsUpDown } from 'lucide-vue-next'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

const { name, roleLabel, expanded, active } = defineProps<{
  name: string; roleLabel: string; expanded: boolean; active: boolean
}>()
const secondaryLabel = computed(() => {
  const label = roleLabel.trim()
  return !label || name.trim().toLocaleLowerCase('tr') === label.toLocaleLowerCase('tr') ? 'Hesabım' : label
})
</script>

<template>
  <button type="button" class="side-nav-account"
    :class="{ 'side-nav-account--expanded': expanded, 'side-nav-account--active': active }"
    :aria-label="`Hesabım: ${name}`" :aria-expanded="active">
    <UserAvatar :name="name" :size="32" />
    <template v-if="expanded">
      <span class="side-nav-account__identity">
        <strong>{{ name }}</strong>
        <small>{{ secondaryLabel }}</small>
      </span>
      <ChevronsUpDown :size="14" :stroke-width="1.75" class="side-nav-account__chevron" aria-hidden="true" />
    </template>
  </button>
</template>

<style scoped>
.side-nav-account {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  min-height: 44px;
  padding: 5px;
  border: 1px solid rgb(255 255 255 / 10%);
  border-radius: 12px;
  color: var(--brand-on-deep);
  background: rgb(255 255 255 / 4%);
  font: inherit;
  cursor: pointer;
  appearance: none;
  transition: background 150ms ease, border-color 150ms ease;
}
.side-nav-account:hover,
.side-nav-account--active { background: rgb(255 255 255 / 9%); }
.side-nav-account:focus-visible { outline: 2px solid var(--brand-signature); outline-offset: 3px; }
.side-nav-account--expanded {
  justify-content: flex-start;
  width: 100%;
  height: auto;
  min-height: 56px;
  padding: 8px;
  gap: 10px;
}
.side-nav-account__identity { display: grid; flex: 1; min-width: 0; gap: 3px; text-align: left; }
.side-nav-account__identity strong,
.side-nav-account__identity small { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 1.35; }
.side-nav-account__identity strong { color: var(--brand-on-deep); font-size: 13px; font-weight: var(--weight-semibold); }
.side-nav-account__identity small { color: rgb(255 255 255 / 64%); font-size: 12px; font-weight: 400; }
.side-nav-account__chevron { flex: none; color: rgb(255 255 255 / 64%); }
</style>
