import { today } from '@/core/demo/server/demoClock'
import { DB_VERSION, type DemoDatabase } from '@/core/demo/server/demoDb'
import { emptyMaterials } from '@/core/demo/server/materials/materialRecords'
import { seedMaterials } from '@/core/demo/server/materials/materialSeed'
import { emptyPlatform } from '@/core/demo/server/platform/platformSeed'
import { seedPlatform } from '@/core/demo/server/platform/platformSeed'
import { seedPosts } from '@/core/demo/server/posts/postSeed'
import { emptyProduction } from '@/core/demo/server/production/productionRecords'
import { seedProduction } from '@/core/demo/server/production/productionSeed'
import { emptyPuantaj } from '@/core/demo/server/puantaj/puantajRecords'
import { seedPuantaj } from '@/core/demo/server/puantaj/puantajSeed'
import { seedTasks } from '@/core/demo/server/tasks/taskSeed'
import type { Seed, SeedContext } from './seedContext'
import { seedCompany, seedPeople } from './seedPeople'
import { seedSiteEvents, seedSites } from './seedSites'

/** Sıra önemli: İlerleme, yoklamanın taşeron ekiplerine bağlanır; platform da firmanın sayılarını okur. */
const MODULE_SEEDS: Seed[] = [seedPosts, seedTasks, seedPuantaj, seedMaterials, seedProduction, seedPlatform]

function createContext(): SeedContext {
  const company = seedCompany()
  const people = seedPeople(company)
  return { company, people, sites: seedSites(company.id, people.kemal) }
}

/**
 * Demo firmasının örnek verisi, bugüne göre. Tohumlama sırasında modüller `db()`'yi değil kendilerine verilen
 * taslağı kullanır: veritabanı henüz kurulmadı.
 */
export function seedDatabase(): DemoDatabase {
  const context = createContext()
  const draft: DemoDatabase = {
    version: DB_VERSION,
    seededOn: today(),
    session: null,
    companies: [context.company],
    people: Object.values(context.people),
    sites: Object.values(context.sites),
    siteEvents: seedSiteEvents(context),
    visits: [],
    sitePins: [],
    posts: [],
    tasks: [],
    puantaj: emptyPuantaj(),
    materials: emptyMaterials(),
    production: emptyProduction(),
    platform: emptyPlatform(),
  }
  for (const seed of MODULE_SEEDS) seed(draft, context)
  return draft
}
