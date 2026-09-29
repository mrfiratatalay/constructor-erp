-- Malzeme çekimi bugünün sevkiyatını ve bir iadeyi kendisi girer. Yeniden çekerken önce bugün girilen her şey geri
-- alınır: sevkiyatlar, kalemleri, irsaliyeleri, geçmişleri ve şantiye akışına bıraktıkları kartlar.
create temporary table today_shipments as
select id from material_shipments where day = (now() at time zone 'Europe/Istanbul')::date;
create temporary table today_posts as
select post_id from material_field_posts where shipment_id in (select id from today_shipments);

delete from material_field_posts where shipment_id in (select id from today_shipments);
delete from posts where id in (select post_id from today_posts);
delete from material_documents where shipment_id in (select id from today_shipments);
delete from material_shipment_events where shipment_id in (select id from today_shipments);
delete from material_shipment_lines where shipment_id in (select id from today_shipments);
-- İade eski sevkiyatın geçmişine de bir satır yazar ("Malzeme geri geldi"): o satır da bugünündür, silinir.
delete from material_shipment_events
where (created_at at time zone 'Europe/Istanbul')::date = (now() at time zone 'Europe/Istanbul')::date;
delete from material_shipments where id in (select id from today_shipments);
-- Sevkiyat numarası (SV-000018) her çekimde aynı kalsın: sayaç son kalan sevkiyata geri sarılır.
do $$ begin perform setval('material_shipment_number_seq', (select coalesce(max(number), 1) from material_shipments)); end $$;
