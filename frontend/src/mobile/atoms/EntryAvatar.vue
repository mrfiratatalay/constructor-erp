<script setup lang="ts">
import type { RosterEntryView } from '@/core/api/generated/model'
import { entryTitle } from '@/core/puantaj/puantajLabels'
import UserAvatar from '@/shared/atoms/UserAvatar.vue'

/**
 * Satırın başındaki baş harf avatarı: kişide adı ("AY"), ekipte iş kolu ("DE"); masaüstü satırıyla aynı. Hücrenin
 * ikon yerine konur; adla arasındaki boşluğu hücre verir (mobile/cellLayout).
 */
const { entry } = defineProps<{ entry: RosterEntryView }>()
</script>

<template>
  <UserAvatar :name="entryTitle(entry)" :size="40" />
</template>
