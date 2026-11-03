import { del, get, patch, post, type DemoRoute } from '@/core/demo/server/demoRouter'
import { addEntry, deleteEntry } from './productionEntries'
import { createItem, deleteItem, updateItem } from './productionItems'
import { getBoard, getItemDetail, listCrews } from './productionReads'

/**
 * İlerleme uçları (backend'deki ProductionController ve ProductionEditController). Okumak VIEW_PRODUCTION ister,
 * yazmak MANAGE_PRODUCTION: veriyi yalnızca şantiye şefi girer. Excel raporu axios'tan değil düz bağlantıyla
 * indiği için burada değildir.
 */
export const productionRoutes: DemoRoute[] = [
  get('/api/sites/:siteId/production', getBoard),
  post('/api/sites/:siteId/production/items', createItem),
  get('/api/production/items/:itemId', getItemDetail),
  patch('/api/production/items/:itemId', updateItem),
  del('/api/production/items/:itemId', deleteItem),
  post('/api/production/items/:itemId/entries', addEntry),
  del('/api/production/entries/:entryId', deleteEntry),
  get('/api/production/crews', listCrews),
]
