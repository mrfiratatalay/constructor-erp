// Kayıtların "ne zaman"ı: API kayıtları şu anın saatiyle yazar (çekim gecesi). Demo verisi gerçek bir iş gününe
// benzesin diye zaman damgaları geriye, gerçekçi saatlere çekilir. Yalnızca izole video veritabanında.
import { sql } from '../lib/sql.mjs'

const STATEMENTS = `
update material_shipments set created_at = (day::timestamp + time '09:00' + number * interval '7 minutes') at time zone 'Europe/Istanbul';
update material_shipments set created_at = timestamp '2026-10-02 10:58' at time zone 'Europe/Istanbul' where day = date '2026-10-02';
update material_shipment_events e set created_at = s.created_at from material_shipments s where s.id = e.shipment_id;
update posts p set created_at = s.created_at from material_field_posts f join material_shipments s on s.id = f.shipment_id
  where f.post_id = p.id;
update site_events set created_at = timestamp '2026-09-14 08:30' at time zone 'Europe/Istanbul' where kind = 'MEMBER_JOINED';
update site_events set created_at = timestamp '2026-09-01 09:00' at time zone 'Europe/Istanbul' where kind = 'CREATED';
update sites set created_at = timestamp '2026-09-01 09:00' at time zone 'Europe/Istanbul';
update users set created_at = timestamp '2026-09-14 08:30' at time zone 'Europe/Istanbul'
  where created_at > timestamp '2026-10-02 12:00' at time zone 'Europe/Istanbul';
update roster_entries set created_at = timestamp '2026-08-31 09:00' at time zone 'Europe/Istanbul';
update puantaj_marks set marked_at = (day::timestamp + time '08:20') at time zone 'Europe/Istanbul';
update production_items set created_at = (start_date::timestamp - interval '1 day' + time '16:00') at time zone 'Europe/Istanbul';
update tasks set created_at = timestamp '2026-10-01 18:10' at time zone 'Europe/Istanbul';
update tasks set completed_at = timestamp '2026-10-02 10:30' at time zone 'Europe/Istanbul' where completed_at is not null;
`

export const fixTimes = () => sql(STATEMENTS)
