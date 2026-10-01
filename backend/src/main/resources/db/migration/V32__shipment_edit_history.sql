-- Hareketin rota ve miktarı değişmez; tarih/açıklama düzeltmesi önceki değerleriyle geçmişe yazılır.
alter table material_shipment_events drop constraint if exists material_movement_events_kind_check;
alter table material_shipment_events drop constraint if exists material_shipment_events_kind_check;
alter table material_shipment_events add constraint material_shipment_events_kind_check
    check (kind in ('CREATED', 'DELIVERED', 'UPDATED', 'EDITED', 'CANCELLED', 'RETURN_ADDED', 'DOCUMENT_ADDED'));

-- İki adet 500 karakterlik açıklamanın eski/yeni değerleri kesilmeden saklanır.
alter table material_shipment_events alter column note type text;
