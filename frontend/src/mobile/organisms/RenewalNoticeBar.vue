<script setup lang="ts">
import { computed } from 'vue'
import { useCurrentUser } from '@/core/auth/currentUser'
import { renewalNotice } from '@/core/tenant/renewalNotice'
import { useWorkspace } from '@/core/tenant/useWorkspace'

/** Patrona, aboneliğin bitmesine az kala listenin üstünde duran uyarı; dokununca Firma sayfası açılır. */
const { access } = useWorkspace()
const { data: user } = useCurrentUser()
const text = computed(() => renewalNotice(access.value, user.value?.role))
</script>

<template>
  <van-notice-bar v-if="text" :text="text" mode="link" wrapable left-icon="warning-o"
    class="renewal-bar" @click="$router.push({ name: 'company' })" />
</template>

<style scoped>
.renewal-bar {
  border-radius: var(--radius-md);
}
</style>
