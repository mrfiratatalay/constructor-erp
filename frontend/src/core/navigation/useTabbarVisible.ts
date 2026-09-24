import { computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Mobilde alt sekmeler şantiyenin içinde gizlenir (WhatsApp'ta sohbetin içi gibi): gönderme çubuğuyla üst üste
 * ekranın %15'ini yiyordu. Tek şantiyesi olan şef de önce listeyi görür, bu yüzden kural herkes için aynı.
 */
export function useTabbarVisible() {
  const route = useRoute()
  return computed(() => !route.meta.public && !route.meta.detail)
}
