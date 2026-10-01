import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/** Saha kartından açılan hareket ve tarayıcının geri düğmesi aynı ayrıntıyı seçer. */
export function useMovementSelection() {
  const route = useRoute()
  const router = useRouter()
  return computed<string | null>({
    get: () => typeof route.query.hareket === 'string' ? route.query.hareket : null,
    set: (id) => {
      const query = { ...route.query }
      if (id) query.hareket = id
      else delete query.hareket
      void router.replace({ query })
    },
  })
}
