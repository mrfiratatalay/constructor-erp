// Kayıtların saatini çekim gününün akışına yerleştirir (yalnızca demo veritabanı, santiye_video). Ürün her kaydı
// atıldığı an damgalar; seed hepsini birkaç saniyede attığı için saatler burada, her kaydın kendi gününe göre düzeltilir.
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dayOffset } from './clock.mjs'

const ROOT = fileURLToPath(new URL('../../../', import.meta.url))
const TZ = 'Europe/Istanbul'

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

/**
 * Şantiyeler eylül başında kuruldu; sevkiyatlar günlerinin mesai saatlerinde (bugünkü demir 10:20); taşerondan
 * dönen kalıp 5 gün önce; imalat girişleri günün akşamında. Sevkiyatın Saha'ya düşürdüğü kayıt, sevkiyatın saatinde.
 */
export function settleHistory() {
  const today = dayOffset(0)
  sql(`
    update sites set created_at = timestamptz '${dayOffset(-51)}T09:00:00+03:00' + (random() * interval '3 days');
    update site_events e set created_at = s.created_at + interval '2 minutes' from sites s where s.id = e.site_id;
    update material_shipments set day = date '${dayOffset(-5)}' where type = 'RETURN';
    update material_shipments set created_at = case
        when day = date '${today}' then (day + time '10:20') at time zone '${TZ}'
        else (day + time '08:35' + (number % 9) * interval '53 minutes') at time zone '${TZ}' end;
    update material_shipment_events e set created_at = s.created_at from material_shipments s where s.id = e.shipment_id;
    update posts p set created_at = s.created_at
      from material_field_posts f join material_shipments s on s.id = f.shipment_id where p.id = f.post_id;
    update production_entries set created_at = (day + case when day = date '${today}' then time '13:40'
      else time '17:10' + (random() * interval '70 minutes') end) at time zone '${TZ}';
    update production_items i set created_at = (select min(created_at) from production_entries e where e.item_id = i.id) - interval '1 day'
      where exists (select 1 from production_entries e where e.item_id = i.id);
  `)
}

/** Kişilerin şantiyeyi son görme anı: dünün akşamı; bugünün mesajları okunmamış görünür. */
export function settleVisits() {
  sql(`update site_visits set seen_at = timestamptz '${dayOffset(-1)}T19:30:00+03:00';`)
}
