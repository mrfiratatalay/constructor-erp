import { get, patch, post, put, type DemoRoute } from '@/core/demo/server/demoRouter'
import {
  createDepot,
  createMaterial,
  listLocations,
  listMaterials,
  listParties,
  updateMaterial,
} from './catalogHandlers'
import { cancelShipment, editShipment, receiveReturn } from './shipmentActions'
import { createShipment } from './shipmentCreate'
import { attachDocuments } from './shipmentDocuments'
import { getShipment, listFieldRefs, listShipments, listStock } from './shipmentQueries'

/**
 * Malzeme modülünün uçları: kartlar, taraflar, stok yerleri ve sevkiyat defteri. Excel dökümü
 * (/api/shipment-reports/export) burada yoktur: arayüz ona düz bir bağlantıyla gider, istek sahte backend'e uğramaz.
 */
export const materialsRoutes: DemoRoute[] = [
  get('/api/materials', listMaterials),
  post('/api/materials', createMaterial),
  put('/api/materials/:materialId', updateMaterial),
  get('/api/material-parties', listParties),
  get('/api/stock-locations', listLocations),
  post('/api/stock-locations', createDepot),
  get('/api/shipments', listShipments),
  post('/api/shipments', createShipment),
  get('/api/shipments/field-refs', listFieldRefs),
  get('/api/shipments/stock', listStock),
  get('/api/shipments/:shipmentId', getShipment),
  patch('/api/shipments/:shipmentId', editShipment),
  post('/api/shipments/:shipmentId/cancellation', cancelShipment),
  post('/api/shipments/:shipmentId/documents', attachDocuments),
  post('/api/shipments/:shipmentId/return', receiveReturn),
]
