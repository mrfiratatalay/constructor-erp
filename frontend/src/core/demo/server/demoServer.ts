import { saveDb } from './demoDb'
import { notFound } from './demoError'
import type { DemoRequest } from './demoRequest'
import { createRouter, type DemoRoute } from './demoRouter'
import { materialsRoutes } from './materials/materialRoutes'
import { authRoutes } from './people/authRoutes'
import { companyRoutes } from './people/companyRoutes'
import { demoRoutes } from './people/demoRoutes'
import { adminRoutes } from './platform/adminRoutes'
import { publicRoutes } from './platform/publicRoutes'
import { tenantRoutes } from './platform/tenantRoutes'
import { postRoutes } from './posts/postRoutes'
import { productionRoutes } from './production/productionRoutes'
import { puantajRoutes } from './puantaj/puantajRoutes'
import { siteRoutes } from './sites/siteRoutes'
import { todayRoutes } from './sites/todayRoutes'
import { taskRoutes } from './tasks/taskRoutes'

/** Sahte backend'in bütün uçları; adresler gerçek backend'dekilerin aynısı. */
const ROUTES: DemoRoute[] = [
  ...authRoutes,
  ...companyRoutes,
  ...demoRoutes,
  ...siteRoutes,
  ...todayRoutes,
  ...postRoutes,
  ...taskRoutes,
  ...puantajRoutes,
  ...materialsRoutes,
  ...productionRoutes,
  ...publicRoutes,
  ...tenantRoutes,
  ...adminRoutes,
]

const find = createRouter(ROUTES)

/**
 * İsteği karşılar. Yazan her istekten sonra veri tarayıcıya kaydedilir: sayfa yenilense de demo kaldığı yerden
 * sürer. Cevap kopyalanır; arayüz eline geçen nesneyi değiştirse bile demo verisi bozulmaz.
 */
export async function handle(method: string, path: string, request: Omit<DemoRequest, 'params'>): Promise<unknown> {
  const match = find(method, path)
  if (!match) throw notFound('Adres')
  const result = await match.handler({ ...request, params: match.params })
  if (method !== 'GET') saveDb()
  return result === undefined ? undefined : structuredClone(result)
}
