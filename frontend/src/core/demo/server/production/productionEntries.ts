import type { ProductionEntryView } from '@/core/api/generated/model'
import { nowIso, today } from '@/core/demo/server/demoClock'
import { db } from '@/core/demo/server/demoDb'
import { badRequest, DemoError, notFound } from '@/core/demo/server/demoError'
import type { DemoRequest, FormFields } from '@/core/demo/server/demoRequest'
import type { Member } from '@/core/demo/server/demoSession'
import { uploadedMedia } from '@/core/demo/server/posts/media'
import { addPost, retractPost } from '@/core/demo/server/posts/postStore'
import { figuresOf, roundTo, sumOf } from './productionFigures'
import { entriesOf, productionMember, requireItem } from './productionLookups'
import type { ProductionEntryRecord, ProductionItemRecord } from './productionRecords'
import { fieldBody, tidy } from './productionText'
import { entryViewOf } from './productionViews'

const FILE_LIMIT = 10

/** Formdan okunan giriş. Çok parçalı formda sayılar ve "true" yazı olarak gelir. */
interface EntryInput {
  id: string
  day: string
  quantity: number
  workerCount: number | null
  note: string | null
  onField: boolean
  files: File[]
}

function workerCountOf(text: string | undefined): number | null {
  if (!text) return null
  const count = Number(text)
  if (!Number.isInteger(count) || count < 1 || count > 999) {
    throw badRequest('Çalışan sayısı 1 ile 999 arasında olmalı.')
  }
  return count
}

/** 0 geçerlidir: "çalışma yapılmadı". */
function inputOf({ text, files }: FormFields): EntryInput {
  const quantity = Number(text.quantity)
  if (!text.id || !text.day || !text.quantity || !(quantity >= 0)) throw badRequest('Bugün yapılan miktarı yaz.')
  return {
    id: text.id,
    day: text.day,
    quantity: roundTo(quantity, 3),
    workerCount: workerCountOf(text.workerCount),
    note: tidy(text.note),
    onField: text.onField === 'true',
    files: files.files ?? [],
  }
}

/** Girişe yalnızca fotoğraf ve PDF eklenir: sahadan kanıt, video ya da ses değil. */
function checkFiles(files: File[]): void {
  if (files.length > FILE_LIMIT) throw badRequest(`Bir gönderide en fazla ${FILE_LIMIT} dosya olabilir.`)
  const accepted = (file: File) => file.type.startsWith('image/') || file.type === 'application/pdf'
  if (!files.every(accepted)) throw badRequest('Yalnızca fotoğraf ve PDF eklenebilir.')
}

/** Kimliği telefon üretir: aynı kimlikle tekrar gelen istek (internet koptu, yeniden denendi) ikinci giriş açmaz. */
function sameEntry(entry: ProductionEntryRecord, member: Member, itemId: string): ProductionEntryRecord {
  if (entry.itemId !== itemId || entry.createdById !== member.person.id) {
    throw new DemoError(409, 'Bu giriş kimliği başka bir girişe ait.')
  }
  return entry
}

async function newEntry(
  item: ProductionItemRecord,
  input: EntryInput,
  authorId: string,
): Promise<ProductionEntryRecord> {
  const createdAt = nowIso()
  const { id, day, quantity, workerCount, note } = input
  const media = await uploadedMedia(input.files, createdAt)
  const place = { itemId: item.id, companyId: item.companyId, siteId: item.siteId }
  return { id, ...place, day, quantity, workerCount, note, postId: null, media, createdById: authorId, createdAt }
}

/**
 * Saha'ya sıradan bir saha güncellemesi düşer; yazısı bu girişle ulaşılan toplamı söyler. Fotoğraflar gönderide de
 * görünür; kopyası verilir ki Saha'daki gönderi silinince girişin dosyaları yerinde kalsın.
 */
function publish(item: ProductionItemRecord, entry: ProductionEntryRecord): string {
  const after = figuresOf(item.totalQuantity, sumOf(entriesOf(item.id)))
  const media = entry.media.map((file) => ({ ...file }))
  const body = fieldBody(item, entry, after)
  const fieldPost = { siteId: item.siteId, authorId: entry.createdById, body, media, createdAt: entry.createdAt }
  return addPost({ ...fieldPost, fieldUpdate: true }).id
}

/** "Günlük İlerleme": yalnızca şef girer. İleri bir güne giriş olmaz, geçmiş güne olur. */
export async function addEntry({ params, form }: DemoRequest): Promise<ProductionEntryView> {
  const member = productionMember('MANAGE_PRODUCTION')
  const input = inputOf(form)
  const existing = db().production.entries.find((entry) => entry.id === input.id)
  if (existing) return entryViewOf(sameEntry(existing, member, params.itemId!))
  const item = requireItem(member, params.itemId!)
  if (input.day > today()) throw badRequest('İleri bir güne giriş yapılmaz.')
  checkFiles(input.files)
  const entry = await newEntry(item, input, member.person.id)
  db().production.entries.push(entry)
  if (input.onField) entry.postId = publish(item, entry)
  return entryViewOf(entry)
}

/** Silinen giriş toplamdan düşer; Saha'ya yansıtıldıysa oradaki gönderi de geri çekilir. */
export function deleteEntry({ params }: DemoRequest): void {
  const member = productionMember('MANAGE_PRODUCTION')
  const entries = db().production.entries
  const entry = entries.find(
    (candidate) => candidate.id === params.entryId && candidate.companyId === member.company.id,
  )
  if (!entry) throw notFound('Giriş')
  entries.splice(entries.indexOf(entry), 1)
  if (entry.postId) retractPost(entry.postId, member.person.id)
}
