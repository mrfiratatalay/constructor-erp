import { http } from '@/core/api/http'

/**
 * Demo derlemesinde açılışta bir kez çağrılır: axios'un ağ katmanı yerine tarayıcıdaki sahte backend geçer. Sahte
 * backend ve örnek veri ayrı bir parçadır; yalnızca demo açılınca indirilir.
 */
export async function installDemo(): Promise<void> {
  const [{ demoAdapter }, { setSeeder }, { seedDatabase }] = await Promise.all([
    import('@/core/demo/server/demoAdapter'),
    import('@/core/demo/server/demoDb'),
    import('@/core/demo/server/seed/seedDatabase'),
  ])
  setSeeder(seedDatabase)
  http.defaults.adapter = demoAdapter
}
