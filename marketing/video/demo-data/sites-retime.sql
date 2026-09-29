-- Şantiyeler ve ekip bu gece kuruldu; oysa akışta haftalar öncesinden mesajlar, puantajda ayın ilk günü var. Kuruluş
-- "dün" kalırsa şantiye listesinde her şantiyenin altında "Şantiyeyi sen kurdun · Dün" yazar, akışın dibine de
-- düşer. Firma uygulamaya geçen ay başlamış gibi görünsün: tamamlanan şantiye önce, ötekiler beşer gün arayla açılır;
-- ekip ertesi sabah, bağlantıya dokunduğu sırayla katılır.
create temporary table site_opening as
select id,
       (date_trunc('month', now() at time zone 'Europe/Istanbul')::date
        - 5 * (count(*) over () - row_number() over (order by status = 'COMPLETED' desc, created_at) + 1)::int
        + time '08:30') at time zone 'Europe/Istanbul' as opened_at
from sites;

update sites s
set created_at = o.opened_at
from site_opening o
where s.id = o.id;

update site_events e
set created_at = o.opened_at
from site_opening o
where e.site_id = o.id and e.kind = 'CREATED';

update site_events e
set created_at = o.opened_at + interval '1 day' + j.position * interval '7 minutes'
from site_opening o,
     (select id, row_number() over (partition by site_id order by created_at, id) as position
      from site_events
      where kind <> 'CREATED') j
where e.id = j.id and e.site_id = o.id;
