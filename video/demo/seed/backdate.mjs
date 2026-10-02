// Gönderilerin saatini çekim gününün akışına yerleştirir (yalnızca demo veritabanı, santiye_video). Ürün saati
// gönderiyi atıldığı an damgalar; seed hepsini birkaç saniyede attığı için saatler burada düzeltilir.
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dayOffset } from './clock.mjs'

const ROOT = fileURLToPath(new URL('../../../', import.meta.url))

export function sql(statements) {
  execFileSync('docker', ['compose', '-f', `${ROOT}docker-compose.yml`, 'exec', '-T', 'postgres', 'psql', '-U', 'santiye',
    '-d', 'santiye_video', '-v', 'ON_ERROR_STOP=1', '-q'], { input: statements, stdio: ['pipe', 'inherit', 'inherit'] })
}

export const stamp = ([day, time]) => `${dayOffset(day)}T${time}:00+03:00`

export function backdatePosts(posted) {
  const lines = posted.map(({ id, at }) =>
    `update posts set created_at = '${stamp(at)}' where id = '${id}';\n` +
    `update media set created_at = '${stamp(at)}' where post_id = '${id}';`)
  sql(lines.join('\n'))
}

/** Sevkiyatın Saha'ya düşürdüğü "Malzeme yolda" kaydı, sevkiyatın gününe; bugünkü sevkiyat sabah 10:20'ye. */
export function backdateShipmentPosts() {
  sql(`update posts p set created_at = ((s.day + case when s.day = date '${dayOffset(0)}' then time '10:20' else time '10:45' end)
         at time zone 'Europe/Istanbul')
       from material_field_posts f join material_shipments s on s.id = f.shipment_id where p.id = f.post_id;`)
}

/** Kişilerin şantiyeyi son görme anı: önceki ziyaret çizgisi ve okunmamış sayıları doğal dursun. */
export function settleVisits() {
  sql(`update site_visits set seen_at = (select min(created_at) from posts) - interval '1 hour';`)
}
