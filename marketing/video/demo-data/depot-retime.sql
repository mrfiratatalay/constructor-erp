-- API geçmişe saat yazamaz: geçmiş sevkiyatlar, günü geldiğinde sabah 08:30 ile 11:00 arasında depocunun elinden
-- çıkmış gibi görünsün. İrsaliye bir dakika sonra eklenir; iptal aynı gün, yarım saat sonra.
update material_shipments s
set created_at = (s.day + time '08:30' + (abs(hashtext(s.id::text)) % 150) * interval '1 minute')
                 at time zone 'Europe/Istanbul'
where s.day < (now() at time zone 'Europe/Istanbul')::date;

update material_shipment_events e
set created_at = s.created_at + case e.kind
    when 'CREATED' then interval '0 minutes'
    when 'DOCUMENT_ADDED' then interval '1 minute'
    else interval '35 minutes' end
from material_shipments s
where e.shipment_id = s.id and s.day < (now() at time zone 'Europe/Istanbul')::date;

update material_documents d
set created_at = s.created_at + interval '1 minute'
from material_shipments s
where d.shipment_id = s.id and s.day < (now() at time zone 'Europe/Istanbul')::date;

-- Şantiyeye giden sevkiyat o şantiyenin Saha akışına bir kart bırakır: kart da sevkiyatın saatinde görünsün.
update posts p
set created_at = s.created_at
from material_field_posts f
join material_shipments s on s.id = f.shipment_id
where p.id = f.post_id and s.day < (now() at time zone 'Europe/Istanbul')::date;
