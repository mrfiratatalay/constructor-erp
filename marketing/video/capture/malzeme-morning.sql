-- Sunucunun saati değiştirilemez: çekim gece de yapılsa bugünün sevkiyatı sabah 09:32'de (telefonun saati) çıkmış
-- görünsün. Sevkiyat, geçmişi, irsaliyesi ve şantiyenin Saha akışına bıraktığı kart birlikte taşınır; iade (eski
-- sevkiyatın bugünkü satırı) 10:15'te, patronun masasında olur.
create temporary table morning as
select id from material_shipments where day = (now() at time zone 'Europe/Istanbul')::date;
update material_shipments
set created_at = ((now() at time zone 'Europe/Istanbul')::date + time '09:32') at time zone 'Europe/Istanbul'
where id in (select id from morning);
update material_shipment_events
set created_at = ((now() at time zone 'Europe/Istanbul')::date + time '09:32') at time zone 'Europe/Istanbul'
where shipment_id in (select id from morning);
update material_documents
set created_at = ((now() at time zone 'Europe/Istanbul')::date + time '09:33') at time zone 'Europe/Istanbul'
where shipment_id in (select id from morning);
update posts p
set created_at = ((now() at time zone 'Europe/Istanbul')::date + time '09:32') at time zone 'Europe/Istanbul'
from material_field_posts f
where p.id = f.post_id and f.shipment_id in (select id from morning);
update material_shipment_events
set created_at = ((now() at time zone 'Europe/Istanbul')::date + time '10:15') at time zone 'Europe/Istanbul'
where (created_at at time zone 'Europe/Istanbul')::date = (now() at time zone 'Europe/Istanbul')::date
  and shipment_id not in (select id from morning);
