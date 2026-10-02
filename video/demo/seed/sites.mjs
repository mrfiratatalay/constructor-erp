// Şantiyeler ve sohbetleri. Gönderiler gerçek yazarının oturumuyla atılır; saatleri sonra backdate.mjs ile çekim
// gününün akışına (07:52, 09:40, 11:05 …) yerleştirilir: ürünün saati çekimde tek an gösterir.
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { fileOf, form } from './api.mjs'
import { SITES } from './content.mjs'

const OUT = fileURLToPath(new URL('../../out/', import.meta.url))
const photo = (name) => `${OUT}photos/${name}.jpg`
const asset = (name) => `${OUT}assets/${name}`

/** Kurulumda açılan Yomra Park'a ek iki şantiye; üçünün de kapak fotoğrafı. */
export async function seedSites(owner) {
  const existing = await owner.get('/api/sites')
  const yomra = existing.find((site) => site.name === SITES.yomra.name)
  const kasustu = await owner.post('/api/sites', SITES.kasustu)
  const sahil = await owner.post('/api/sites', SITES.sahil)
  const covers = [[yomra, 'santiye-yomra'], [kasustu, 'santiye-kasustu'], [sahil, 'santiye-sahil']]
  for (const [site, name] of covers) await owner.put(`/api/sites/${site.id}/photo`, form({ file: await fileOf(photo(name)) }))
  return { yomra: yomra.id, kasustu: kasustu.id, sahil: sahil.id }
}

/**
 * Sohbet ve Saha geçmişi. at: İstanbul saatiyle "gün HH:MM" (gün: bugüne göre fark). field: Saha günlüğünde de
 * görünür; issue: sorun bildirimi. Bugünün 14:20 kaydı (kolon kalıpları) çekimde canlı gönderilir, burada yoktur.
 */
export const THREADS = {
  yomra: [
    { by: 'ayse', at: [-2, '08:05'], body: '1. kat duvar örümü bitti, iskele 2. kata taşındı.', field: true, files: [photo('santiye-yomra')] },
    { by: 'mehmet', at: [-2, '10:40'], body: '40 adet kalıp paneli şantiyeye çıktı.' },
    { by: 'kemal', at: [-2, '16:12'], body: 'Elinize sağlık. Yarın demirciler kaçta başlıyor?' },
    { by: 'ayse', at: [-2, '16:20'], body: '08:00\'de sahadalar.' },
    { by: 'ayse', at: [-1, '09:15'], body: '3. kat iç cephede alçı başladı.', field: true, files: [photo('alci-3-kat')] },
    { by: 'musa', at: [-1, '11:30'], body: 'Kolon donatıları bağlandı, kontrole hazır.', field: true },
    { by: 'burak', at: [-1, '15:45'], body: 'İskele güvenlik kontrolü yarın sabah yapılacak.' },
    { by: 'ayse', at: [0, '07:52'], body: 'Günaydın. Bugün 2. kat kolonları kapatıyoruz, demirciler 3. kat döşemede.' },
    { by: 'mehmet', at: [0, '10:14'], body: 'Demir kamyona yüklendi, yarım saate şantiyede.' },
    { by: 'ayse', at: [0, '09:40'], body: 'Beton pompasının geliş saati bekleniyor.', field: true, issue: true },
    { by: 'kemal', at: [0, '10:12'], body: 'Pompa firmasını arıyorum.' },
    { by: 'mehmet', at: [0, '11:05'], body: 'İnşaat demiri şantiyeye teslim edildi.', field: true, files: [photo('demir-teslim')] },
    { by: 'mehmet', at: [0, '11:08'], files: [asset('sesli-not.ogg')] },
    { by: 'musa', at: [0, '12:40'], body: 'Kuzey cepheden genel görünüm.', files: [asset('santiye-video.mp4')] },
    { by: 'kemal', at: [0, '13:15'], body: 'Pompa 15:00\'te şantiyede, haber verdiler.' },
    { by: 'ayse', at: [0, '13:21'], body: 'Tamamdır, ekibi hazırlıyorum 👍' },
  ],
  kasustu: [
    { by: 'burak', at: [-1, '17:10'], body: '7. kat döşeme kalıbı tamam.', field: true, files: [photo('santiye-kasustu')] },
    { by: 'burak', at: [0, '08:45'], body: '7. kat döşeme betonu yarın 08:00\'de.', field: true },
    { by: 'kemal', at: [0, '12:05'], body: 'Beton firmasıyla görüştüm, 3 mikser geliyor.' },
  ],
  sahil: [
    { by: 'burak', at: [-1, '14:30'], body: 'Çatı aktarımı bitti, iskele sökülüyor.', field: true, files: [photo('santiye-sahil')] },
    { by: 'mehmet', at: [0, '09:55'], body: '120 iskele elemanı depoya dönecek, kamyon yarın.' },
  ],
}

/** Döner: [{ id, at }] — backdate.mjs saatleri buna göre yazar. */
export async function seedThreads(sessions, siteIds) {
  const posted = []
  for (const [key, thread] of Object.entries(THREADS)) {
    for (const message of thread) {
      const id = randomUUID()
      const files = await Promise.all((message.files ?? []).map(fileOf))
      await sessions[message.by].post('/api/posts', form({
        id, siteId: siteIds[key], body: message.body, issue: String(Boolean(message.issue)),
        fieldUpdate: String(Boolean(message.field)), files,
      }))
      posted.push({ id, at: message.at })
    }
  }
  return posted
}
