import { today } from './demoClock'
import type { MaterialsState } from './materials/materialRecords'
import type { CompanyRecord, PersonRecord, SessionRecord } from './people/peopleRecords'
import type { PlatformState } from './platform/platformRecords'
import type { PostRecord } from './posts/postRecords'
import type { ProductionState } from './production/productionRecords'
import type { PuantajState } from './puantaj/puantajRecords'
import type { SiteEventRecord, SitePinRecord, SiteRecord, VisitRecord } from './sites/siteRecords'
import type { TaskRecord } from './tasks/taskRecords'

/** Sahte backend'in bütün verisi. Gerçek veritabanındaki tablolar burada diziler; modüllerin kendi dilimi var. */
export interface DemoDatabase {
  version: number
  seededOn: string
  session: SessionRecord | null
  companies: CompanyRecord[]
  people: PersonRecord[]
  sites: SiteRecord[]
  siteEvents: SiteEventRecord[]
  visits: VisitRecord[]
  sitePins: SitePinRecord[]
  posts: PostRecord[]
  tasks: TaskRecord[]
  puantaj: PuantajState
  materials: MaterialsState
  production: ProductionState
  platform: PlatformState
}

/** Örnek veri değişince artar: tarayıcıda kalmış eski demo verisi yenisiyle değişir. */
export const DB_VERSION = 1
const STORAGE_KEY = 'constructor-erp.demo'

type Seeder = () => DemoDatabase

let database: DemoDatabase | null = null
let seeder: Seeder | null = null

/** Örnek veriyi üreten fonksiyon açılışta bir kez verilir (installDemo); döngüsel import olmasın diye buradan çağrılmaz. */
export function setSeeder(seed: Seeder) {
  seeder = seed
}

/**
 * Kayıtlı demo yalnızca aynı gün tohumlandıysa kullanılır. Örnek kayıtlar bugüne göre yazıldığı için ertesi gün
 * yeniden üretilir; böylece "Bugün" ekranı hiçbir zaman bayat görünmez. Oturum korunur (kimlikler sabittir).
 */
function loadSaved(): DemoDatabase | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const saved = raw ? (JSON.parse(raw) as DemoDatabase) : null
    return saved && saved.version === DB_VERSION ? saved : null
  } catch {
    // Gizli sekme ya da kapalı depolama: demo bellekte çalışır, sayfa yenilenince baştan başlar.
    return null
  }
}

function fresh(previous: DemoDatabase | null): DemoDatabase {
  const next = seeder!()
  const person = previous?.session?.personId
  next.session = person && next.people.some((candidate) => candidate.id === person) ? previous!.session : null
  return next
}

export function db(): DemoDatabase {
  if (database) return database
  const saved = loadSaved()
  database = saved && saved.seededOn === today() ? saved : fresh(saved)
  saveDb()
  return database
}

export function saveDb(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database))
  } catch {
    // Kota dolduysa (çok fotoğraf yüklendiyse) son hali bellekte kalır; demo çalışmaya devam eder.
  }
}

/** "Demoyu sıfırla": her şey ilk haline döner, oturum kapanır. */
export function resetDb(): void {
  database = { ...seeder!(), session: null }
  saveDb()
}
