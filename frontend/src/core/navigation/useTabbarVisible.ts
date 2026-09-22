import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHasSiteList } from '@/core/sites/soleSite'

/**
 * Mobilde alt sekmeler detay sayfasında gizlenir: şantiye sayfasında gönderme çubuğuyla üst üste
 * ekranın %15'ini yiyordu. Tek şantiyeli sorumlu için o sayfa ana ekrandır; onda sekmeler kalır.
 */
export function useTabbarVisible() {
  const route = useRoute()
  const hasSiteList = useHasSiteList()
  return computed(() => !route.meta.public && !(route.meta.detail && hasSiteList.value))
}
