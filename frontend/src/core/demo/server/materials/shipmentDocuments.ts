import type { DocumentView } from '@/core/api/generated/model'
import { badRequest } from '@/core/demo/server/demoError'
import { newId } from '@/core/demo/server/demoIds'
import type { DemoRequest } from '@/core/demo/server/demoRequest'
import { allow, ledgerFor, requireShipment } from './materialAccess'
import type { DocumentRecord } from './materialRecords'
import { attach } from './shipmentChanges'
import { documentView } from './shipmentViews'

const MAX_BYTES = 10 * 1024 * 1024
const EXTENSIONS: Record<string, string> = { 'application/pdf': 'pdf', 'image/jpeg': 'jpg', 'image/png': 'png' }

function requireAcceptable(file: File): void {
  if (!EXTENSIONS[file.type]) throw badRequest(`Yalnızca PDF, JPG ya da PNG eklenir: ${file.name}`)
  if (file.size > MAX_BYTES) throw badRequest(`Belge en çok 10 MB olabilir: ${file.name}`)
}

/** Kullanıcının dosya adı yalnızca gösterilir: yol parçaları atılır, boşsa türüne göre ad verilir. */
function fileNameOf(file: File): string {
  const name = file.name.slice(Math.max(file.name.lastIndexOf('/'), file.name.lastIndexOf('\\')) + 1).trim()
  const safe = name || `belge.${EXTENSIONS[file.type]}`
  return safe.length > 200 ? safe.slice(-200) : safe
}

/**
 * Belge bağlantısı yeni sekmede açılır; tarayıcılar veri adresini (data:) yeni sekmede açmadığı için dosya
 * tarayıcıdaki adresiyle (blob:) durur. O adres yalnızca açık sekmede yaşar: sayfa yenilenince bağlantı açılmaz.
 */
function documentOf(file: File, createdById: string, createdAt: string): DocumentRecord {
  return {
    id: newId(),
    fileName: fileNameOf(file),
    contentType: file.type,
    sizeBytes: file.size,
    url: URL.createObjectURL(file),
    createdById,
    createdAt,
  }
}

/** POST /api/shipments/:shipmentId/documents: irsaliye, kamyon yüklenirken telefonla çekilen fotoğraf ya da PDF. */
export function attachDocuments({ params, form }: DemoRequest): DocumentView[] {
  const member = allow('CREATE_MATERIAL_MOVEMENT')
  const shipment = requireShipment(ledgerFor(member), params.shipmentId)
  const files = form.files.files ?? []
  if (!files.length) throw badRequest('Eklenecek belgeyi seç.')
  files.forEach(requireAcceptable)
  // Birlikte eklenen belgelerin geçmiş satırları ayrı anlara düşer; ekran satırı türü ve zamanıyla ayırt eder.
  const now = Date.now()
  return files.map((file, index) => {
    const document = documentOf(file, member.person.id, new Date(now + index).toISOString())
    attach(shipment, document)
    return documentView(document)
  })
}
