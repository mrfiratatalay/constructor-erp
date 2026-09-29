<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCurrentUser } from '@/core/auth/currentUser'
import { renewalNotice } from '@/core/tenant/renewalNotice'
import { useWorkspace } from '@/core/tenant/useWorkspace'

/** Patrona, aboneliğin bitmesine az kala köşede duran uyarı. Kapatılırsa o oturumda bir daha çıkmaz. */
const { access } = useWorkspace()
const { data: user } = useCurrentUser()
const dismissed = ref(false)
const text = computed(() => (dismissed.value ? null : renewalNotice(access.value, user.value?.role)))
</script>

<template>
  <el-alert v-if="text" class="renewal-banner" type="warning" :title="text" show-icon effect="dark"
    close-text="Tamam" @close="dismissed = true">
    <RouterLink :to="{ name: 'company' }" class="renewal-banner__link">Aboneliği gör</RouterLink>
  </el-alert>
</template>

<style scoped>
.renewal-banner {
  position: fixed;
  right: var(--space-5);
  bottom: var(--space-5);
  z-index: 30;
  width: min(420px, calc(100vw - 2 * var(--space-5)));
  box-shadow: var(--shadow-lg);
}

.renewal-banner__link {
  color: inherit;
  font-weight: var(--weight-bold);
}
</style>
